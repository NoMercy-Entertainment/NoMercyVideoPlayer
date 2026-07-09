// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Tests for the desktop-ui tooltip helpers (`helpers/tooltips.ts`):
 * `addTooltip` (debounced show / hide / shared token slot), `clampTooltip`
 * (horizontal edge clamping against the slider-bar fence), and `wireTooltips`
 * (per-button label wiring incl. dynamic prev/next/chapter titles).
 *
 * Timers are driven through the injected `scheduleTimeout` seam — no fake
 * timers needed. Geometry is stubbed per element because happy-dom reports
 * zero-size rects.
 */

import type { Chapter } from '@nomercy-entertainment/nomercy-player-core';
import type { SliderBarRefs } from '../../plugins/desktop-ui/helpers/progressBar';
import type { TooltipButtonRefs } from '../../plugins/desktop-ui/helpers/tooltips';
import type { IVideoPlayer, VideoPlaylistItem } from '../../types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../../index';
import { addTooltip, clampTooltip, wireTooltips } from '../../plugins/desktop-ui/helpers/tooltips';

const BUTTON_NAMES = [
	'playBtn',
	'rewindBtn',
	'forwardBtn',
	'volBtn',
	'aspectRatioBtn',
	'theaterBtn',
	'pipBtn',
	'speedBtn',
	'subsBtn',
	'audioBtn',
	'qualityBtn',
	'playlistBtn',
	'settingsBtn',
	'fsBtn',
	'prevBtn',
	'nextBtn',
	'chapBackBtn',
	'chapFwdBtn',
] as const;

interface TooltipHarness {
	tokenValue: () => number | null;
	getToken: () => number | null;
	setToken: (token: number | null) => void;
	scheduled: Array<() => void>;
	delays: number[];
	scheduleTimeout: (fn: () => void, ms: number) => number;
	runLastScheduled: () => void;
	listen: (target: EventTarget, event: string, fn: (event: Event) => void) => void;
}

function buildHarness(): TooltipHarness {
	let token: number | null = null;
	const scheduled: Array<() => void> = [];
	const delays: number[] = [];

	return {
		tokenValue: () => token,
		getToken: () => token,
		setToken: (value) => { token = value; },
		scheduled,
		delays,
		scheduleTimeout: (fn, ms) => {
			scheduled.push(fn);
			delays.push(ms);
			return scheduled.length;
		},
		runLastScheduled: () => { scheduled[scheduled.length - 1]!(); },
		listen: (target, event, fn) => { target.addEventListener(event, fn); },
	};
}

function buildSliderRefs(): SliderBarRefs {
	const make = (): HTMLDivElement => document.createElement('div');
	return {
		sliderBar: make(),
		sliderBuffer: make(),
		sliderHover: make(),
		sliderProgress: make(),
		chapterBar: make(),
		sliderNipple: make(),
		sliderPop: make(),
		sliderPopImage: make(),
		sliderPopText: make(),
		chapterText: make(),
	};
}

function stubRect(el: HTMLElement, rect: { left: number; right: number; width: number }): void {
	Object.assign(el, {
		getBoundingClientRect: () => ({
			left: rect.left,
			right: rect.right,
			width: rect.width,
			top: 0,
			bottom: 0,
			height: 0,
			x: rect.left,
			y: 0,
			toJSON: () => ({}),
		}),
	});
}

function stubOffsetWidth(el: HTMLElement, width: number): void {
	Object.defineProperty(el, 'offsetWidth', { value: width, configurable: true });
}

describe('desktop-ui tooltip helpers', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
	});

	// ── addTooltip ──────────────────────────────────────────────────────────────

	describe('addTooltip', () => {
		function buildButton(): HTMLButtonElement {
			const btn = document.createElement('button');
			btn.setAttribute('title', 'native tooltip');
			document.body.appendChild(btn);
			return btn;
		}

		it('appends a span.tooltip to the button and strips the native title attribute', () => {
			const harness = buildHarness();
			const btn = buildButton();

			addTooltip(btn, () => 'Play', harness.listen, buildSliderRefs(), document.body, harness.getToken, harness.setToken, harness.scheduleTimeout);

			expect(btn.querySelector('span.tooltip')).not.toBeNull();
			expect(btn.hasAttribute('title')).toBe(false);
		});

		it('mouseenter schedules the show after 500 ms; running it reveals the lazy text', () => {
			const harness = buildHarness();
			const btn = buildButton();
			let label = 'Play';

			addTooltip(btn, () => label, harness.listen, buildSliderRefs(), document.body, harness.getToken, harness.setToken, harness.scheduleTimeout);
			const tip = btn.querySelector<HTMLSpanElement>('span.tooltip')!;

			btn.dispatchEvent(new MouseEvent('mouseenter'));
			expect(harness.delays).toEqual([500]);
			expect(harness.tokenValue()).toBe(1);
			expect(tip.classList.contains('tooltip-visible')).toBe(false);

			harness.runLastScheduled();
			expect(tip.classList.contains('tooltip-visible')).toBe(true);
			expect(tip.textContent).toBe('Play');

			// The label is re-evaluated on each hover — dynamic labels stay current.
			label = 'Pause';
			btn.dispatchEvent(new MouseEvent('mouseenter'));
			harness.runLastScheduled();
			expect(tip.textContent).toBe('Pause');
		});

		it('re-entering replaces the pending token in the shared slot', () => {
			const harness = buildHarness();
			const btn = buildButton();

			addTooltip(btn, () => 'Play', harness.listen, buildSliderRefs(), document.body, harness.getToken, harness.setToken, harness.scheduleTimeout);

			btn.dispatchEvent(new MouseEvent('mouseenter'));
			btn.dispatchEvent(new MouseEvent('mouseenter'));

			expect(harness.scheduled).toHaveLength(2);
			expect(harness.tokenValue()).toBe(2);
		});

		it('mouseleave hides the tooltip and clears the pending token', () => {
			const harness = buildHarness();
			const btn = buildButton();

			addTooltip(btn, () => 'Play', harness.listen, buildSliderRefs(), document.body, harness.getToken, harness.setToken, harness.scheduleTimeout);
			const tip = btn.querySelector<HTMLSpanElement>('span.tooltip')!;

			btn.dispatchEvent(new MouseEvent('mouseenter'));
			harness.runLastScheduled();
			expect(tip.classList.contains('tooltip-visible')).toBe(true);
			expect(harness.tokenValue()).not.toBeNull();

			btn.dispatchEvent(new MouseEvent('mouseleave'));
			expect(tip.classList.contains('tooltip-visible')).toBe(false);
			expect(harness.tokenValue()).toBeNull();
		});

		it('click hides the tooltip', () => {
			const harness = buildHarness();
			const btn = buildButton();

			addTooltip(btn, () => 'Play', harness.listen, buildSliderRefs(), document.body, harness.getToken, harness.setToken, harness.scheduleTimeout);
			const tip = btn.querySelector<HTMLSpanElement>('span.tooltip')!;

			btn.dispatchEvent(new MouseEvent('mouseenter'));
			harness.runLastScheduled();
			expect(tip.classList.contains('tooltip-visible')).toBe(true);

			btn.dispatchEvent(new MouseEvent('click'));
			expect(tip.classList.contains('tooltip-visible')).toBe(false);
		});
	});

	// ── clampTooltip ────────────────────────────────────────────────────────────

	describe('clampTooltip', () => {
		function buildClampFixture(btnLeft: number): { tip: HTMLSpanElement; btn: HTMLButtonElement; sliderRefs: SliderBarRefs } {
			const sliderRefs = buildSliderRefs();
			stubRect(sliderRefs.sliderBar, { left: 100, right: 500, width: 400 });

			const btn = document.createElement('button');
			stubRect(btn, { left: btnLeft, right: btnLeft + 40, width: 40 });

			const tip = document.createElement('span');
			stubOffsetWidth(tip, 100);

			return { tip, btn, sliderRefs };
		}

		it('keeps a centered tooltip unshifted', () => {
			const { tip, btn, sliderRefs } = buildClampFixture(280); // center 300, tip spans 250..350

			clampTooltip(tip, btn, sliderRefs, document.body);

			expect(tip.style.transform).toBe('translateX(calc(-50% + 0px))');
			expect(tip.style.getPropertyValue('--arrow-x')).toBe('calc(50% - 0px)');
		});

		it('shifts right when the tooltip would escape the left fence', () => {
			const { tip, btn, sliderRefs } = buildClampFixture(100); // center 120, raw left 70 < fence 100

			clampTooltip(tip, btn, sliderRefs, document.body);

			expect(tip.style.transform).toBe('translateX(calc(-50% + 30px))');
			expect(tip.style.getPropertyValue('--arrow-x')).toBe('calc(50% - 30px)');
		});

		it('shifts left when the tooltip would escape the right fence', () => {
			const { tip, btn, sliderRefs } = buildClampFixture(460); // center 480, raw right 530 > fence 500

			clampTooltip(tip, btn, sliderRefs, document.body);

			expect(tip.style.transform).toBe('translateX(calc(-50% + -30px))');
			expect(tip.style.getPropertyValue('--arrow-x')).toBe('calc(50% - -30px)');
		});
	});

	// ── wireTooltips ────────────────────────────────────────────────────────────

	describe('wireTooltips', () => {
		interface WireFixture {
			refs: TooltipButtonRefs;
			harness: TooltipHarness;
			translateCalls: Array<{ key: string; params: Record<string, string> | undefined }>;
			showTooltip: (btn: HTMLButtonElement) => string;
		}

		async function buildWireFixture(opts: {
			queue?: VideoPlaylistItem[];
			currentIndex?: number;
			chapters?: Chapter[];
			currentTime?: number;
		} = {}): Promise<WireFixture> {
			const player = new NMVideoPlayer('test').setup({});
			await player.ready();
			Object.assign(player, {
				queue: () => opts.queue ?? [],
				chapters: () => opts.chapters ?? [],
				time: (seconds?: number) => {
					if (seconds === undefined)
						return opts.currentTime ?? 0;
					return Promise.resolve();
				},
			});

			const harness = buildHarness();
			const translateCalls: Array<{ key: string; params: Record<string, string> | undefined }> = [];
			const translate = (key: string, params?: Record<string, string>): string => {
				translateCalls.push({ key, params });
				return key;
			};

			const refs = Object.fromEntries(
				BUTTON_NAMES.map((name) => {
					const btn = document.createElement('button');
					btn.dataset.ref = name;
					player.container.appendChild(btn);
					return [name, btn];
				}),
			) as unknown as TooltipButtonRefs;

			wireTooltips(
				player as unknown as IVideoPlayer<VideoPlaylistItem>,
				refs,
				buildSliderRefs(),
				harness.listen,
				harness.getToken,
				harness.setToken,
				harness.scheduleTimeout,
				translate,
				() => opts.currentIndex ?? 0,
			);

			const showTooltip = (btn: HTMLButtonElement): string => {
				btn.dispatchEvent(new MouseEvent('mouseenter'));
				harness.runLastScheduled();
				return btn.querySelector<HTMLSpanElement>('span.tooltip')!.textContent ?? '';
			};

			return { refs, harness, translateCalls, showTooltip };
		}

		it('attaches a tooltip span to every control-bar button', async () => {
			const fixture = await buildWireFixture();
			for (const name of BUTTON_NAMES) {
				expect(fixture.refs[name].querySelector('span.tooltip'), name).not.toBeNull();
			}
		});

		it('static buttons resolve their fixed translation keys on hover', async () => {
			const fixture = await buildWireFixture();
			expect(fixture.showTooltip(fixture.refs.playBtn)).toBe('tooltip.play');
			expect(fixture.showTooltip(fixture.refs.fsBtn)).toBe('tooltip.fullscreen');
			expect(fixture.showTooltip(fixture.refs.settingsBtn)).toBe('tooltip.settings');
			expect(fixture.showTooltip(fixture.refs.volBtn)).toBe('tooltip.mute');
		});

		it('prev/next tooltips include the adjacent item title when available', async () => {
			const fixture = await buildWireFixture({
				queue: [
					{ id: 'a', title: 'Episode One' },
					{ id: 'b', title: 'Episode Two' },
					{ id: 'c', title: 'Episode Three' },
				],
				currentIndex: 1,
			});

			expect(fixture.showTooltip(fixture.refs.prevBtn)).toBe('tooltip.previousWithTitle');
			expect(fixture.translateCalls.at(-1)).toEqual({
				key: 'tooltip.previousWithTitle',
				params: { title: 'Episode One' },
			});

			expect(fixture.showTooltip(fixture.refs.nextBtn)).toBe('tooltip.nextWithTitle');
			expect(fixture.translateCalls.at(-1)).toEqual({
				key: 'tooltip.nextWithTitle',
				params: { title: 'Episode Three' },
			});
		});

		it('prev/next fall back to the plain keys at the queue edges', async () => {
			const fixture = await buildWireFixture({
				queue: [{ id: 'only', title: 'Solo' }],
				currentIndex: 0,
			});

			expect(fixture.showTooltip(fixture.refs.prevBtn)).toBe('tooltip.previous');
			expect(fixture.showTooltip(fixture.refs.nextBtn)).toBe('tooltip.next');
		});

		it('chapter tooltips include the adjacent chapter title when available', async () => {
			const fixture = await buildWireFixture({
				chapters: [
					{ index: 0, start: 0, end: 10, title: 'Intro' },
					{ index: 1, start: 10, end: 20, title: 'Verse' },
					{ index: 2, start: 20, end: 30, title: 'Outro' },
				],
				currentTime: 15,
			});

			expect(fixture.showTooltip(fixture.refs.chapBackBtn)).toBe('tooltip.previousChapterWithTitle');
			expect(fixture.translateCalls.at(-1)).toEqual({
				key: 'tooltip.previousChapterWithTitle',
				params: { title: 'Verse' },
			});

			expect(fixture.showTooltip(fixture.refs.chapFwdBtn)).toBe('tooltip.nextChapterWithTitle');
			expect(fixture.translateCalls.at(-1)).toEqual({
				key: 'tooltip.nextChapterWithTitle',
				params: { title: 'Outro' },
			});
		});

		it('chapter tooltips fall back to the plain keys without chapters', async () => {
			const fixture = await buildWireFixture({ chapters: [], currentTime: 5 });

			expect(fixture.showTooltip(fixture.refs.chapBackBtn)).toBe('tooltip.chapterPrev');
			expect(fixture.showTooltip(fixture.refs.chapFwdBtn)).toBe('tooltip.chapterNext');
		});
	});
});
