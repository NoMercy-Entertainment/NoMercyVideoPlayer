/**
 * Regression tests for the lifecycle wave sprint (Bug 1 / Bug 2 / Bug 3 / Bug 4 / Bug 5):
 *
 * Bug 1 — startFragPrefetch flag is present in HLS.js config.
 * Bug 2 — wireSliderBar wires touchend for scrub-finalization.
 * Bug 3 — touchmove sets sliderPop --visibility to 1 while scrubbing.
 * Bug 4 — Core autoAdvance option calls next() on ended.
 * Bug 5 — Seek-preview reappears after mouseup outside the slider bar.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';

// ── shared setup ──────────────────────────────────────────────────────────────

function resetRegistry(): void {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
}

function mountDiv(id: string): void {
	const div = document.createElement('div');
	div.id = id;
	document.body.appendChild(div);
}

function setup(id: string): NMVideoPlayer<{ id: string; url: string }> {
	return new NMVideoPlayer(id).setup({}) as NMVideoPlayer<{ id: string; url: string }>;
}

// ── Bug 4 — core autoAdvance ──────────────────────────────────────────────────

describe('core autoAdvance option (video)', () => {
	beforeEach(() => {
		resetRegistry();
		mountDiv('aa-video');
	});
	afterEach(() => {
		resetRegistry();
		document.body.innerHTML = '';
	});

	it('calls next() on ended when autoAdvance is not set (defaults to true)', async () => {
		const player = setup('aa-video');
		await player.ready();

		const nextSpy = vi.spyOn(player, 'next').mockResolvedValue(undefined);

		player.queue([
			{ id: 'a', url: 'http://example.test/a.mp4' },
			{ id: 'b', url: 'http://example.test/b.mp4' },
		]);

		player.emit('ended', undefined);
		await new Promise(resolve => setTimeout(resolve, 20));

		expect(nextSpy).toHaveBeenCalledOnce();
		expect(nextSpy).toHaveBeenCalledWith({ source: 'auto-advance' });
	});

	it('does NOT call next() on ended when autoAdvance: false', async () => {
		const player = new NMVideoPlayer('aa-video').setup({ autoAdvance: false });
		await player.ready();

		const nextSpy = vi.spyOn(player, 'next').mockResolvedValue(undefined);

		player.queue([
			{ id: 'a', url: 'http://example.test/a.mp4' },
			{ id: 'b', url: 'http://example.test/b.mp4' },
		]);

		player.emit('ended', undefined);
		await new Promise(resolve => setTimeout(resolve, 20));

		expect(nextSpy).not.toHaveBeenCalled();
	});
});

// ── Bug 1 — HLS.js startFragPrefetch ─────────────────────────────────────────

describe('Html5VideoBackend HLS config', () => {
	it('Html5VideoBackend is importable', async () => {
		const { Html5VideoBackend } = await import('../../adapters/video-backend/html5');
		expect(typeof Html5VideoBackend).toBe('function');
	});

	it('startFragPrefetch:true is present in the HLS constructor call', async () => {
		// The dynamic import path (`import(/* @vite-ignore */ 'hls.js')`) makes
		// vi.doMock unusable here. Instead we verify the source of the backend
		// module directly — the config object must include startFragPrefetch:true.
		// This test is intentionally a static-analysis guard: if someone removes
		// the option, this test breaks immediately rather than at playback time.
		const { readFileSync } = await import('node:fs');
		const { resolve, dirname } = await import('node:path');
		const { fileURLToPath } = await import('node:url');
		const dir = dirname(fileURLToPath(import.meta.url));
		const hlsPath = resolve(dir, '../../adapters/video-backend/html5.ts');
		const src = readFileSync(hlsPath, 'utf8');
		expect(src).toContain('startFragPrefetch: true');
	});
});

// ── Bug 2 + Bug 3 — wireSliderBar touch wiring ───────────────────────────────

describe('wireSliderBar touch handling', () => {
	beforeEach(() => {
		resetRegistry();
		mountDiv('scrub-test');
	});
	afterEach(() => {
		resetRegistry();
		document.body.innerHTML = '';
	});

	it('touch-action: none is set on sliderBar', async () => {
		const { DesktopUiPlugin } = await import('../../plugins/desktop-ui/index');
		const player = setup('scrub-test');
		player.addPlugin(DesktopUiPlugin);
		await player.ready();

		const sliderBar = player.container.querySelector('.slider-bar') as HTMLElement | null;
		expect(sliderBar).not.toBeNull();
		expect(sliderBar!.style.touchAction).toBe('none');
	});

	it('touchend on sliderBar finalizes the scrub (isMouseDown resets)', async () => {
		const { DesktopUiPlugin } = await import('../../plugins/desktop-ui/index');
		const player = setup('scrub-test');
		player.addPlugin(DesktopUiPlugin);
		await player.ready();

		const sliderBar = player.container.querySelector('.slider-bar') as HTMLElement;

		// Simulate touchstart to set isMouseDown.
		sliderBar.dispatchEvent(new Event('touchstart', { bubbles: true }));

		// Confirm scrubbing class was added.
		expect(sliderBar.classList.contains('slider-scrubbing')).toBe(true);

		// Simulate touchend — must finalize the scrub without relying on click.
		sliderBar.dispatchEvent(new Event('touchend', { bubbles: true }));

		// After touchend, the scrubbing class must be removed.
		expect(sliderBar.classList.contains('slider-scrubbing')).toBe(false);
	});

	it('touchmove shows sliderPop while scrubbing', async () => {
		const { DesktopUiPlugin } = await import('../../plugins/desktop-ui/index');
		const player = setup('scrub-test');
		player.addPlugin(DesktopUiPlugin);
		await player.ready();

		const sliderBar = player.container.querySelector('.slider-bar') as HTMLElement;
		const sliderPop = player.container.querySelector('.slider-pop') as HTMLElement;

		// Start scrub.
		sliderBar.dispatchEvent(new Event('touchstart', { bubbles: true }));

		// touchmove must make the pop visible.
		sliderBar.dispatchEvent(new Event('touchmove', { bubbles: true }));

		expect(sliderPop.style.getPropertyValue('--visibility')).toBe('1');
	});

	// Bug 5 — seek-preview reappears after releasing the mouse outside the bar.
	it('document mouseup finalizes scrub and hides seek-preview (Bug 5)', async () => {
		const { DesktopUiPlugin } = await import('../../plugins/desktop-ui/index');
		const player = setup('scrub-test');
		player.addPlugin(DesktopUiPlugin);
		await player.ready();

		const sliderBar = player.container.querySelector('.slider-bar') as HTMLElement;
		const sliderPop = player.container.querySelector('.slider-pop') as HTMLElement;

		// Drag starts on the slider.
		sliderBar.dispatchEvent(new Event('mousedown', { bubbles: true }));
		expect(sliderBar.classList.contains('slider-scrubbing')).toBe(true);

		// Mouse moves over bar — pop becomes visible.
		sliderBar.dispatchEvent(new MouseEvent('touchmove', { bubbles: true }));

		// User releases outside the slider — only document mouseup fires.
		document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

		// Scrub must be finalized: class gone, pop hidden.
		expect(sliderBar.classList.contains('slider-scrubbing')).toBe(false);
		expect(sliderPop.style.getPropertyValue('--visibility')).toBe('0');
	});

	// Bug 6 — after click-to-seek the preview must come back on the next
	// mousemove over the bar, without leaving and re-entering first.
	it('seek-preview reappears on mousemove after click-to-seek (Bug 6)', async () => {
		const { DesktopUiPlugin } = await import('../../plugins/desktop-ui/index');
		const player = setup('scrub-test');
		player.addPlugin(DesktopUiPlugin);
		await player.ready();

		const sliderBar = player.container.querySelector('.slider-bar') as HTMLElement;
		const sliderPop = player.container.querySelector('.slider-pop') as HTMLElement;

		// Pointer enters the bar — pop shows.
		sliderBar.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
		expect(sliderPop.style.getPropertyValue('--visibility')).toBe('1');

		// Single click on the bar to seek: mousedown then mouseup (bubbles to
		// document). Finalize hides the pop at the seek moment.
		sliderBar.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		sliderBar.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		expect(sliderPop.style.getPropertyValue('--visibility')).toBe('0');

		// Pointer never left the bar; the next mousemove must bring it back.
		sliderBar.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
		expect(sliderPop.style.getPropertyValue('--visibility')).toBe('1');
	});
});
