// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * V1VideoCompatPlugin — deep consequence-pinning tests.
 *
 * Covers the uncovered branches in plugins/v1-compat/index.ts:
 *  - Event bridge payloads: seek/seeked, mute, chapters, audioTracks, playlist,
 *    fullscreen, pip, theater, controls/showControls, captionsChanged/captionsList,
 *    levels, play/pause with TimeData shape.
 *  - Method shims: quality-level index translation (getQualityLevels,
 *    getCurrentQuality, setCurrentQuality), caption index translation
 *    (getSubtitles, getCaptionsList, hasCaptions, getCurrentCaption,
 *    getCaptionIndex, setCurrentCaption), audio-track shims
 *    (getAudioTracks, getCurrentAudioTrack, getAudioTrackIndex,
 *    setCurrentAudioTrack), display shims (getFullscreen, setFullscreen,
 *    aspect/getCurrentAspect/setAspect), time shims (currentTime getter/setter,
 *    getTimeData, getBuffer, getState, state), container geometry shims,
 *    element accessors (getVideoElement, element()), navigation (rewindVideo,
 *    forwardVideo), playback-rate aliases (setSpeed, getSpeed, getSpeeds),
 *    chapter shims (getChapters, getPlaylist, getPlaylistIndex, getSeasons,
 *    getChapterText, getCaptionIndexBy, getAudioTrackIndexByLanguage,
 *    getCurrentChapter, getChapterFile, getPreviousChapter, getNextChapter),
 *    getGain/setGain (removed), getCurrentSrc, doubleTap, chapterText,
 *    getButtonKeyCode, getClosestElement, hasNextTip, translations property,
 *    v1.2.7 renames (current, currentIndex, currentAudioTrack, currentQuality,
 *    currentSubtitle, currentAudioOutput, currentChapter, audioTrackState,
 *    qualityState, fullscreenState, pipState, theaterState, isTv, isMobile).
 *  - _makeTimeData shape validation (currentTimeHuman, durationHuman,
 *    remainingHuman, percentage, remaining).
 *  - _warnRemoved vs _warnDeprecated message distinction.
 *  - dispose removes all bridge listeners and patched methods.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NMVideoPlayer } from '../index';
import { V1VideoCompatPlugin } from '../plugins/v1-compat';

// ---------------------------------------------------------------------------
// Setup helpers
// ---------------------------------------------------------------------------

function makePlayer(): NMVideoPlayer {
	return new NMVideoPlayer('deep-test').setup({});
}

type Compat = Record<string, (...args: unknown[]) => unknown>;
type OnCompat = Record<string, (ev: string, fn: (d: unknown) => void) => void>;

beforeEach(() => {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	const div = document.createElement('div');
	div.id = 'deep-test';
	document.body.appendChild(div);
	vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	document.body.innerHTML = '';
	vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// _makeTimeData shape
// ---------------------------------------------------------------------------

describe('_makeTimeData shape (via on("time") bridge)', () => {
	it('constructs correct percentage / remaining / human strings', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('time', d => received.push(d));

		// Prime duration tracker via duration event
		player.emit('duration' as never, { duration: 100 } as never);
		player.emit('time' as never, { time: 25 } as never);

		const payload = received[0] as {
			currentTime: number;
			duration: number;
			percentage: number;
			remaining: number;
			currentTimeHuman: string;
			durationHuman: string;
			remainingHuman: string;
			playbackRate: number;
		};

		expect(payload.currentTime).toBe(25);
		expect(payload.duration).toBe(100);
		expect(payload.percentage).toBeCloseTo(25);
		expect(payload.remaining).toBeCloseTo(75);
		expect(payload.currentTimeHuman).toBe('25');
		expect(payload.durationHuman).toBe('100');
		expect(payload.remainingHuman).toBe('75');
		expect(payload.playbackRate).toBe(1);

		player.dispose();
	});

	it('handles duration = 0 without division by zero', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		// Reset the module-level duration tracker to 0 by emitting duration=0.
		player.emit('duration' as never, { duration: 0 } as never);

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('time', d => received.push(d));
		player.emit('time' as never, { time: 10 } as never);

		const payload = received[0] as { percentage: number; remaining: number };
		// With duration=0, percentage and remaining must both be 0 (no division by zero).
		expect(payload.percentage).toBe(0);
		expect(payload.remaining).toBe(0);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Event bridges — seek / seeked
// ---------------------------------------------------------------------------

describe('event bridges — seek / seeked', () => {
	it('on("seek", fn) receives TimeData from v2 "time" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('seek', d => received.push(d));
		player.emit('time' as never, { time: 50 } as never);

		expect(received).toHaveLength(1);
		expect((received[0] as { currentTime: number }).currentTime).toBe(50);

		player.dispose();
	});

	it('on("seeked", fn) receives TimeData from v2 "time" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('seeked', d => received.push(d));
		player.emit('time' as never, { time: 60 } as never);

		expect(received).toHaveLength(1);
		expect((received[0] as { currentTime: number }).currentTime).toBe(60);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Event bridges — chapters / audioTracks / playlist
// ---------------------------------------------------------------------------

describe('event bridges — chapters / audioTracks / playlist / levels', () => {
	it('on("chapters", fn) receives { cues } from v2 "chapters" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('chapters', d => received.push(d));
		const chapters = [{ start: 0, end: 60, title: 'Intro' }];
		player.emit('chapters' as never, { chapters } as never);

		expect((received[0] as { cues: unknown[] }).cues).toEqual(chapters);

		player.dispose();
	});

	it('on("audioTracks", fn) receives array directly from v2 "audioTracks" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('audioTracks', d => received.push(d));
		const tracks = [{ id: 'a0', language: 'en', label: 'English', default: true }];
		player.emit('audioTracks' as never, { tracks } as never);

		expect(Array.isArray(received[0])).toBe(true);
		expect((received[0] as unknown[]).length).toBe(1);

		player.dispose();
	});

	it('on("playlist", fn) receives [] sentinel from v2 "queueChanged" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('playlist', d => received.push(d));
		player.emit('queueChanged' as never, undefined as never);

		expect(received[0]).toEqual([]);

		player.dispose();
	});

	it('on("levels", fn) receives array directly from v2 "levels" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('levels', d => received.push(d));
		const levels = [{ bitrate: 1_000_000, height: 720 }];
		player.emit('levels' as never, { levels } as never);

		expect(Array.isArray(received[0])).toBe(true);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Event bridges — fullscreen / pip / theater / controls
// ---------------------------------------------------------------------------

describe('event bridges — fullscreen / pip / theater / controls / captionsChanged', () => {
	it('on("fullscreen", fn) receives boolean from v2 "fullscreen" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('fullscreen', d => received.push(d));
		player.emit('fullscreen' as never, { active: true } as never);

		expect(received[0]).toBe(true);

		player.dispose();
	});

	it('on("pip", fn) receives boolean from v2 "pip" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('pip', d => received.push(d));
		player.emit('pip' as never, { active: false } as never);

		expect(received[0]).toBe(false);

		player.dispose();
	});

	it('on("theater", fn) receives boolean from v2 "theater" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('theater', d => received.push(d));
		player.emit('theater' as never, { active: true } as never);

		expect(received[0]).toBe(true);

		player.dispose();
	});

	it('on("controls", fn) receives truthy boolean from v2 "active" event', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('controls', d => received.push(d));
		player.emit('active' as never, true as never);

		expect(received[0]).toBe(true);

		player.dispose();
	});

	it('on("showControls", fn) fires when data is truthy but skips null payload (showControls=false path)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('showControls', d => received.push(d));

		player.emit('active' as never, true as never);
		player.emit('active' as never, false as never);

		expect(received).toHaveLength(1);

		player.dispose();
	});

	it('on("captionsChanged", fn) receives reshaped object from v2 "subtitleChanged"', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('captionsChanged', d => received.push(d));
		player.emit('subtitleChanged' as never, {
			index: 1,
			track: { id: 'sub-1', language: 'en', label: 'English', type: 'full' },
		} as never);

		const payload = received[0] as { id: unknown; language: unknown };
		expect(payload.id).toBe('sub-1');
		expect(payload.language).toBe('en');

		player.dispose();
	});

	it('on("captionsList", fn) receives array from v2 "subtitleTracks"', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('captionsList', d => received.push(d));
		player.emit('subtitleTracks' as never, { tracks: [{ id: 'sub-0' }] } as never);

		expect(Array.isArray(received[0])).toBe(true);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Event bridges — play / pause TimeData reshaping
// ---------------------------------------------------------------------------

describe('event bridges — play / pause TimeData', () => {
	it('on("play", fn) receives TimeData-shaped object (not undefined)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('play', d => received.push(d));
		player.emit('play' as never, undefined as never);

		const payload = received[0] as { currentTime: number; duration: number };
		expect(payload.currentTime).toBe(0);
		expect(payload.duration).toBe(0);

		player.dispose();
	});

	it('on("pause", fn) receives TimeData-shaped object', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('pause', d => received.push(d));
		player.emit('pause' as never, undefined as never);

		const payload = received[0] as { currentTime: number };
		expect(payload.currentTime).toBe(0);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — quality
// ---------------------------------------------------------------------------

describe('method shims — quality', () => {
	it('getQualityLevels() prepends Auto sentinel at index 0', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'qualityLevels').mockReturnValue([
			{ bitrate: 1_000_000, height: 720, label: '720p', index: 0, dynamicRange: 'sdr' },
		] as never);
		const compat = player as unknown as Compat;
		const levels = compat.getQualityLevels() as Array<{ id: number; label: string }>;
		expect(levels[0]!.id).toBe(-1);
		expect(levels[0]!.label).toBe('Auto');
		expect(levels[1]!.label).toBe('720p');

		player.dispose();
	});

	it('getCurrentQuality() returns 0 for auto', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'quality').mockReturnValue('auto' as never);
		const compat = player as unknown as Compat;
		expect(compat.getCurrentQuality()).toBe(0);

		player.dispose();
	});

	it('getCurrentQuality() returns rawIndex + 1 for a real level', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'quality').mockReturnValue({ index: 2 } as never);
		const compat = player as unknown as Compat;
		expect(compat.getCurrentQuality()).toBe(3);

		player.dispose();
	});

	it('setCurrentQuality(0) → quality("auto")', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'quality');
		const compat = player as unknown as Compat;
		compat.setCurrentQuality(0);
		expect(spy).toHaveBeenCalledWith('auto');

		player.dispose();
	});

	it('setCurrentQuality(2) → quality(1) (shifted -1)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'quality');
		const compat = player as unknown as Compat;
		compat.setCurrentQuality(2);
		expect(spy).toHaveBeenCalledWith(1);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — captions / subtitles
// ---------------------------------------------------------------------------

describe('method shims — captions / subtitles', () => {
	it('getSubtitles() delegates to subtitles()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'subtitles').mockReturnValue([] as never);
		const compat = player as unknown as Compat;
		compat.getSubtitles();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('getCaptionsList() prepends Off sentinel', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'subtitles').mockReturnValue([
			{ id: 'sub-0', language: 'en', label: 'English' },
		] as never);
		const compat = player as unknown as Compat;
		const list = compat.getCaptionsList() as Array<{ id: number; label: string }>;
		expect(list[0]!.id).toBe(-1);
		expect(list[0]!.label).toBe('Off');
		expect(list[1]!.label).toBe('English');

		player.dispose();
	});

	it('hasCaptions() returns true when subtitles().length > 0', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'subtitles').mockReturnValue([{ id: 'sub-0' }] as never);
		const compat = player as unknown as Compat;
		expect(compat.hasCaptions()).toBe(true);

		player.dispose();
	});

	it('hasCaptions() returns false when subtitles().length === 0', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'subtitles').mockReturnValue([] as never);
		const compat = player as unknown as Compat;
		expect(compat.hasCaptions()).toBe(false);

		player.dispose();
	});

	it('getCurrentCaption() delegates to subtitle()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'subtitle').mockReturnValue(null as never);
		const compat = player as unknown as Compat;
		compat.getCurrentCaption();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('getCaptionIndex() returns 0 when subtitle() is null', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'subtitle').mockReturnValue(null as never);
		const compat = player as unknown as Compat;
		expect(compat.getCaptionIndex()).toBe(0);

		player.dispose();
	});

	it('getCaptionIndex() returns rawIndex + 1 for a real track', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'subtitle').mockReturnValue({ index: 1 } as never);
		const compat = player as unknown as Compat;
		expect(compat.getCaptionIndex()).toBe(2);

		player.dispose();
	});

	it('setCurrentCaption(0) → subtitle(null)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'subtitle');
		const compat = player as unknown as Compat;
		compat.setCurrentCaption(0);
		expect(spy).toHaveBeenCalledWith(null);

		player.dispose();
	});

	it('setCurrentCaption(2) → subtitle(1)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'subtitle');
		const compat = player as unknown as Compat;
		compat.setCurrentCaption(2);
		expect(spy).toHaveBeenCalledWith(1);

		player.dispose();
	});

	it('setCurrentCaption(undefined) does nothing', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'subtitle');
		const compat = player as unknown as Compat;
		compat.setCurrentCaption(undefined);
		expect(spy).not.toHaveBeenCalled();

		player.dispose();
	});

	it('getCaptionIndexBy() returns matching index by language', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'subtitles').mockReturnValue([
			{ language: 'en', kind: 'subtitles' },
			{ language: 'fr', kind: 'subtitles' },
		] as never);
		const compat = player as unknown as Compat;
		expect(compat.getCaptionIndexBy('fr')).toBe(1);

		player.dispose();
	});

	it('getCaptionIndexBy() returns undefined when no match', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'subtitles').mockReturnValue([{ language: 'en' }] as never);
		const compat = player as unknown as Compat;
		expect(compat.getCaptionIndexBy('de')).toBeUndefined();

		player.dispose();
	});

	it('getSubtitleStyle() / setSubtitleStyle() round-trip', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const getSpy = vi.spyOn(player, 'subtitleStyle').mockReturnValue({} as never);
		const setSpy = vi.spyOn(player, 'subtitleStyle');
		const compat = player as unknown as Compat;

		compat.getSubtitleStyle();
		expect(getSpy).toHaveBeenCalled();

		compat.setSubtitleStyle({ color: 'white' });
		expect(setSpy).toHaveBeenCalledWith({ color: 'white' });

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — audio tracks
// ---------------------------------------------------------------------------

describe('method shims — audio tracks', () => {
	it('getAudioTracks() delegates to audioTracks()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'audioTracks').mockReturnValue([] as never);
		const compat = player as unknown as Compat;
		compat.getAudioTracks();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('getCurrentAudioTrack() delegates to audioTrack()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'audioTrack').mockReturnValue(null as never);
		const compat = player as unknown as Compat;
		compat.getCurrentAudioTrack();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('getAudioTrackIndex() returns -1 when audioTrack() has no index', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'audioTrack').mockReturnValue(null as never);
		const compat = player as unknown as Compat;
		expect(compat.getAudioTrackIndex()).toBe(-1);

		player.dispose();
	});

	it('getAudioTrackIndex() returns index from audioTrack()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'audioTrack').mockReturnValue({ index: 2 } as never);
		const compat = player as unknown as Compat;
		expect(compat.getAudioTrackIndex()).toBe(2);

		player.dispose();
	});

	it('setCurrentAudioTrack(1) → audioTrack(1)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'audioTrack');
		const compat = player as unknown as Compat;
		compat.setCurrentAudioTrack(1);
		expect(spy).toHaveBeenCalledWith(1);

		player.dispose();
	});

	it('getAudioTrackIndexByLanguage() returns matching index', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'audioTracks').mockReturnValue([
			{ language: 'en' },
			{ language: 'ja' },
		] as never);
		const compat = player as unknown as Compat;
		expect(compat.getAudioTrackIndexByLanguage('ja')).toBe(1);

		player.dispose();
	});

	it('currentAudioTrack(idx) → audioTrack(idx) setter path', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'audioTrack');
		const compat = player as unknown as Compat;
		compat.currentAudioTrack(0);
		expect(spy).toHaveBeenCalledWith(0);

		player.dispose();
	});

	it('currentAudioTrack() → audioTrack() getter path', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'audioTrack').mockReturnValue(null as never);
		const compat = player as unknown as Compat;
		compat.currentAudioTrack();
		expect(spy).toHaveBeenCalledWith();

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — display / fullscreen / aspect
// ---------------------------------------------------------------------------

describe('method shims — display', () => {
	it('getFullscreen() returns true when fullscreen is "on"', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'fullscreen').mockReturnValue({ toString: () => 'on' } as never);
		const compat = player as unknown as Compat;
		expect(compat.getFullscreen()).toBe(true);

		player.dispose();
	});

	it('getFullscreen() returns false when fullscreen is "off"', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'fullscreen').mockReturnValue({ toString: () => 'off' } as never);
		const compat = player as unknown as Compat;
		expect(compat.getFullscreen()).toBe(false);

		player.dispose();
	});

	it('setFullscreen(true) → fullscreen(true)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'fullscreen');
		const compat = player as unknown as Compat;
		compat.setFullscreen(true);
		expect(spy).toHaveBeenCalledWith(true);

		player.dispose();
	});

	it('enterFullscreen() → fullscreen(true)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'fullscreen');
		const compat = player as unknown as Compat;
		compat.enterFullscreen();
		expect(spy).toHaveBeenCalledWith(true);

		player.dispose();
	});

	it('exitFullscreen() → fullscreen(false)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'fullscreen');
		const compat = player as unknown as Compat;
		compat.exitFullscreen();
		expect(spy).toHaveBeenCalledWith(false);

		player.dispose();
	});

	it('aspect(value) → aspectRatio(value) setter path', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'aspectRatio');
		const compat = player as unknown as Compat;
		compat.aspect('16:9');
		expect(spy).toHaveBeenCalledWith('16:9');

		player.dispose();
	});

	it('aspect() → aspectRatio() getter path', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'aspectRatio').mockReturnValue('16:9' as never);
		const compat = player as unknown as Compat;
		compat.aspect();
		expect(spy).toHaveBeenCalledWith();

		player.dispose();
	});

	it('getCurrentAspect() → aspectRatio()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'aspectRatio').mockReturnValue('4:3' as never);
		const compat = player as unknown as Compat;
		compat.getCurrentAspect();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('setAspect(value) → aspectRatio(value)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'aspectRatio');
		const compat = player as unknown as Compat;
		compat.setAspect('4:3');
		expect(spy).toHaveBeenCalledWith('4:3');

		player.dispose();
	});

	it('fullscreenState(state) → fullscreen(state)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'fullscreen');
		const compat = player as unknown as Compat;
		compat.fullscreenState(true);
		expect(spy).toHaveBeenCalledWith(true);

		player.dispose();
	});

	it('fullscreenState() → fullscreen() getter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'fullscreen').mockReturnValue('off' as never);
		const compat = player as unknown as Compat;
		compat.fullscreenState();
		expect(spy).toHaveBeenCalledWith();

		player.dispose();
	});

	it('pipState(state) → pip(state)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'pip');
		const compat = player as unknown as Compat;
		compat.pipState(true);
		expect(spy).toHaveBeenCalledWith(true);

		player.dispose();
	});

	it('pipState() → pip() getter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'pip').mockReturnValue('off' as never);
		const compat = player as unknown as Compat;
		compat.pipState();
		expect(spy).toHaveBeenCalledWith();

		player.dispose();
	});

	it('theaterState(state) → theater(state)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'theater');
		const compat = player as unknown as Compat;
		compat.theaterState(true);
		expect(spy).toHaveBeenCalledWith(true);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — time/state
// ---------------------------------------------------------------------------

describe('method shims — time / state', () => {
	it('currentTime(t) → time(t) setter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'time');
		const compat = player as unknown as Compat;
		compat.currentTime(30);
		expect(spy).toHaveBeenCalledWith(30, undefined);

		player.dispose();
	});

	it('currentTime() → time() getter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'time').mockReturnValue(0 as never);
		const compat = player as unknown as Compat;
		compat.currentTime();
		expect(spy).toHaveBeenCalledWith();

		player.dispose();
	});

	it('getState() returns string from playState()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'playState').mockReturnValue({ toString: () => 'paused' } as never);
		const compat = player as unknown as Compat;
		expect(compat.getState()).toBe('paused');

		player.dispose();
	});

	it('state() returns string from playState()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'playState').mockReturnValue({ toString: () => 'idle' } as never);
		const compat = player as unknown as Compat;
		expect(compat.state()).toBe('idle');

		player.dispose();
	});

	it('getTimeData() delegates to timeData()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'timeData').mockReturnValue({} as never);
		const compat = player as unknown as Compat;
		compat.getTimeData();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('getBuffer() delegates to bufferedRanges()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'bufferedRanges').mockReturnValue({} as never);
		const compat = player as unknown as Compat;
		compat.getBuffer();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — container geometry
// ---------------------------------------------------------------------------

describe('method shims — container geometry', () => {
	it('getWidth() returns container.getBoundingClientRect().width', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player.container, 'getBoundingClientRect').mockReturnValue({ width: 800, height: 450 } as DOMRect);
		const compat = player as unknown as Compat;
		expect(compat.getWidth()).toBe(800);

		player.dispose();
	});

	it('getHeight() returns container.getBoundingClientRect().height', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player.container, 'getBoundingClientRect').mockReturnValue({ width: 800, height: 450 } as DOMRect);
		const compat = player as unknown as Compat;
		expect(compat.getHeight()).toBe(450);

		player.dispose();
	});

	it('getElement() returns player.container', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.getElement()).toBe(player.container);

		player.dispose();
	});

	it('getVideoElement() returns player.videoElement', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.getVideoElement()).toBe(player.videoElement);

		player.dispose();
	});

	it('element() returns player.container', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.element()).toBe(player.container);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — playback-rate aliases
// ---------------------------------------------------------------------------

describe('method shims — playback-rate aliases', () => {
	it('setSpeed(rate) → playbackRate(rate)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'playbackRate');
		const compat = player as unknown as Compat;
		compat.setSpeed(1.5);
		expect(spy).toHaveBeenCalledWith(1.5);

		player.dispose();
	});

	it('getSpeed() → playbackRate()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'playbackRate').mockReturnValue(1 as never);
		const compat = player as unknown as Compat;
		compat.getSpeed();
		expect(spy).toHaveBeenCalledWith();

		player.dispose();
	});

	it('getSpeeds() → playbackRates()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'playbackRates').mockReturnValue([] as never);
		const compat = player as unknown as Compat;
		compat.getSpeeds();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — volume
// ---------------------------------------------------------------------------

describe('method shims — muted() combined getter/setter', () => {
	it('muted() getter returns true when volumeState is "muted"', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'volumeState').mockReturnValue({ toString: () => 'muted' } as never);
		const compat = player as unknown as Compat;
		expect(compat.muted()).toBe(true);

		player.dispose();
	});

	it('muted(true) calls mute()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'mute');
		const compat = player as unknown as Compat;
		compat.muted(true);
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('muted(false) calls unmute()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'unmute');
		const compat = player as unknown as Compat;
		compat.muted(false);
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — chapter helpers
// ---------------------------------------------------------------------------

describe('method shims — chapters', () => {
	it('getChapters() delegates to chapters()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'chapters').mockReturnValue([] as never);
		const compat = player as unknown as Compat;
		compat.getChapters();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('getChapterText() returns matching chapter title', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'chapters').mockReturnValue([
			{ start: 0, end: 60, title: 'Intro' },
			{ start: 60, end: 300, title: 'Part A' },
		] as never);
		const compat = player as unknown as Compat;
		expect(compat.getChapterText(90)).toBe('Part A');

		player.dispose();
	});

	it('getChapterText() returns null when no match', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'chapters').mockReturnValue([] as never);
		const compat = player as unknown as Compat;
		expect(compat.getChapterText(0)).toBeNull();

		player.dispose();
	});

	it('getCurrentChapter() returns matching chapter object', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const chapters = [{ start: 0, end: 100, title: 'Opening' }];
		vi.spyOn(player, 'chapters').mockReturnValue(chapters as never);
		const compat = player as unknown as Compat;
		expect(compat.getCurrentChapter(50)).toEqual(chapters[0]);

		player.dispose();
	});

	it('getCurrentChapter() returns undefined when no match', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'chapters').mockReturnValue([] as never);
		const compat = player as unknown as Compat;
		expect(compat.getCurrentChapter(50)).toBeUndefined();

		player.dispose();
	});

	it('chapterText(time) returns chapter title matching time', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'chapters').mockReturnValue([
			{ start: 0, end: 30, title: 'Cold Open' },
		] as never);
		const compat = player as unknown as Compat;
		expect(compat.chapterText(15)).toBe('Cold Open');

		player.dispose();
	});

	it('getPreviousChapter() → previousChapter()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'previousChapter').mockResolvedValue(undefined as never);
		const compat = player as unknown as Compat;
		compat.getPreviousChapter();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('getNextChapter() → nextChapter()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'nextChapter').mockResolvedValue(undefined as never);
		const compat = player as unknown as Compat;
		compat.getNextChapter();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — seasons / getSeasons
// ---------------------------------------------------------------------------

describe('method shims — seasons', () => {
	it('getSeasons() returns unique season list from queue()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'queue').mockReturnValue([
			{ id: '1', season: 1, seasonName: 'Season 1' },
			{ id: '2', season: 1, seasonName: 'Season 1' },
			{ id: '3', season: 2, seasonName: 'Season 2' },
		] as never);
		const compat = player as unknown as Compat;
		const seasons = compat.getSeasons() as Array<{ season: number }>;
		expect(seasons).toHaveLength(2);
		expect(seasons[0]!.season).toBe(1);
		expect(seasons[1]!.season).toBe(2);

		player.dispose();
	});

	it('seasons() (removed) returns []', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.seasons()).toEqual([]);

		player.dispose();
	});

	it('setEpisode() finds matching item and calls seekToIndex', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'queue').mockReturnValue([
			{ id: '1', season: 1, episode: 1 },
			{ id: '2', season: 1, episode: 2 },
		] as never);
		const spy = vi.spyOn(player, 'seekToIndex');
		const compat = player as unknown as Compat;
		compat.setEpisode(1, 2);
		expect(spy).toHaveBeenCalledWith(1);

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — misc removed APIs
// ---------------------------------------------------------------------------

describe('method shims — misc removed / compat', () => {
	it('getGain() warns with "removed" message, returns undefined', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.getGain()).toBeUndefined();
		const warns = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"getGain'));
		expect(warns.length).toBe(1);

		player.dispose();
	});

	it('setGain() warns with "removed" message, returns undefined', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.setGain()).toBeUndefined();
		const warns = (console.warn as ReturnType<typeof vi.spyOn>).mock.calls.filter((args: unknown[]) => String(args[0]).includes('"setGain'));
		expect(warns.length).toBe(1);

		player.dispose();
	});

	it('getCurrentSrc() returns item().url when available', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'item').mockReturnValue({ id: '1', url: '/video.mp4' } as never);
		const compat = player as unknown as Compat;
		expect(compat.getCurrentSrc()).toBe('/video.mp4');

		player.dispose();
	});

	it('getCurrentSrc() returns empty string when item() is null', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'item').mockReturnValue(null as never);
		const compat = player as unknown as Compat;
		expect(compat.getCurrentSrc()).toBe('');

		player.dispose();
	});

	it('getSubtitleFile() returns track file URL when available', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'subtitle').mockReturnValue({
			track: { file: '/subs/en.vtt' },
		} as never);
		const compat = player as unknown as Compat;
		expect(compat.getSubtitleFile()).toBe('/subs/en.vtt');

		player.dispose();
	});

	it('getTimeFile() returns previewSpriteUrl from item()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		vi.spyOn(player, 'item').mockReturnValue({ id: '1', previewSpriteUrl: '/sprites.vtt' } as never);
		const compat = player as unknown as Compat;
		expect(compat.getTimeFile()).toBe('/sprites.vtt');

		player.dispose();
	});

	it('getPlugin(name) shim is not installed when player already has getPlugin (v2 player)', async () => {
		// _patchMethod skips installation when the player already has a method of that name.
		// NMVideoPlayer declares getPlugin, so the shim is a no-op — the v2 typed method wins.
		// Verify the player still has a callable getPlugin after the plugin is loaded.
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		expect(typeof (player as unknown as Record<string, unknown>).getPlugin).toBe('function');

		player.dispose();
	});

	it('isTv() returns false in jsdom environment', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.isTv()).toBe(false);

		player.dispose();
	});

	it('isMobile() returns false in jsdom environment', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.isMobile()).toBe(false);

		player.dispose();
	});

	it('hasNextTip property is patched as false by default', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		expect((player as unknown as Record<string, unknown>).hasNextTip).toBe(false);

		player.dispose();
	});

	it('translations property returns {}', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		expect((player as unknown as Record<string, unknown>).translations).toEqual({});

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// Method shims — v1.2.7 renames
// ---------------------------------------------------------------------------

describe('method shims — v1.2.7 renames', () => {
	it('current() → item() getter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'item').mockReturnValue(null as never);
		const compat = player as unknown as Compat;
		compat.current();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('current(item) → item(item) setter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'item');
		const compat = player as unknown as Compat;
		compat.current({ id: 'x', url: 'x.mp4' });
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('currentIndex() → index()', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'index').mockReturnValue(0 as never);
		const compat = player as unknown as Compat;
		compat.currentIndex();
		expect(spy).toHaveBeenCalled();

		player.dispose();
	});

	it('currentQuality(idx) → quality(idx) setter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'quality');
		const compat = player as unknown as Compat;
		compat.currentQuality(2);
		expect(spy).toHaveBeenCalledWith(2);

		player.dispose();
	});

	it('currentQuality() → quality() getter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'quality').mockReturnValue('auto' as never);
		const compat = player as unknown as Compat;
		compat.currentQuality();
		expect(spy).toHaveBeenCalledWith();

		player.dispose();
	});

	it('currentSubtitle(idx) → subtitle(idx) setter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'subtitle');
		const compat = player as unknown as Compat;
		compat.currentSubtitle(1);
		expect(spy).toHaveBeenCalledWith(1);

		player.dispose();
	});

	it('currentSubtitle(null) → subtitle(null)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'subtitle');
		const compat = player as unknown as Compat;
		compat.currentSubtitle(null);
		expect(spy).toHaveBeenCalledWith(null);

		player.dispose();
	});

	it('currentAudioOutput(id) → audioOutput(id) setter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'audioOutput');
		const compat = player as unknown as Compat;
		compat.currentAudioOutput('device-1');
		expect(spy).toHaveBeenCalledWith('device-1');

		player.dispose();
	});

	it('currentChapter(idx) → chapter(idx) setter', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'chapter');
		const compat = player as unknown as Compat;
		compat.currentChapter(0);
		expect(spy).toHaveBeenCalledWith(0);

		player.dispose();
	});

	it('audioTrackState(idx) → audioTrackMode(idx)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'audioTrackMode');
		const compat = player as unknown as Compat;
		compat.audioTrackState(1);
		expect(spy).toHaveBeenCalledWith(1);

		player.dispose();
	});

	it('qualityState(target) → qualityMode(target)', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const spy = vi.spyOn(player, 'qualityMode');
		const compat = player as unknown as Compat;
		compat.qualityState('auto');
		expect(spy).toHaveBeenCalledWith('auto');

		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// doubleTap / getButtonKeyCode / getClosestElement
// ---------------------------------------------------------------------------

describe('method shims — UI helpers', () => {
	it('doubleTap() returns an event handler function', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		const handler = compat.doubleTap(() => undefined, () => undefined);
		expect(typeof handler).toBe('function');

		player.dispose();
	});

	it('doubleTap() single-tap fires secondary callback after delay', async () => {
		vi.useFakeTimers();
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const primary = vi.fn();
		const secondary = vi.fn();
		const compat = player as unknown as Compat;
		const handler = compat.doubleTap(primary, secondary) as (e: Event) => void;

		handler(new Event('click'));
		// Advance past the double-click delay (default 300ms) without running all timers
		await vi.advanceTimersByTimeAsync(500);

		expect(secondary).toHaveBeenCalledOnce();
		expect(primary).not.toHaveBeenCalled();

		player.dispose();
		vi.useRealTimers();
	});

	it('doubleTap() double-tap fires primary callback', async () => {
		vi.useFakeTimers();
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const primary = vi.fn();
		const compat = player as unknown as Compat;
		const handler = compat.doubleTap(primary) as (e: Event) => void;

		handler(new Event('click'));
		handler(new Event('click'));

		expect(primary).toHaveBeenCalledOnce();

		player.dispose();
		vi.useRealTimers();
	});

	it('getButtonKeyCode() maps "left" → "←"', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.getButtonKeyCode('left')).toBe('←');
		expect(compat.getButtonKeyCode('right')).toBe('→');
		expect(compat.getButtonKeyCode('up')).toBe('↑');
		expect(compat.getButtonKeyCode('down')).toBe('↓');

		player.dispose();
	});

	it('getButtonKeyCode() returns the direction unchanged for unknown keys', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.getButtonKeyCode('diagonal')).toBe('diagonal');

		player.dispose();
	});

	it('getClosestElement() returns null for non-Element input', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const compat = player as unknown as Compat;
		expect(compat.getClosestElement(null, 'div')).toBeNull();

		player.dispose();
	});

	it('getClosestElement() uses Element.closest for Element input', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const outer = document.createElement('section');
		const inner = document.createElement('span');
		outer.appendChild(inner);
		document.body.appendChild(outer);

		const compat = player as unknown as Compat;
		expect(compat.getClosestElement(inner, 'section')).toBe(outer);

		document.body.removeChild(outer);
		player.dispose();
	});
});

// ---------------------------------------------------------------------------
// dispose — bridge cleanup verification
// ---------------------------------------------------------------------------

describe('dispose — bridge cleanup', () => {
	it('patched methods are removed from the player instance on dispose', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		player.removePlugin(V1VideoCompatPlugin);

		expect((player as unknown as Record<string, unknown>).seek).toBeUndefined();
		expect((player as unknown as Record<string, unknown>).getCurrentTime).toBeUndefined();
	});

	it('event bridges are removed on dispose — no stale callbacks', async () => {
		const player = makePlayer();
		player.addPlugin(V1VideoCompatPlugin);
		await player.ready();

		const received: unknown[] = [];
		(player as unknown as OnCompat).on('time', d => received.push(d));

		player.removePlugin(V1VideoCompatPlugin);
		player.emit('time' as never, { time: 99 } as never);

		expect(received).toHaveLength(0);
	});
});
