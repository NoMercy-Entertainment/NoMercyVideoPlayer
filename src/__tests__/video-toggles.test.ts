/**
 * Locks the video-only toggle methods: theater / fullscreen / pip /
 * cycleSubtitles / cycleAudioTracks.
 * Mirrors `transport.test.ts` setup conventions.
 */

import type { AudioTrack, IPlatform, SubtitleTrack } from '@nomercy-entertainment/nomercy-player-core';
import { BrowserPolicyError } from '@nomercy-entertainment/nomercy-player-core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FullscreenState, NMVideoPlayer, PipState, TheaterState } from '../index';

interface FakeFsHandles {
	enter: ReturnType<typeof vi.fn>;
	exit: ReturnType<typeof vi.fn>;
	setActive: (a: boolean) => void;
}
interface FakePipHandles extends FakeFsHandles {}

function buildFakePlatform(opts: { fullscreen?: boolean; pip?: boolean } = { fullscreen: true, pip: true }): { platform: IPlatform; fs: FakeFsHandles; pip: FakePipHandles } {
	let fsActive = false;
	let pipActive = false;

	const fsEnter = vi.fn(async (_target: HTMLElement) => { fsActive = true; });
	const fsExit = vi.fn(async () => { fsActive = false; });
	const pipEnter = vi.fn(async (_v: HTMLVideoElement) => { pipActive = true; });
	const pipExit = vi.fn(async () => { pipActive = false; });

	const platform: IPlatform = {
		wakeLock: {
			acquire: async () => {},
			release: async () => {},
			isHeld: () => false,
		},
		network: {
			isOnline: () => true,
			type: () => 'wifi',
			downlinkMbps: () => undefined,
			rttMs: () => undefined,
			subscribe: () => () => {},
		},
		visibility: {
			isVisible: () => true,
			subscribe: () => () => {},
		},
		capabilities: {
			canDecode: async () => ({ supported: true, smooth: true, powerEfficient: true }),
		},
		fullscreen: opts.fullscreen
			? {
					enter: fsEnter,
					exit: fsExit,
					isActive: () => fsActive,
					isSupported: () => true,
					subscribe: () => () => {},
				}
			: undefined,
		pip: opts.pip
			? {
					enter: pipEnter,
					exit: pipExit,
					isActive: () => pipActive,
					isSupported: () => true,
					subscribe: () => () => {},
				}
			: undefined,
	};

	return {
		platform,
		fs: {
			enter: fsEnter,
			exit: fsExit,
			setActive: (a) => { fsActive = a; },
		},
		pip: {
			enter: pipEnter,
			exit: pipExit,
			setActive: (a) => { pipActive = a; },
		},
	};
}

describe('NMVideoPlayer — video toggles (theater / fullscreen / pip)', () => {
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

	// ── theater ──

	describe('theater', () => {
		it('theater() reads OFF by default', async () => {
			const p = new NMVideoPlayer('test').setup({});
			await p.ready();
			expect(p.theater()).toBe(TheaterState.OFF);
		});

		it('theater(true) flips on and emits theater { active }', async () => {
			const p = new NMVideoPlayer('test').setup({});
			await p.ready();
			let payload: { active: boolean } | undefined;
			p.on('theater' as any, (data: any) => { payload = data; });

			p.theater(true);

			expect(p.theater()).toBe(TheaterState.ON);
			expect(payload).toEqual({ active: true });
		});

		it('theater(TheaterState.ON) accepts the enum form', async () => {
			const p = new NMVideoPlayer('test').setup({});
			await p.ready();
			p.theater(TheaterState.ON);
			expect(p.theater()).toBe(TheaterState.ON);
		});

		it('toggleTheater() flips off → on → off and emits theater per call', async () => {
			const p = new NMVideoPlayer('test').setup({});
			await p.ready();
			const events: boolean[] = [];
			p.on('theater' as any, (data: any) => { events.push(data.active); });

			p.toggleTheater();
			expect(p.theater()).toBe(TheaterState.ON);
			p.toggleTheater();
			expect(p.theater()).toBe(TheaterState.OFF);

			expect(events).toEqual([true, false]);
		});
	});

	// ── fullscreen ──

	describe('fullscreen', () => {
		it('fullscreen() reads via platform.fullscreen.isActive', async () => {
			const fake = buildFakePlatform();
			const p = new NMVideoPlayer('test').setup({ platform: fake.platform });
			await p.ready();
			expect(p.fullscreen()).toBe(FullscreenState.OFF);
			fake.fs.setActive(true);
			expect(p.fullscreen()).toBe(FullscreenState.ON);
		});

		it('without platform.fullscreen → throws BrowserPolicyError when toggled', async () => {
			const fake = buildFakePlatform({ fullscreen: false, pip: true });
			const p = new NMVideoPlayer('test').setup({ platform: fake.platform });
			await p.ready();
			let err: unknown;
			try { p.fullscreen(true); }
			catch (e) { err = e; }
			expect(err).toBeInstanceOf(BrowserPolicyError);
			expect((err as BrowserPolicyError).code).toBe('core:policy/fullscreenUnsupported');
		});

		it('toggleFullscreen() calls platform.fullscreen.enter / exit and emits fullscreen', async () => {
			const fake = buildFakePlatform();
			const p = new NMVideoPlayer('test').setup({ platform: fake.platform });
			await p.ready();

			const events: boolean[] = [];
			p.on('fullscreen' as any, (data: any) => { events.push(data.active); });

			p.toggleFullscreen(); // OFF → ON
			expect(fake.fs.enter).toHaveBeenCalledTimes(1);
			fake.fs.setActive(true);

			p.toggleFullscreen(); // ON → OFF
			expect(fake.fs.exit).toHaveBeenCalledTimes(1);

			expect(events).toEqual([true, false]);
		});
	});

	// ── pip ──

	describe('pip', () => {
		it('pip() reads via platform.pip.isActive', async () => {
			const fake = buildFakePlatform();
			const p = new NMVideoPlayer('test').setup({ platform: fake.platform });
			await p.ready();
			expect(p.pip()).toBe(PipState.OFF);
			fake.pip.setActive(true);
			expect(p.pip()).toBe(PipState.ON);
		});

		it('without platform.pip → throws when toggled', async () => {
			const fake = buildFakePlatform({ fullscreen: true, pip: false });
			const p = new NMVideoPlayer('test').setup({ platform: fake.platform });
			await p.ready();
			let err: unknown;
			try { p.pip(true); }
			catch (e) { err = e; }
			expect(err).toBeInstanceOf(BrowserPolicyError);
			expect((err as BrowserPolicyError).code).toBe('core:policy/pipUnsupported');
		});

		it('togglePip() calls platform.pip.enter / exit and emits pip', async () => {
			const fake = buildFakePlatform();
			const p = new NMVideoPlayer('test').setup({ platform: fake.platform });
			await p.ready();

			const events: boolean[] = [];
			p.on('pip' as any, (data: any) => { events.push(data.active); });

			p.togglePip(); // OFF → ON
			expect(fake.pip.enter).toHaveBeenCalledTimes(1);
			fake.pip.setActive(true);

			p.togglePip(); // ON → OFF
			expect(fake.pip.exit).toHaveBeenCalledTimes(1);

			expect(events).toEqual([true, false]);
		});
	});

	// ── aspectRatio ──

	describe('aspectRatio', () => {
		it('reads uniform by default', async () => {
			const p = new NMVideoPlayer('test').setup({});
			await p.ready();
			expect(p.aspectRatio()).toBe('uniform');
		});

		it('setter updates _aspectRatio and emits aspectRatio event', async () => {
			const p = new NMVideoPlayer('test').setup({});
			await p.ready();

			const events: string[] = [];
			p.on('aspectRatio' as any, (data: any) => { events.push(data.value); });

			p.aspectRatio('fill');
			p.aspectRatio('exactfit');
			p.aspectRatio('none');
			p.aspectRatio('uniform');

			expect(p.aspectRatio()).toBe('uniform');
			expect(events).toEqual(['fill', 'exactfit', 'none', 'uniform']);
		});

		it('applies object-fit to the video element when backend exists', async () => {
			const p = new NMVideoPlayer('test').setup({});
			await p.ready();

			p.backend();
			const videoEl = document.querySelector<HTMLVideoElement>('#test video');
			expect(videoEl).not.toBeNull();

			p.aspectRatio('fill');
			expect(videoEl!.style.objectFit).toBe('fill');

			p.aspectRatio('exactfit');
			expect(videoEl!.style.objectFit).toBe('cover');

			p.aspectRatio('none');
			expect(videoEl!.style.objectFit).toBe('none');

			p.aspectRatio('uniform');
			expect(videoEl!.style.objectFit).toBe('contain');
		});

		it('survives aspectRatio() call before backend exists, then applies on backend init', async () => {
			const p = new NMVideoPlayer('test').setup({});
			await p.ready();

			// No backend yet — videoElement is undefined. Call must not throw.
			p.aspectRatio('exactfit');
			expect(p.aspectRatio()).toBe('exactfit');

			// Allocating the backend now must pick up the pre-set value.
			p.backend();
			const videoEl = document.querySelector<HTMLVideoElement>('#test video');
			expect(videoEl).not.toBeNull();
			expect(videoEl!.style.objectFit).toBe('cover');
		});

		it('options.stretching seeds the initial value when no user call preceded backend init', async () => {
			(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
			document.body.innerHTML = '<div id="test2"></div>';
			const p = new NMVideoPlayer('test2').setup({ stretching: 'none' } as any);
			await p.ready();

			p.backend();
			const videoEl = document.querySelector<HTMLVideoElement>('#test2 video');
			expect(videoEl).not.toBeNull();
			expect(videoEl!.style.objectFit).toBe('none');
		});

		it('user aspectRatio() call beats options.stretching when set before backend init', async () => {
			(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
			document.body.innerHTML = '<div id="test3"></div>';
			const p = new NMVideoPlayer('test3').setup({ stretching: 'none' } as any);
			await p.ready();

			p.aspectRatio('fill');

			p.backend();
			const videoEl = document.querySelector<HTMLVideoElement>('#test3 video');
			expect(videoEl).not.toBeNull();
			// User's choice must win over options.stretching.
			expect(videoEl!.style.objectFit).toBe('fill');
		});
	});
});


// ── Regression: cycleSubtitles / cycleAudioTracks selection-object bug ────────
//
// Before fix: both cycle methods tested `typeof this.subtitle() === 'number'`
// (or audioTrack). Those getters return CurrentSubtitleSelection|null and
// CurrentAudioTrackSelection|null — objects, never numbers. The check was always
// false, current stayed -1, and every call selected the first track indefinitely.

const SUBTITLE_TRACKS: SubtitleTrack[] = [
	{ id: 'en', language: 'en', label: 'English', kind: 'subtitles', url: 'en.vtt', default: false },
	{ id: 'nl', language: 'nl', label: 'Dutch', kind: 'subtitles', url: 'nl.vtt', default: false },
	{ id: 'de', language: 'de', label: 'German', kind: 'subtitles', url: 'de.vtt', default: false },
];

const AUDIO_TRACKS: AudioTrack[] = [
	{ id: 'en', language: 'en', label: 'English', default: true },
	{ id: 'nl', language: 'nl', label: 'Dutch', default: false },
	{ id: 'de', language: 'de', label: 'German', default: false },
];

describe('NMVideoPlayer — cycleSubtitles / cycleAudioTracks advance through list', () => {
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

	// ── cycleSubtitles ──────────────────────────────────────────────────────────

	it('cycleSubtitles advances: off → 0 → 1 → 2 → off → 0', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		let currentSub: { index: number; track: SubtitleTrack } | null = null;
		const subtitleCalls: Array<number | null> = [];

		Object.assign(player, {
			subtitles: () => SUBTITLE_TRACKS,
			subtitle: (idx?: number | null) => {
				if (idx === undefined) {
					return currentSub;
				}
				currentSub = idx === null ? null : { index: idx, track: SUBTITLE_TRACKS[idx]! };
				subtitleCalls.push(idx ?? null);
			},
		});

		// Start: off (currentSub = null) → should select 0
		player.cycleSubtitles();
		expect(subtitleCalls).toEqual([0]);

		// Now at 0 → should select 1
		player.cycleSubtitles();
		expect(subtitleCalls).toEqual([0, 1]);

		// Now at 1 → should select 2
		player.cycleSubtitles();
		expect(subtitleCalls).toEqual([0, 1, 2]);

		// Now at 2 (= list.length - 1) → should go off (null)
		player.cycleSubtitles();
		expect(subtitleCalls).toEqual([0, 1, 2, null]);

		// Now off again → back to 0
		player.cycleSubtitles();
		expect(subtitleCalls).toEqual([0, 1, 2, null, 0]);
	});

	it('cycleSubtitles does nothing when the tracks list is empty', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const subtitleCalls: Array<number | null> = [];
		Object.assign(player, {
			subtitles: () => [],
			subtitle: (idx?: number | null) => {
				if (idx !== undefined) subtitleCalls.push(idx ?? null);
				return null;
			},
		});

		player.cycleSubtitles();
		expect(subtitleCalls).toHaveLength(0);
	});

	// ── cycleAudioTracks ────────────────────────────────────────────────────────

	it('cycleAudioTracks advances: 0 → 1 → 2 → 0 (wraps, no off state)', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		let currentAudio: { index: number; track: AudioTrack } | null = { index: 0, track: AUDIO_TRACKS[0]! };
		const audioCalls: number[] = [];

		Object.assign(player, {
			audioTracks: () => AUDIO_TRACKS,
			audioTrack: (idx?: number) => {
				if (idx === undefined) {
					return currentAudio;
				}
				currentAudio = { index: idx, track: AUDIO_TRACKS[idx]! };
				audioCalls.push(idx);
			},
		});

		// Start at 0 → should select 1
		player.cycleAudioTracks();
		expect(audioCalls).toEqual([1]);

		// Now at 1 → should select 2
		player.cycleAudioTracks();
		expect(audioCalls).toEqual([1, 2]);

		// Now at 2 (= list.length - 1) → should wrap to 0
		player.cycleAudioTracks();
		expect(audioCalls).toEqual([1, 2, 0]);

		// Confirm wrap was to 0, not stuck at 2 again (the pre-fix bug)
		expect(audioCalls[2]).toBe(0);
	});

	it('cycleAudioTracks does nothing when the tracks list is empty', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		const audioCalls: number[] = [];
		Object.assign(player, {
			audioTracks: () => [],
			audioTrack: (idx?: number) => {
				if (idx !== undefined) audioCalls.push(idx);
				return null;
			},
		});

		player.cycleAudioTracks();
		expect(audioCalls).toHaveLength(0);
	});

	it('cycleAudioTracks from null selection starts at 0', async () => {
		const player = new NMVideoPlayer('test').setup({});
		await player.ready();

		let currentAudio: { index: number; track: AudioTrack } | null = null;
		const audioCalls: number[] = [];

		Object.assign(player, {
			audioTracks: () => AUDIO_TRACKS,
			audioTrack: (idx?: number) => {
				if (idx === undefined) return currentAudio;
				currentAudio = { index: idx, track: AUDIO_TRACKS[idx]! };
				audioCalls.push(idx);
			},
		});

		player.cycleAudioTracks();
		expect(audioCalls).toEqual([0]);
	});
});
