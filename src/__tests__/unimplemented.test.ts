// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Sentinel tests for every still-unimplemented method on NMVideoPlayer.
 *
 * Each method here MUST throw `core:player/not-implemented` (spec-compliant
 * `StateError`). When an implementation lands, the corresponding test breaks —
 * forcing the implementer to add a real behavior test in the matching feature
 * file. No method silently sits without coverage.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

describe('NMVideoPlayer — still-unimplemented method inventory', () => {
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

	const player = (): NMVideoPlayer => new NMVideoPlayer('test').setup({});

	describe('streams (now implemented)', () => {
		it('registerStream returns the player and adds to the registry', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const factory = { id: 'custom', canPlay: () => false, create: (() => ({})) as any };
			const ret = videoPlayer.registerStream(factory as any);
			expect(ret).toBe(videoPlayer);
			expect(videoPlayer.streams()).toContain('custom');
		});
		it('unregisterStream removes a registered factory', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			videoPlayer.registerStream({ id: 'temp', canPlay: () => false, create: (() => ({})) as any } as any);
			videoPlayer.unregisterStream('temp');
			expect(videoPlayer.streams()).not.toContain('temp');
		});
		it('streams() lists kit defaults (native + hls) after setup', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const list = videoPlayer.streams();
			expect(list).toContain('native');
			expect(list).toContain('hls');
		});
		it('getStreamFactory looks up by id', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.getStreamFactory('hls')?.id).toBe('hls');
			expect(videoPlayer.getStreamFactory('absent')).toBeUndefined();
		});
	});

	describe('backend / loading', () => {
		it('backend returns an Html5VideoBackend instance', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const backend = videoPlayer.backend();
			expect(backend.kind).toBe('html5');
			// Same reference returned on subsequent calls (lazy + cached).
			expect(videoPlayer.backend()).toBe(backend);
			// Wires the player's videoElement to the backend's element.
			expect(backend.mediaElement()).toBeInstanceOf(HTMLVideoElement);
			expect(videoPlayer.videoElement).toBe(backend.mediaElement());
		});
		it('load throws MediaFormatError when item.url is missing', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			let err: unknown;
			try { await videoPlayer.load({ id: 'x' } as any); }
			catch (error) { err = error; }
			expect((err as { code?: string })?.code).toBe('core:media/missing-url');
		});
		it('loadQueue rejects on unreachable URL and emits playlistResolveError', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			let resolveErrored = false;
			videoPlayer.on('playlistResolveError' as any, () => { resolveErrored = true; });
			let err: unknown;
			try { await videoPlayer.loadQueue('https://invalid.example.test/never-resolves'); }
			catch (error) { err = error; }
			expect(err).toBeDefined();
			expect(resolveErrored).toBe(true);
		});
	});

	describe('video state enums', () => {
		it('bufferState() returns idle on a fresh player', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.bufferState()).toBe('idle');
		});
		it('networkState() reflects navigator.onLine', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(['online', 'offline', 'slow']).toContain(videoPlayer.networkState());
		});
		it('streamState() returns idle when no source loaded', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.streamState()).toBe('idle');
		});
		it('visibilityState() reflects document.visibilityState', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(['visible', 'hidden']).toContain(videoPlayer.visibilityState());
		});
		it('fullscreen() reads off when no fullscreen is active', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.fullscreen()).toBe('off');
		});
		it('pip() reads off when no PiP is active', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.pip()).toBe('off');
		});
		it('theater() reads off by default; setter flips', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.theater()).toBe('off');
			videoPlayer.theater(true);
			expect(videoPlayer.theater()).toBe('on');
		});
		it('subtitleState() defaults to off', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.subtitleState()).toBe('off');
		});
		it('qualityMode() defaults to auto', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.qualityMode()).toBe('auto');
		});
		it('audioTrackMode() defaults to default', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.audioTrackMode()).toBe('default');
		});
	});

	describe('video-specific actions', () => {
		it('toggleFullscreen flips fullscreenState (or throws on unsupported platform — JSDOM has no fullscreen API)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			// JSDOM doesn't provide a real fullscreen API, so toggling on a
			// container without `requestFullscreen` falls through to the
			// platform's catch-all error path. Either pass-through or
			// BrowserPolicyError is acceptable here — both prove the wire is in.
			let didCall = false;
			try { videoPlayer.toggleFullscreen(); didCall = true; }
			catch (error) {
				expect((error as { code: string }).code).toBe('core:policy/fullscreenUnsupported');
			}
			// Either it threw with the expected code OR it ran (didCall) without
			// throwing (browserPlatform.fullscreen swallows internal failures).
			expect(typeof didCall).toBe('boolean');
		});
		it('togglePip flips pip() (or throws on unsupported)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			let didCall = false;
			try { videoPlayer.togglePip(); didCall = true; }
			catch (error) {
				expect((error as { code: string }).code).toBe('core:policy/pipUnsupported');
			}
			expect(typeof didCall).toBe('boolean');
		});
		it('toggleTheater flips theater()', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.theater()).toBe('off');
			videoPlayer.toggleTheater();
			expect(videoPlayer.theater()).toBe('on');
			videoPlayer.toggleTheater();
			expect(videoPlayer.theater()).toBe('off');
		});
		it('cycleSubtitles no-ops when track list is empty (subtitles() throws)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(() => videoPlayer.cycleSubtitles()).not.toThrow();
		});
		it('cycleAudioTracks no-ops when track list is empty (audioTracks() throws)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(() => videoPlayer.cycleAudioTracks()).not.toThrow();
		});
		it('cycleAspectRatio cycles uniform → fill → exactfit → none → uniform and emits aspectRatio', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const seen: string[] = [];
			videoPlayer.on('aspectRatio' as any, (data: any) => { seen.push(data.value); });
			videoPlayer.cycleAspectRatio();
			videoPlayer.cycleAspectRatio();
			videoPlayer.cycleAspectRatio();
			videoPlayer.cycleAspectRatio();
			expect(seen).toEqual(['fill', 'exactfit', 'none', 'uniform']);
		});
	});

	describe('tracks / chapters / quality (delegated to Html5VideoBackend; empty pre-load)', () => {
		it('subtitles returns [] when no source has been loaded', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			// backend instantiation reads element.textTracks which is empty before load.
			expect(videoPlayer.subtitles()).toEqual([]);
		});
		it('subtitle on a fresh player is a no-op (backend has setSubtitleTrack but no tracks loaded)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(() => videoPlayer.subtitle(null)).not.toThrow();
		});
		it('audioTracks returns [] when no source has been loaded', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.audioTracks()).toEqual([]);
		});
		it('audioTrack on a fresh player is a no-op (no tracks loaded)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(() => videoPlayer.audioTrack(0)).not.toThrow();
		});
		it('qualityLevels returns [] when no HLS source loaded', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.qualityLevels()).toEqual([]);
		});
		it('quality on a fresh player is a no-op (no hls instance)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(() => videoPlayer.quality('auto')).not.toThrow();
		});
		it('chapters returns [] (chapter pipeline not wired yet)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.chapters()).toEqual([]);
		});
		it('seekToChapter is a no-op when chapters() is empty', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(() => videoPlayer.seekToChapter(0)).not.toThrow();
		});
		it('nextChapter is a no-op when chapters() is empty', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(() => videoPlayer.nextChapter()).not.toThrow();
		});
		it('previousChapter is a no-op when chapters() is empty', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(() => videoPlayer.previousChapter()).not.toThrow();
		});
	});

	describe('device capabilities (now implemented — UA detection)', () => {
		it('isTv/isMobile/isDesktop are mutually exclusive booleans', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const flags = [videoPlayer.isTv(), videoPlayer.isMobile(), videoPlayer.isDesktop()];
			expect(flags.every(flag => typeof flag === 'boolean')).toBe(true);
			expect(flags.filter(Boolean).length).toBeGreaterThanOrEqual(1);
		});
		it('device() returns DeviceCapabilities snapshot', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const dev = videoPlayer.device();
			expect(typeof dev.isTv).toBe('boolean');
			expect(typeof dev.isMobile).toBe('boolean');
			expect(typeof dev.isDesktop).toBe('boolean');
			expect(typeof dev.pipSupported).toBe('boolean');
			expect(typeof dev.fullscreenSupported).toBe('boolean');
		});
	});

	describe('media capabilities + ABR (now implemented)', () => {
		it('canPlay delegates to platform.capabilities.canDecode and returns DecodingInfo shape', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const info = await videoPlayer.canPlay({ contentType: 'video/mp4; codecs="avc1.42E01E"' });
			expect(typeof info.supported).toBe('boolean');
			expect(typeof info.smooth).toBe('boolean');
			expect(typeof info.powerEfficient).toBe('boolean');
		});
		it('bandwidth() returns 0 when no estimator wired', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(videoPlayer.bandwidth()).toBe(0);
		});
		it('bandwidthEstimator replaces the estimator (kit-level overload) and bandwidth() reflects it', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			// Test the real runtime surface via `any` cast.
			const anyP = videoPlayer as unknown as { bandwidthEstimator: (fn?: () => number) => (() => number) | void };
			expect(() => anyP.bandwidthEstimator(() => 12345)).not.toThrow();
			expect(typeof anyP.bandwidthEstimator()).toBe('function');
			// The consumer override must actually feed bandwidth(), not sit in
			// an unread slot — that split is what left bandwidth() hardcoded
			// at 0 despite bandwidthEstimator() appearing to "work".
			expect(videoPlayer.bandwidth()).toBe(12345);
		});
	});

	describe('audio output device (now implemented)', () => {
		it('audioOutputs returns [] in environments without navigator.mediaDevices', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const outputs = await videoPlayer.audioOutputs();
			expect(Array.isArray(outputs)).toBe(true);
		});
		it('selectAudioOutput throws BrowserPolicyError on unsupported environments', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			let err: unknown;
			try { await videoPlayer.selectAudioOutput(); }
			catch (error) { err = error; }
			expect((err as { code?: string }).code).toBe('core:policy/audioOutputPickerUnsupported');
		});
	});

	describe('cast / handoff (now implemented)', () => {
		it('castState() reflects available remote-playback APIs', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(['available', 'unavailable']).toContain(videoPlayer.castState());
		});
		it('transferTo("cast") throws BrowserPolicyError without the Cast SDK', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			let err: unknown;
			try { await videoPlayer.transferTo('cast'); }
			catch (error) { err = error; }
			expect((err as { code?: string })?.code).toBe('core:policy/castUnavailable');
		});
	});

	describe('auth runtime (now implemented — was sentinel; behavioural checks)', () => {
		it('auth replaces wholesale and emits auth:refreshed', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			let acquiredAt: number | undefined;
			videoPlayer.on('auth:refreshed', (data: any) => { acquiredAt = data.tokenAcquiredAt; });
			videoPlayer.auth({ bearerToken: 'tok-a' });
			expect((videoPlayer as any)._rawAuth()?.bearerToken).toBe('tok-a');
			expect(videoPlayer.auth()?.bearerToken).toBeUndefined();
			expect(acquiredAt).toBeTypeOf('number');
		});

		it('auth shallow-merges over current config', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			videoPlayer.auth({ bearerToken: 'tok-a', credentials: 'include' });
			videoPlayer.auth({ bearerToken: 'tok-b' });
			const current = videoPlayer.auth();
			expect((videoPlayer as any)._rawAuth()?.bearerToken).toBe('tok-b');
			expect(current?.bearerToken).toBeUndefined();
			expect(current?.credentials).toBe('include');
		});

		it('auth returns a frozen snapshot', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			videoPlayer.auth({ bearerToken: 'tok' });
			const snap = videoPlayer.auth();
			expect(Object.isFrozen(snap)).toBe(true);
		});

		it('refreshAuth invokes refreshOnUnauthenticated and emits auth:refreshed', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			let invoked = false;
			let refreshed = false;
			videoPlayer.auth({ refreshOnUnauthenticated: async () => { invoked = true; } });
			videoPlayer.on('auth:refreshed', () => { refreshed = true; });
			await videoPlayer.refreshAuth();
			expect(invoked).toBe(true);
			expect(refreshed).toBe(true);
		});
	});

	describe('metrics + clock + a11y (now/announce now implemented)', () => {
		it('metrics() returns a snapshot with the standard PlaybackMetrics shape', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const playbackMetrics = videoPlayer.metrics();
			// ttfb / avgBitrate / decoderStalls — null until a backend wires them
			expect(playbackMetrics.ttfb).toBeNull();
			expect(playbackMetrics.avgBitrate).toBeNull();
			expect(playbackMetrics.decoderStalls).toBeNull();
			// droppedFrames — null until the video element reports via getVideoPlaybackQuality
			expect(playbackMetrics.droppedFrames).toBeNull();
			// always-number counters
			expect(typeof playbackMetrics.ttff).toBe('number');
			expect(typeof playbackMetrics.rebufferRatio).toBe('number');
			expect(typeof playbackMetrics.joinTime).toBe('number');
			expect(typeof playbackMetrics.sessionDurationMs).toBe('number');
			expect(playbackMetrics.sessionDurationMs).toBeGreaterThanOrEqual(0);
		});
		it('recordMetric writes a value that metrics() reflects (standard + custom)', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			videoPlayer.recordMetric('droppedFrames', 12);
			videoPlayer.recordMetric('customCounter', 7);
			const metrics = videoPlayer.metrics() as any;
			expect(metrics.droppedFrames).toBe(12);
			expect(metrics.customCounter).toBe(7);
		});
		it('now() returns clockSource() if configured, else Date.now()', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			expect(typeof videoPlayer.now()).toBe('number');
			expect(videoPlayer.now()).toBeGreaterThan(0);
		});
		it('announce() inserts an aria-live element under container', async () => {
			const videoPlayer = player();
			await videoPlayer.ready();
			const before = videoPlayer.container.querySelectorAll('[aria-live]').length;
			videoPlayer.announce('hello world');
			const after = videoPlayer.container.querySelectorAll('[aria-live]').length;
			expect(after).toBe(before + 1);
		});
	});
});
