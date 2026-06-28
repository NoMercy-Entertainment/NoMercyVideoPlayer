// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Extended SubtitleOverlayPlugin tests — extends slice-07's subtitle-overlay.test.ts.
 *
 * New coverage (previously at 59%, 71 uncov lines):
 *   - cue positioning: bottom-anchored when line > 50
 *   - cue positioning: top-anchored when line <= 50
 *   - cue positioning: bottom=0 when no line / line out of range
 *   - cue alignment: aligned-start / aligned-end / aligned-center classes
 *   - cue size / position geometry mapped to left + width CSS
 *   - applyStyleTo: inline styles applied from subtitleStyle
 *   - subtitleStyle event live-updates existing areas
 *   - item event clears all areas
 *   - setLanguage: data-language attribute on subtitle text spans
 *   - multi-cue pool management: area count grows to match cue count
 *   - area pool shrinks when cue count decreases
 *   - videoRect event repositions overlay
 *   - videoRect null falls back to 100%/0 sizing
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { subtitleOverlayPlugin } from '../../plugins/subtitle-overlay';

function setup(): NMVideoPlayer<any> {
	return new NMVideoPlayer('test').setup({});
}

function makeCue(overrides: {
	text?: string;
	start?: number;
	end?: number;
	line?: number | null;
	size?: number;
	position?: number;
	align?: 'start' | 'center' | 'end';
} = {}): Record<string, unknown> {
	return {
		text: overrides.text ?? 'Sample cue',
		start: overrides.start ?? 0,
		end: overrides.end ?? 5,
		line: overrides.line !== undefined ? overrides.line : 85,
		size: overrides.size ?? 80,
		position: overrides.position ?? 50,
		align: overrides.align ?? 'center',
	};
}

describe('SubtitleOverlayPlugin — cue positioning', () => {
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

	it('line > 50 produces bottom-anchored CSS (bottom set, top cleared)', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ line: 80 });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		const area = player.container.querySelector<HTMLElement>('.subtitle-area');
		expect(area).not.toBeNull();
		expect(area!.style.bottom).toBeTruthy();
		expect(area!.style.top).toBeFalsy();
	});

	it('line <= 50 produces top-anchored CSS (top set, bottom cleared)', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ line: 10 });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		const area = player.container.querySelector<HTMLElement>('.subtitle-area');
		expect(area).not.toBeNull();
		expect(area!.style.top).toBeTruthy();
		expect(area!.style.bottom).toBeFalsy();
	});

	it('no line (null) produces bottom:0 fallback', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ line: null });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		const area = player.container.querySelector<HTMLElement>('.subtitle-area');
		expect(area).not.toBeNull();
		expect(area!.style.bottom).toMatch(/^0(px)?$/);
	});

	it('align:start sets .aligned-start class', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ align: 'start' });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		const area = player.container.querySelector('.subtitle-area');
		expect(area?.classList.contains('aligned-start')).toBe(true);
	});

	it('align:end sets .aligned-end class', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ align: 'end' });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		const area = player.container.querySelector('.subtitle-area');
		expect(area?.classList.contains('aligned-end')).toBe(true);
	});

	it('align:center sets .aligned-center class', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ align: 'center' });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		const area = player.container.querySelector('.subtitle-area');
		expect(area?.classList.contains('aligned-center')).toBe(true);
	});

	it('cue size maps to width CSS on the area', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ size: 60, position: 50, align: 'center' });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		const area = player.container.querySelector<HTMLElement>('.subtitle-area');
		expect(area).not.toBeNull();
		expect(area!.style.width).toContain('%');
	});
});

describe('SubtitleOverlayPlugin — style application', () => {
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

	it('subtitleStyle event updates fontFamily on existing text spans', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		// Render a cue first so an area exists
		const cue = makeCue({ text: 'Styled' });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		const text = player.container.querySelector<HTMLElement>('.subtitle-text');
		expect(text).not.toBeNull();

		// Emit a style update
		(player as any).emit('subtitleStyle', {
			fontSize: 120,
			fontFamily: 'monospace',
			textColor: 'white',
			textOpacity: 100,
			backgroundColor: 'black',
			backgroundOpacity: 75,
			edgeStyle: 'none',
			areaColor: 'transparent',
			windowOpacity: 0,
		});
		await Promise.resolve();

		expect(text!.style.fontFamily).toContain('monospace');
	});
});

describe('SubtitleOverlayPlugin — pool management', () => {
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

	it('area pool grows to match multi-cue events', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cues = [makeCue({ text: 'Cue 1', line: 70 }), makeCue({ text: 'Cue 2', line: 80 })];
		(player as any).emit('subtitleCue', { cues, language: 'en' });
		await Promise.resolve();

		const areas = player.container.querySelectorAll('.subtitle-area');
		expect(areas.length).toBe(2);
	});

	it('area pool shrinks when fewer cues arrive', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		// First render two cues
		const cues2 = [makeCue({ text: 'A', line: 70 }), makeCue({ text: 'B', line: 80 })];
		(player as any).emit('subtitleCue', { cues: cues2, language: 'en' });
		await Promise.resolve();
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(2);

		// Now render just one cue
		const cues1 = [makeCue({ text: 'Only one', line: 85 })];
		(player as any).emit('subtitleCue', { cues: cues1, language: 'en' });
		await Promise.resolve();
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(1);
	});

	it('item event clears all subtitle areas', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ text: 'Visible before item change' });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();
		expect(player.container.querySelectorAll('.subtitle-area').length).toBeGreaterThanOrEqual(1);

		// Item change should clear all areas
		(player as any).emit('item', { item: null });
		await Promise.resolve();
		expect(player.container.querySelectorAll('.subtitle-area').length).toBe(0);
	});
});

describe('SubtitleOverlayPlugin — language attribute', () => {
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

	it('data-language attribute reflects the cue language', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ text: 'Bonjour' });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'fr' });
		await Promise.resolve();

		const text = player.container.querySelector('.subtitle-text');
		expect(text?.getAttribute('data-language')).toBe('fr');
	});

	it('data-language updates when language changes between cue events', async () => {
		const player = setup();
		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const cue = makeCue({ text: 'Hello' });
		(player as any).emit('subtitleCue', { cues: [cue], language: 'en' });
		await Promise.resolve();

		(player as any).emit('subtitleCue', { cues: [cue], language: 'de' });
		await Promise.resolve();

		const text = player.container.querySelector('.subtitle-text');
		expect(text?.getAttribute('data-language')).toBe('de');
	});
});

describe('SubtitleOverlayPlugin — videoRect binding', () => {
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

	it('videoRect event with a rect sizes the overlay to the given px dimensions', async () => {
		const player = setup();

		// Stub videoRect() so applyRect uses our dimensions
		Object.assign(player, {
			videoRect: () => ({ width: 640, height: 360 }),
		});

		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const overlay = player.container.querySelector<HTMLElement>('.subtitle-overlay');
		expect(overlay).not.toBeNull();

		// Emit videoRect event to trigger the resize handler
		(player as any).emit('videoRect', { width: 640, height: 360 });
		await Promise.resolve();

		expect(overlay!.style.width).toBe('640px');
		expect(overlay!.style.height).toBe('360px');
	});

	it('videoRect event with null falls back to 100% sizing', async () => {
		const player = setup();

		Object.assign(player, {
			videoRect: () => null,
		});

		player.addPlugin(subtitleOverlayPlugin);
		await player.ready();

		const overlay = player.container.querySelector<HTMLElement>('.subtitle-overlay');

		(player as any).emit('videoRect', null);
		await Promise.resolve();

		expect(overlay!.style.width).toBe('100%');
		expect(overlay!.style.height).toBe('100%');
	});
});
