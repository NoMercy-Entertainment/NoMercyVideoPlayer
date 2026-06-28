// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Shared hls.js stub for plugin tests that instantiate NMVideoPlayer but do
 * not exercise HLS-specific behaviour. Aliased via vitest.config.ts so every
 * test file that imports (directly or transitively) from 'hls.js' gets this
 * module instead of the real peer dependency, which is not installed in the
 * video-player package's own node_modules.
 *
 * Tests that need to interact with HLS internals (html5-backend-core,
 * backend-load) use inline `vi.mock('hls.js', ...)` which takes precedence
 * over this alias.
 */

type HlsListener = (event: string, data: unknown) => void;

class FakeHls {
	levels: unknown[] = [];
	audioTracks: unknown[] = [];
	subtitleTracks: unknown[] = [];
	audioTrack = 0;
	subtitleTrack = -1;
	currentLevel = -1;
	loadLevel = -1;
	nextLevel = -1;
	autoLevelCapping = -1;

	private _listeners = new Map<string, HlsListener[]>();

	static isSupported = (): boolean => true;

	static Events: Record<string, string> = {
		MANIFEST_PARSED: 'hlsManifestParsed',
		ERROR: 'hlsError',
		FRAG_LOADED: 'hlsFragLoaded',
		LEVEL_SWITCHED: 'hlsLevelSwitched',
		FRAG_CHANGED: 'hlsFragChanged',
	};

	static ErrorTypes: Record<string, string> = {
		NETWORK_ERROR: 'networkError',
		MEDIA_ERROR: 'mediaError',
	};

	on(event: string, fn: HlsListener): void {
		if (!this._listeners.has(event)) {
			this._listeners.set(event, []);
		}
		this._listeners.get(event)!.push(fn);
	}

	attachMedia(_el: HTMLVideoElement): void { /* stub */ }
	loadSource(_url: string): void { /* stub */ }
	detachMedia(): void { /* stub */ }
	destroy(): void { /* stub */ }
	startLoad(): void { /* stub */ }
	stopLoad(): void { /* stub */ }
	recoverMediaError(): void { /* stub */ }
}

export default FakeHls;
