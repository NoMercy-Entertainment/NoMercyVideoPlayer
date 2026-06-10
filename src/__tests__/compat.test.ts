import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { applyVideoV1Compat, nmplayer, nmVideoPlayer, normalizeVideoItem } from '../compat';
import { nmplayer as nmplayerV1, nmVideoPlayer as canonicalNmVideoPlayer, NMVideoPlayer, Plugin } from '../index';

describe('normalizeVideoItem', () => {
	it('maps subtitle tracks to subtitles[]', () => {
		const result = normalizeVideoItem({
			id: '1',
			tracks: [{ id: 1, kind: 'subtitles', file: 'en.vtt', label: 'English', language: 'en' }],
		});
		expect(result.subtitles).toBeDefined();
		expect(result.subtitles?.[0]?.language).toBe('en');
		expect('tracks' in result).toBe(false);
	});

	it('maps text-kind tracks to subtitles[]', () => {
		const result = normalizeVideoItem({
			id: '1',
			tracks: [{ kind: 'text', file: 'fr.vtt', label: 'French', language: 'fr' }],
		});
		expect(result.subtitles?.[0]?.language).toBe('fr');
	});

	it('maps untyped tracks (no kind) to subtitles[]', () => {
		const result = normalizeVideoItem({
			id: '1',
			tracks: [{ file: 'de.vtt', label: 'German', language: 'de' }],
		});
		expect(result.subtitles?.[0]?.language).toBe('de');
	});

	it('maps font tracks to fonts[]', () => {
		const result = normalizeVideoItem({
			id: '1',
			tracks: [{ kind: 'fonts', file: 'fonts.json', label: 'Fonts' }],
		});
		expect(result.fonts?.[0]?.file).toBe('fonts.json');
		expect('tracks' in result).toBe(false);
	});

	it('does not overwrite existing subtitles when tracks is also present', () => {
		const result = normalizeVideoItem({
			id: '1',
			subtitles: [{ id: 'sub-winner', url: 'winner.vtt', label: 'Winner' }],
			tracks: [{ kind: 'subtitles', file: 'loser.vtt', label: 'Loser' }],
		});
		expect(result.subtitles).toHaveLength(1);
		expect(result.subtitles?.[0]?.label).toBe('Winner');
	});

	it('maps thumbnails-kind tracks to previewSpriteUrl', () => {
		const result = normalizeVideoItem({
			id: '1',
			tracks: [{ kind: 'thumbnails', file: 'sprites.vtt' }],
		});
		expect(result.previewSpriteUrl).toBe('sprites.vtt');
		expect('tracks' in result).toBe(false);
	});

	it('does not overwrite existing previewSpriteUrl with thumbnails track', () => {
		const result = normalizeVideoItem({
			id: '1',
			previewSpriteUrl: 'canonical.vtt',
			tracks: [{ kind: 'thumbnails', file: 'legacy.vtt' }],
		});
		expect(result.previewSpriteUrl).toBe('canonical.vtt');
	});

	it('thumbnails track takes priority over chapters track for previewSpriteUrl', () => {
		const result = normalizeVideoItem({
			id: '1',
			tracks: [
				{ kind: 'thumbnails', file: 'sprites.vtt' },
				{ kind: 'chapters', file: 'chapters.vtt' },
			],
		});
		expect(result.previewSpriteUrl).toBe('sprites.vtt');
	});

	it('chapters track still promotes to previewSpriteUrl when no thumbnails track present', () => {
		const result = normalizeVideoItem({
			id: '1',
			tracks: [{ kind: 'chapters', file: 'chapters.vtt' }],
		});
		expect(result.previewSpriteUrl).toBe('chapters.vtt');
	});

	it('chapters track does not overwrite previewSpriteUrl already set on item', () => {
		const result = normalizeVideoItem({
			id: '1',
			previewSpriteUrl: 'canonical.vtt',
			tracks: [{ kind: 'chapters', file: 'chapters.vtt' }],
		});
		expect(result.previewSpriteUrl).toBe('canonical.vtt');
	});

	it('strips tracks field from output', () => {
		const result = normalizeVideoItem({ id: '1', tracks: [] });
		expect('tracks' in result).toBe(false);
	});

	it('is safe on an item with no tracks field', () => {
		const result = normalizeVideoItem({ id: '1', title: 'Movie' });
		expect(result.title).toBe('Movie');
		expect('tracks' in result).toBe(false);
	});
});

describe('applyVideoV1Compat', () => {
	it('maps debug:true to logLevel:"debug"', () => {
		const result = applyVideoV1Compat({ debug: true });
		expect(result.logLevel).toBe('debug');
	});

	it('maps accessToken to auth.bearerToken', () => {
		const result = applyVideoV1Compat({ accessToken: 'tok' });
		expect(result.auth?.bearerToken).toBe('tok');
	});

	it('does not overwrite existing auth.bearerToken', () => {
		const result = applyVideoV1Compat({
			accessToken: 'old',
			auth: { bearerToken: 'winner' },
		});
		expect(result.auth?.bearerToken).toBe('winner');
	});
});

describe('factory aliases', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'compat-video';
		document.body.appendChild(div);
	});

	afterEach(() => {
		document.body.innerHTML = '';
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	});

	it('nmVideoPlayer (compat re-export) is the same as index nmVideoPlayer', () => {
		expect(nmVideoPlayer).toBe(canonicalNmVideoPlayer);
	});

	it('nmplayer (compat re-export) is the same as nmVideoPlayer', () => {
		expect(nmplayer).toBe(nmVideoPlayer);
	});

	it('nmVideoPlayer (compat) creates a working NMVideoPlayer instance', () => {
		const player = nmVideoPlayer('compat-video');
		expect(player).toBeInstanceOf(NMVideoPlayer);
		player.dispose();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// v1 registerPlugin / usePlugin shims
// ─────────────────────────────────────────────────────────────────────────────

describe('nmplayer v1 shims — registerPlugin / usePlugin + Plugin lifecycle', () => {
	beforeEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'shim-video';
		document.body.appendChild(div);
		vi.spyOn(console, 'warn').mockImplementation(() => undefined);
	});

	afterEach(() => {
		document.body.innerHTML = '';
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		vi.restoreAllMocks();
	});

	it('nmplayer factory attaches registerPlugin and usePlugin to the instance', () => {
		const player = nmplayerV1('shim-video');
		const raw = player as unknown as Record<string, unknown>;
		expect(typeof raw['registerPlugin']).toBe('function');
		expect(typeof raw['usePlugin']).toBe('function');
		player.dispose();
	});

	it('v1 Plugin base class is exported and constructable', () => {
		expect(Plugin).toBeDefined();
		const plugin = new Plugin();
		expect(typeof plugin.initialize).toBe('function');
		expect(typeof plugin.use).toBe('function');
		expect(typeof plugin.dispose).toBe('function');
	});

	it('registerPlugin calls initialize(player) on the plugin instance', () => {
		const player = nmplayerV1('shim-video');
		const raw = player as unknown as Record<string, unknown>;

		const plugin = new Plugin();
		const initSpy = vi.spyOn(plugin, 'initialize');

		(raw['registerPlugin'] as (name: string, p: Plugin) => void)('testPlugin', plugin);

		expect(initSpy).toHaveBeenCalledWith(player);
		player.dispose();
	});

	it('usePlugin calls use() on the registered plugin', () => {
		const player = nmplayerV1('shim-video');
		const raw = player as unknown as Record<string, unknown>;

		const plugin = new Plugin();
		const useSpy = vi.spyOn(plugin, 'use');

		(raw['registerPlugin'] as (name: string, p: Plugin) => void)('testPlugin', plugin);
		(raw['usePlugin'] as (name: string) => void)('testPlugin');

		expect(useSpy).toHaveBeenCalledOnce();
		player.dispose();
	});

	it('usePlugin on an unknown name does not throw', () => {
		const player = nmplayerV1('shim-video');
		const raw = player as unknown as Record<string, unknown>;

		expect(() => {
			(raw['usePlugin'] as (name: string) => void)('does-not-exist');
		}).not.toThrow();
		player.dispose();
	});

	it('Plugin subclass initialize sets this.player and use() is called after usePlugin', () => {
		const player = nmplayerV1('shim-video');
		const raw = player as unknown as Record<string, unknown>;

		let capturedPlayer: unknown = null;
		let useWasCalled = false;

		class MyPlugin extends Plugin {
			override initialize(playerInstance: Parameters<Plugin['initialize']>[0]): void {
				super.initialize(playerInstance);
				capturedPlayer = playerInstance;
			}

			override use(): void {
				useWasCalled = true;
			}
		}

		const myPlugin = new MyPlugin();
		(raw['registerPlugin'] as (name: string, p: Plugin) => void)('myPlugin', myPlugin);
		(raw['usePlugin'] as (name: string) => void)('myPlugin');

		expect(capturedPlayer).toBe(player);
		expect(useWasCalled).toBe(true);
		player.dispose();
	});

	it('nmplayer auto-installs V1VideoCompatPlugin on setup()', async () => {
		const { V1VideoCompatPlugin } = await import('../plugins/v1-compat');
		const player = nmplayerV1('shim-video');
		player.setup({});
		await player.ready();

		expect(player.getPlugin(V1VideoCompatPlugin)).toBeDefined();
		player.dispose();
	});

	it('playlistComplete fires when ended fires on the last item', () => {
		const player = nmplayerV1('shim-video');
		player.setup({});

		const received: unknown[] = [];
		const raw = player as unknown as Record<string, unknown>;
		(raw['on'] as (ev: string, fn: () => void) => void)('playlistComplete', () => {
			received.push(true);
		});

		// Mock queue().length === 0 so we are on the last item.
		vi.spyOn(player, 'queue').mockReturnValue([] as never);
		vi.spyOn(player, 'index').mockReturnValue(0);

		player.emit('ended' as never, undefined as never);

		expect(received).toHaveLength(1);
		player.dispose();
	});
});
