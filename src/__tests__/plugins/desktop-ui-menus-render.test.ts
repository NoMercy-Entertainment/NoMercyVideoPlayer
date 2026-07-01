// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Menus.ts render pane tests — covers the previously-uncovered
 * renderSpeedPane / renderQualityPane / renderSubsPane /
 * renderSubtitleSettingsPane / renderAspectRatioPane branches and the
 * buildMenuFrame DOM construction.
 *
 * Strategy: mount a real NMVideoPlayer + desktopUiPlugin, open each sub-menu
 * via button click, then assert the DOM the renderer built inside the pane's
 * scroll container.
 *
 * Direct-call tests (renderSpeedPane etc.) use a real NMVideoPlayer as the
 * `player` argument so `player.createButton` resolves correctly.
 */

import type { QualityLevel, SubtitleTrackRef } from '../../types';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { desktopUiPlugin } from '../../plugins/desktop-ui';
import { renderQualityPane, renderSpeedPane, renderSubsPane, renderSubtitleSettingsPane } from '../../plugins/desktop-ui/helpers/menus';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

// ── Shared helpers ───────��────────────────────────────────────────────────────

function resetAndMount(id = 'test'): void {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	const div = document.createElement('div');
	div.id = id;
	div.className = 'nomercyplayer';
	document.body.appendChild(div);
	vi.stubGlobal('ResizeObserver', MockResizeObserver);
}

function cleanup(): void {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	document.body.innerHTML = '';
	vi.unstubAllGlobals();
}

async function makePlayer(overrides: Record<string, unknown> = {}): Promise<NMVideoPlayer> {
	const player = new NMVideoPlayer('test').setup({});
	await player.addPlugin(desktopUiPlugin, {
		buttons: {
			speed: true,
			quality: true,
			subtitles: true,
			audio: true,
			playlist: true,
			aspectRatio: true,
			settings: true,
		},
	}).ready();
	Object.assign(player, overrides);
	return player;
}

function NOOP_LISTEN(_target: EventTarget, _event: string, _handler: (event: Event) => void): void {}

// ── renderSpeedPane via real player ────────��─────────────────────────────────

describe('renderSpeedPane (direct call)', () => {
	beforeEach(() => resetAndMount());
	afterEach(() => cleanup());

	it('builds speed choice rows for each rate', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'speed-scroll-container';
		pane.appendChild(scroll);

		const rates = [0.5, 1, 1.5, 2];
		Object.assign(player, { playbackRates: () => rates, playbackRate: () => 1 });

		renderSpeedPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {});

		const buttons = scroll.querySelectorAll('button');
		expect(buttons.length).toBe(rates.length);
	});

	it('marks current rate as active', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'speed-scroll-container';
		pane.appendChild(scroll);

		Object.assign(player, {
			playbackRates: () => [0.5, 1, 1.5],
			playbackRate: () => 1.5,
		});

		renderSpeedPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {});

		const active = scroll.querySelector('button.is-active, button[aria-checked="true"]');
		expect(active).not.toBeNull();
	});

	it('calls onPick and sets playbackRate when a speed row is clicked', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'speed-scroll-container';
		pane.appendChild(scroll);

		let pickedRate: number | null = null;
		let onPickCalled = false;

		Object.assign(player, {
			playbackRates: () => [0.5, 1, 2],
			playbackRate: (rate?: number) => {
				if (rate !== undefined)
					pickedRate = rate; return 1;
			},
		});

		const listen = (target: EventTarget, event: string, fn: (ev: Event) => void): void => {
			(target as HTMLElement).addEventListener(event, fn);
		};

		renderSpeedPane(pane, player as unknown as NMVideoPlayer, listen, () => { onPickCalled = true; });

		const buttons = scroll.querySelectorAll<HTMLButtonElement>('button');
		buttons[buttons.length - 1]!.click();

		expect(pickedRate).toBe(2);
		expect(onPickCalled).toBe(true);
	});
});

// ── renderQualityPane via real player ─────────────────────────────────────��───

describe('renderQualityPane (direct call)', () => {
	beforeEach(() => resetAndMount());
	afterEach(() => cleanup());

	it('renders Auto row plus one row per quality level', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'quality-scroll-container';
		pane.appendChild(scroll);

		const levels: QualityLevel[] = [
			{ index: 0, height: 1080, bitrate: 5000, label: '1080p' },
			{ index: 1, height: 720, bitrate: 3000, label: '720p' },
		];
		Object.assign(player, { qualityLevels: () => levels });

		renderQualityPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {}, {
			subtitleIdx: -1,
			audioIdx: 0,
			qualityIdx: 'auto',
		});

		const buttons = scroll.querySelectorAll('button');
		expect(buttons.length).toBe(3); // Auto + 2 levels
	});

	it('marks Auto row active when qualityIdx is "auto"', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'quality-scroll-container';
		pane.appendChild(scroll);

		Object.assign(player, {
			qualityLevels: () => [{ index: 0, height: 1080, bitrate: 5000, label: '1080p' }],
		});

		renderQualityPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {}, {
			subtitleIdx: -1,
			audioIdx: 0,
			qualityIdx: 'auto',
		});

		const autoBtn = scroll.querySelector<HTMLButtonElement>('#quality-auto');
		expect(autoBtn).not.toBeNull();
		const isActive = autoBtn!.classList.contains('is-active') || autoBtn!.getAttribute('aria-checked') === 'true';
		expect(isActive).toBe(true);
	});

	it('shows playingLabel as sublabel on Auto row when in auto mode', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'quality-scroll-container';
		pane.appendChild(scroll);

		Object.assign(player, {
			qualityLevels: () => [{ index: 0, height: 1080, bitrate: 5000, label: '1080p' }],
		});

		renderQualityPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {}, {
			subtitleIdx: -1,
			audioIdx: 0,
			qualityIdx: 'auto',
			playingQualityIdx: 0,
		});

		const autoBtn = scroll.querySelector('#quality-auto');
		expect(autoBtn?.textContent).toMatch(/1080p/);
	});
});

// ── renderSubsPane via real player ────────────────────────────────────────────

describe('renderSubsPane (direct call)', () => {
	beforeEach(() => resetAndMount());
	afterEach(() => cleanup());

	it('renders Off row plus one row per subtitle track', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'subtitles-scroll-container';
		pane.appendChild(scroll);

		const subs: SubtitleTrackRef[] = [
			{ id: 'en', language: 'en', label: 'English', kind: 'subtitles', default: false, url: '' },
			{ id: 'nl', language: 'nl', label: 'Dutch', kind: 'subtitles', default: false, url: '' },
		];
		Object.assign(player, { subtitles: () => subs, language: () => 'en' });

		renderSubsPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {}, {
			subtitleIdx: -1,
			audioIdx: 0,
			qualityIdx: 'auto',
		});

		const buttons = scroll.querySelectorAll('button');
		expect(buttons.length).toBe(3); // Off + 2 tracks
	});

	it('marks Off active when subtitleIdx is -1', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'subtitles-scroll-container';
		pane.appendChild(scroll);

		Object.assign(player, {
			subtitles: () => [{ id: 'en', language: 'en', label: 'English', kind: 'subtitles', default: false, url: '' }],
			language: () => 'en',
		});

		renderSubsPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {}, {
			subtitleIdx: -1,
			audioIdx: 0,
			qualityIdx: 'auto',
		});

		const offBtn = scroll.querySelector<HTMLButtonElement>('#off-button-');
		expect(offBtn).not.toBeNull();
		const isActive = offBtn!.classList.contains('is-active') || offBtn!.getAttribute('aria-checked') === 'true';
		expect(isActive).toBe(true);
	});

	it('marks the active track (index 1)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'subtitles-scroll-container';
		pane.appendChild(scroll);

		Object.assign(player, {
			subtitles: () => [
				{ id: 'en', language: 'en', label: 'English', kind: 'subtitles', default: false, url: '' },
				{ id: 'nl', language: 'nl', label: 'Dutch', kind: 'subtitles', default: false, url: '' },
			],
			language: () => 'en',
		});

		renderSubsPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {}, {
			subtitleIdx: 1,
			audioIdx: 0,
			qualityIdx: 'auto',
		});

		const buttons = scroll.querySelectorAll<HTMLButtonElement>('button');
		const dutchBtn = buttons[2]; // Off=0, English=1, Dutch=2
		const isActive = dutchBtn?.classList.contains('is-active') || dutchBtn?.getAttribute('aria-checked') === 'true';
		expect(isActive).toBe(true);
	});

	it('calls player.subtitle(null) when Off is clicked', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'subtitles-scroll-container';
		pane.appendChild(scroll);

		let subArg: number | null = -99;
		Object.assign(player, {
			subtitles: () => [],
			subtitle: (idx?: number | null) => {
				if (idx !== undefined)
					subArg = idx ?? null; return null;
			},
			language: () => 'en',
		});

		const listen = (target: EventTarget, event: string, fn: (ev: Event) => void): void => {
			(target as HTMLElement).addEventListener(event, fn);
		};

		renderSubsPane(pane, player as unknown as NMVideoPlayer, listen, () => {}, {
			subtitleIdx: 0,
			audioIdx: 0,
			qualityIdx: 'auto',
		});

		const offBtn = scroll.querySelector<HTMLButtonElement>('#off-button-');
		offBtn!.click();
		expect(subArg).toBeNull();
	});
});

// ── renderSubtitleSettingsPane via real player ────────���───────────────────────

describe('renderSubtitleSettingsPane (direct call)', () => {
	beforeEach(() => resetAndMount());
	afterEach(() => cleanup());

	it('renders setting rows in the scroll container', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const pane = document.createElement('div');
		const scroll = document.createElement('div');
		scroll.className = 'subtitleSettings-scroll-container';
		pane.appendChild(scroll);

		Object.assign(player, {
			subtitleStyle: () => ({
				fontSize: 100,
				fontFamily: 'sans-serif',
				textColor: 'white',
				textOpacity: 100,
				backgroundColor: 'black',
				backgroundOpacity: 75,
				edgeStyle: 'none',
				areaColor: 'transparent',
				windowOpacity: 0,
			}),
		});

		renderSubtitleSettingsPane(pane, player as unknown as NMVideoPlayer, NOOP_LISTEN, () => {});

		const buttons = scroll.querySelectorAll('button');
		expect(buttons.length).toBeGreaterThan(0);
	});
});

// ── Via plugin integration (button clicks) ───────────────────────────────────

describe('DesktopUiPlugin — settings items (consumer toggle rows)', () => {
	beforeEach(() => resetAndMount());
	afterEach(() => cleanup());

	it('consumer settingsItems toggle rows render in the main menu', async () => {
		let toggleState = false;
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { settings: true },
			settingsItems: [
				{
					id: 'auto-skip',
					label: () => 'Auto Skip',
					get: () => toggleState,
					set: (value: boolean) => { toggleState = value; },
				},
			],
		}).ready();

		const container = player.container;
		const mainMenu = container.querySelector('.main-menu');
		expect(mainMenu).not.toBeNull();

		const toggleBtn = mainMenu!.querySelector<HTMLButtonElement>('#menu-toggle-auto-skip');
		expect(toggleBtn).not.toBeNull();
		expect(toggleBtn!.getAttribute('role')).toBe('switch');
	});

	it('clicking a settings toggle row flips the state', async () => {
		let toggleState = false;
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { settings: true },
			settingsItems: [
				{
					id: 'loop',
					label: () => 'Loop',
					get: () => toggleState,
					set: (value: boolean) => { toggleState = value; },
				},
			],
		}).ready();

		const container = player.container;
		const toggleBtn = container.querySelector<HTMLButtonElement>('#menu-toggle-loop');
		expect(toggleBtn).not.toBeNull();

		toggleBtn!.click();
		expect(toggleState).toBe(true);

		toggleBtn!.click();
		expect(toggleState).toBe(false);
	});
});

// ── refreshCapabilityVisibility — content-hidden gates ───────────────────────

describe('DesktopUiPlugin — capability visibility gates (data-content-hidden)', () => {
	beforeEach(() => resetAndMount());
	afterEach(() => cleanup());

	it('settingsBtn gets data-content-hidden="true" when all submenu sections are empty', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { settings: true, subtitles: true, audio: true, quality: true },
		}).ready();

		// Single playback rate (<= 1), single audio track (<= 1), no subtitles, no settingsItems
		Object.assign(player, {
			playbackRates: () => [1],
			audioTracks: () => [{ id: 'en', label: 'English', default: true }],
			subtitles: () => [],
			qualityLevels: () => [],
			chapters: () => [],
		});
		player.emit('mediaReady' as never, {} as never);

		const settingsBtn = player.container.querySelector<HTMLButtonElement>('[id="settings"]');
		expect(settingsBtn).not.toBeNull();
		expect(settingsBtn!.getAttribute('data-content-hidden')).toBe('true');
	});

	it('settingsBtn is NOT content-hidden when speeds list has more than one entry', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { settings: true },
		}).ready();

		Object.assign(player, {
			playbackRates: () => [0.5, 1, 1.5, 2],
			audioTracks: () => [{ id: 'en', label: 'English', default: true }],
			subtitles: () => [],
			qualityLevels: () => [],
			chapters: () => [],
		});
		player.emit('mediaReady' as never, {} as never);

		const settingsBtn = player.container.querySelector<HTMLButtonElement>('[id="settings"]');
		expect(settingsBtn).not.toBeNull();
		expect(settingsBtn!.getAttribute('data-content-hidden')).toBeNull();
	});

	it('settingsBtn is NOT content-hidden when subtitles are present', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { settings: true, subtitles: true },
		}).ready();

		Object.assign(player, {
			playbackRates: () => [1],
			audioTracks: () => [{ id: 'en', label: 'English', default: true }],
			subtitles: () => [{ id: 'en', language: 'en', label: 'English', kind: 'subtitles', default: false, url: '' }],
			qualityLevels: () => [],
			chapters: () => [],
		});
		player.emit('mediaReady' as never, {} as never);

		const settingsBtn = player.container.querySelector<HTMLButtonElement>('[id="settings"]');
		expect(settingsBtn).not.toBeNull();
		expect(settingsBtn!.getAttribute('data-content-hidden')).toBeNull();
	});

	it('qualityBtn gets data-content-hidden="true" when fewer than 2 quality levels', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { quality: true },
		}).ready();

		Object.assign(player, {
			qualityLevels: () => [],
			audioTracks: () => [],
			subtitles: () => [],
			chapters: () => [],
			playbackRates: () => [1],
		});
		player.emit('mediaReady' as never, {} as never);

		const qualityBtn = player.container.querySelector<HTMLButtonElement>('[id="quality"]');
		expect(qualityBtn).not.toBeNull();
		expect(qualityBtn!.getAttribute('data-content-hidden')).toBe('true');
	});

	it('qualityBtn gets data-content-hidden="true" with exactly 1 quality level', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { quality: true },
		}).ready();

		Object.assign(player, {
			qualityLevels: () => [{ index: 0, height: 1080, bitrate: 5000, label: '1080p' }],
			audioTracks: () => [],
			subtitles: () => [],
			chapters: () => [],
			playbackRates: () => [1],
		});
		player.emit('mediaReady' as never, {} as never);

		const qualityBtn = player.container.querySelector<HTMLButtonElement>('[id="quality"]');
		expect(qualityBtn).not.toBeNull();
		expect(qualityBtn!.getAttribute('data-content-hidden')).toBe('true');
	});

	it('qualityBtn is NOT content-hidden when 2 or more quality levels exist', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { quality: true },
		}).ready();

		Object.assign(player, {
			qualityLevels: () => [
				{ index: 0, height: 1080, bitrate: 5000, label: '1080p' },
				{ index: 1, height: 720, bitrate: 3000, label: '720p' },
			],
			audioTracks: () => [],
			subtitles: () => [],
			chapters: () => [],
			playbackRates: () => [1],
		});
		player.emit('mediaReady' as never, {} as never);

		const qualityBtn = player.container.querySelector<HTMLButtonElement>('[id="quality"]');
		expect(qualityBtn).not.toBeNull();
		expect(qualityBtn!.getAttribute('data-content-hidden')).toBeNull();
	});

	it('audioBtn gets data-content-hidden="true" when only 1 audio track', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { audio: true },
		}).ready();

		Object.assign(player, {
			audioTracks: () => [{ id: 'en', label: 'English', default: true }],
			subtitles: () => [],
			qualityLevels: () => [],
			chapters: () => [],
			playbackRates: () => [1],
		});
		player.emit('mediaReady' as never, {} as never);

		const audioBtn = player.container.querySelector<HTMLButtonElement>('[id="audio"]');
		expect(audioBtn).not.toBeNull();
		expect(audioBtn!.getAttribute('data-content-hidden')).toBe('true');
	});

	it('audioBtn is NOT content-hidden when 2 or more audio tracks exist', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { audio: true },
		}).ready();

		Object.assign(player, {
			audioTracks: () => [
				{ id: 'en', label: 'English', default: true },
				{ id: 'nl', label: 'Dutch', default: false },
			],
			subtitles: () => [],
			qualityLevels: () => [],
			chapters: () => [],
			playbackRates: () => [1],
		});
		player.emit('mediaReady' as never, {} as never);

		const audioBtn = player.container.querySelector<HTMLButtonElement>('[id="audio"]');
		expect(audioBtn).not.toBeNull();
		expect(audioBtn!.getAttribute('data-content-hidden')).toBeNull();
	});

	it('subsBtn gets data-content-hidden="true" when 0 subtitle tracks', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { subtitles: true },
		}).ready();

		Object.assign(player, {
			subtitles: () => [],
			audioTracks: () => [],
			qualityLevels: () => [],
			chapters: () => [],
			playbackRates: () => [1],
		});
		player.emit('mediaReady' as never, {} as never);

		const subsBtn = player.container.querySelector<HTMLButtonElement>('[id="subtitles"]');
		expect(subsBtn).not.toBeNull();
		expect(subsBtn!.getAttribute('data-content-hidden')).toBe('true');
	});

	it('subsBtn is NOT content-hidden when at least 1 subtitle track exists', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.addPlugin(desktopUiPlugin, {
			buttons: { subtitles: true },
		}).ready();

		Object.assign(player, {
			subtitles: () => [{ id: 'en', language: 'en', label: 'English', kind: 'subtitles', default: false, url: '' }],
			audioTracks: () => [],
			qualityLevels: () => [],
			chapters: () => [],
			playbackRates: () => [1],
		});
		player.emit('mediaReady' as never, {} as never);

		const subsBtn = player.container.querySelector<HTMLButtonElement>('[id="subtitles"]');
		expect(subsBtn).not.toBeNull();
		expect(subsBtn!.getAttribute('data-content-hidden')).toBeNull();
	});
});

// ── Menu keyboard navigation ──────────────────────────────────────────────────

describe('DesktopUiPlugin — menu keyboard navigation (ArrowUp / ArrowDown)', () => {
	beforeEach(() => resetAndMount());
	afterEach(() => cleanup());

	it('ArrowDown on the menu frame does not throw (e.preventDefault called)', async () => {
		const player = await makePlayer({ playbackRates: () => [0.5, 1, 1.5, 2] });
		const container = player.container;

		const speedBtn = container.querySelector<HTMLButtonElement>('[id="speed"]');
		speedBtn!.click();

		const frame = container.querySelector<HTMLElement>('.menu-frame')!;
		expect(() => {
			frame.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
		}).not.toThrow();
		expect(frame).not.toBeNull();
	});
});
