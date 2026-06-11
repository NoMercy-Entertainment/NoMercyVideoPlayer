/**
 * Regression: DesktopUiPlugin must resolve hover-thumbnail sprites from
 * VideoPlaylistItem.previewSpriteUrl (the canonical v2 field) and must NOT
 * require a legacy tracks[].kind==='thumbnails' entry.
 *
 * Root cause fixed: loadSpritesForItem only read readSidecarTracks(), so
 * items that went through normalizeVideoItem (which strips tracks[] and
 * populates previewSpriteUrl) always produced no hover thumbnails. The
 * canonical typed field is now the primary resolution path; the legacy
 * tracks[] path remains as a fallback for un-normalised v1 items.
 *
 * Covered:
 *   - previewSpriteUrl → loadSpriteSet called with correct URL
 *   - legacy tracks[].kind==='thumbnails' → loadSpriteSet called (fallback)
 *   - previewSpriteUrl takes precedence over a legacy tracks entry
 *   - item with neither field → loadSpriteSet not called
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { desktopUiPlugin } from '../../plugins/desktop-ui';
import * as spriteModule from '../../plugins/desktop-ui/sprite';

type ResizeCallback = (entries: Array<{ contentRect: { width: number } }>) => void;
const MockResizeObserver = vi.fn(function (this: unknown, _cb: ResizeCallback) {
	return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
});

async function makePlayer(): Promise<NMVideoPlayer> {
	const player = new NMVideoPlayer('test').setup({});
	await player.addPlugin(desktopUiPlugin).ready();
	return player;
}

describe('DesktopUiPlugin — sprite URL resolution', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const container = document.createElement('div');
		container.id = 'test';
		container.className = 'nomercyplayer';
		document.body.appendChild(container);
		vi.stubGlobal('ResizeObserver', MockResizeObserver);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('calls loadSpriteSet with previewSpriteUrl when item carries the canonical field', async () => {
		const loadSpy = vi.spyOn(spriteModule, 'loadSpriteSet').mockResolvedValue(null);
		const player = await makePlayer();

		player.emit('current', {
			item: {
				id: 'movie-1',
				url: 'http://example.test/movie.m3u8',
				previewSpriteUrl: 'http://example.test/sprites.vtt',
			},
			index: 0,
		});

		await new Promise(resolve => setTimeout(resolve, 20));

		expect(loadSpy).toHaveBeenCalledOnce();
		expect(loadSpy).toHaveBeenCalledWith('http://example.test/sprites.vtt', expect.objectContaining({ fetchText: expect.any(Function), fetchImageUrl: expect.any(Function) }));
	});

	it('calls loadSpriteSet with legacy tracks file when no previewSpriteUrl present', async () => {
		const loadSpy = vi.spyOn(spriteModule, 'loadSpriteSet').mockResolvedValue(null);
		const player = await makePlayer();

		// Deliberately un-normalised v1 item: `tracks[]` not yet promoted to
		// `previewSpriteUrl`. `tracks` is intentionally absent from VideoPlaylistItem
		// so the whole payload is cast as never — same pattern as other tests that
		// exercise runtime paths outside the typed event surface.
		player.emit('current' as never, {
			item: { id: 'movie-2', url: 'http://example.test/movie.m3u8', tracks: [{ kind: 'thumbnails', file: 'http://example.test/legacy-sprites.vtt' }] },
			index: 0,
		} as never);

		await new Promise(resolve => setTimeout(resolve, 20));

		expect(loadSpy).toHaveBeenCalledOnce();
		expect(loadSpy).toHaveBeenCalledWith('http://example.test/legacy-sprites.vtt', expect.objectContaining({ fetchText: expect.any(Function), fetchImageUrl: expect.any(Function) }));
	});

	it('previewSpriteUrl takes precedence over a legacy tracks entry', async () => {
		const loadSpy = vi.spyOn(spriteModule, 'loadSpriteSet').mockResolvedValue(null);
		const player = await makePlayer();

		// Item carries both fields; canonical path must win.
		// tracks[] not on VideoPlaylistItem — cast as never for the same reason.
		player.emit('current' as never, {
			item: { id: 'movie-3', url: 'http://example.test/movie.m3u8', previewSpriteUrl: 'http://example.test/canonical.vtt', tracks: [{ kind: 'thumbnails', file: 'http://example.test/legacy.vtt' }] },
			index: 0,
		} as never);

		await new Promise(resolve => setTimeout(resolve, 20));

		expect(loadSpy).toHaveBeenCalledOnce();
		expect(loadSpy).toHaveBeenCalledWith('http://example.test/canonical.vtt', expect.objectContaining({ fetchText: expect.any(Function), fetchImageUrl: expect.any(Function) }));
	});

	it('does not call loadSpriteSet when item has neither previewSpriteUrl nor thumbnails track', async () => {
		const loadSpy = vi.spyOn(spriteModule, 'loadSpriteSet').mockResolvedValue(null);
		const player = await makePlayer();

		player.emit('current', {
			item: {
				id: 'movie-4',
				url: 'http://example.test/movie.m3u8',
			},
			index: 0,
		});

		await new Promise(resolve => setTimeout(resolve, 20));

		expect(loadSpy).not.toHaveBeenCalled();
	});
});
