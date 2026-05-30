import { describe, expect, it } from 'vitest';

import { applyVideoV1Compat, nmplayer, nmVideoPlayer, normalizeVideoItem } from '../compat';
import { nmVideoPlayer as canonicalNmVideoPlayer, NMVideoPlayer } from '../index';

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
			subtitles: [{ file: 'winner.vtt', label: 'Winner' }],
			tracks: [{ kind: 'subtitles', file: 'loser.vtt', label: 'Loser' }],
		});
		expect(result.subtitles).toHaveLength(1);
		expect(result.subtitles?.[0]?.label).toBe('Winner');
	});

	it('strips tracks field from output', () => {
		const result = normalizeVideoItem({ id: '1', tracks: [] }) as Record<string, unknown>;
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
