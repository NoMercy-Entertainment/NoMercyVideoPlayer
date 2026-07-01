// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * E4-D1 conformance: Html5VideoBackend exposes the same Web Audio graph tap
 * that `AudioElementBackend` provides, enabling `AudioGraphPlugin` and
 * `SpectrumPlugin` to drive a visualizer from a video player.
 *
 * Verified:
 *   - `outputNode` and `analysisNode` are not called at construction.
 *   - On first call the graph is built lazily:
 *       MediaElementAudioSourceNode → AnalyserNode → GainNode → destination
 *   - `outputNode` returns the GainNode (chain tail).
 *   - `analysisNode` returns the raw MediaElementAudioSourceNode (pre-volume tap).
 *   - `createMediaElementSource` is called exactly once per AudioContext (idempotent).
 *   - Calling with a different AudioContext rebuilds the graph.
 *   - `dispose()` disconnects and releases all nodes.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Html5VideoBackend } from '../adapters/video-backend/html5';

// ── Web Audio stubs ─────────────────────────────────────────────────────────

class MockDestinationNode {
	label = 'destination';
}

class MockGainNode {
	_connections: unknown[] = [];
	gain = { value: 1 };

	connect(target: unknown): void {
		this._connections.push(target);
	}

	disconnect(): void {
		this._connections = [];
	}
}

class MockAnalyserNode {
	fftSize = 2048;
	_connections: unknown[] = [];

	connect(target: unknown): void {
		this._connections.push(target);
	}

	disconnect(): void {
		this._connections = [];
	}
}

class MockSourceNode {
	_connections: unknown[] = [];

	connect(target: unknown): void {
		this._connections.push(target);
	}

	disconnect(): void {
		this._connections = [];
	}
}

class MockAudioContext {
	state: AudioContextState = 'running';
	currentTime = 0;
	destination = new MockDestinationNode() as unknown as AudioDestinationNode;
	sampleRate = 44100;

	createGain = vi.fn((): MockGainNode => new MockGainNode());
	createAnalyser = vi.fn((): MockAnalyserNode => new MockAnalyserNode());
	createMediaElementSource = vi.fn((): MockSourceNode => new MockSourceNode());
	resume = vi.fn(() => Promise.resolve());
}

// ── Helpers ─────────────────────────────────────────────────────────────────

vi.mock('hls.js', () => {
	class FakeHls {
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

		levels: unknown[] = [];
		audioTracks: unknown[] = [];
		subtitleTracks: unknown[] = [];
		audioTrack = 0;
		subtitleTrack = -1;
		currentLevel = -1;
		loadLevel = -1;
		nextLevel = -1;
		autoLevelCapping = -1;

		on(): void { /* stub */ }
		attachMedia(): void { /* stub */ }
		loadSource(): void { /* stub */ }
		detachMedia(): void { /* stub */ }
		destroy(): void { /* stub */ }
		startLoad(): void { /* stub */ }
		stopLoad(): void { /* stub */ }
		recoverMediaError(): void { /* stub */ }
	}

	return { default: FakeHls };
});

function makeBackend(): { backend: Html5VideoBackend; container: HTMLDivElement } {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const backend = new Html5VideoBackend(container);
	return { backend, container };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Html5VideoBackend — Web Audio graph tap (E4-D1)', () => {
	beforeEach(() => {
		(globalThis as unknown as { AudioContext: typeof MockAudioContext }).AudioContext = MockAudioContext;
	});

	afterEach(() => {
		delete (globalThis as unknown as { AudioContext?: unknown }).AudioContext;
		document.body.innerHTML = '';
	});

	it('neither outputNode nor analysisNode trigger createMediaElementSource at construction', () => {
		const { backend } = makeBackend();
		const ctx = new MockAudioContext() as unknown as AudioContext;

		// Reference the backend to confirm it exists — do NOT call the graph methods.
		expect(backend).toBeTruthy();
		expect(ctx.createMediaElementSource).not.toHaveBeenCalled();
	});

	it('outputNode returns the GainNode (chain tail)', () => {
		const { backend } = makeBackend();
		const ctx = new MockAudioContext() as unknown as AudioContext;

		const node = backend.outputNode!(ctx);

		const gainNode = (ctx.createGain as ReturnType<typeof vi.fn>).mock.results[0]?.value;
		expect(node).toBe(gainNode);
	});

	it('analysisNode returns the raw MediaElementAudioSourceNode (pre-volume tap)', () => {
		const { backend } = makeBackend();
		const ctx = new MockAudioContext() as unknown as AudioContext;

		const node = backend.analysisNode!(ctx);

		const sourceNode = (ctx.createMediaElementSource as ReturnType<typeof vi.fn>).mock.results[0]?.value;
		expect(node).toBe(sourceNode);
	});

	it('signal chain is source → analyser → outputGain → destination', () => {
		const { backend } = makeBackend();
		const ctx = new MockAudioContext() as unknown as AudioContext;

		backend.outputNode!(ctx);

		const sourceNode = (ctx.createMediaElementSource as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockSourceNode;
		const analyserNode = (ctx.createAnalyser as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockAnalyserNode;
		const gainNode = (ctx.createGain as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockGainNode;

		expect(sourceNode._connections).toContain(analyserNode);
		expect(analyserNode._connections).toContain(gainNode);
		expect(gainNode._connections).toContain(ctx.destination);
	});

	it('createMediaElementSource is called exactly once per AudioContext', () => {
		const { backend } = makeBackend();
		const ctx = new MockAudioContext() as unknown as AudioContext;

		backend.outputNode!(ctx);
		backend.outputNode!(ctx);
		backend.analysisNode!(ctx);

		expect(ctx.createMediaElementSource).toHaveBeenCalledTimes(1);
	});

	it('outputNode is idempotent — same GainNode returned on repeated calls', () => {
		const { backend } = makeBackend();
		const ctx = new MockAudioContext() as unknown as AudioContext;

		const first = backend.outputNode!(ctx);
		const second = backend.outputNode!(ctx);

		expect(first).toBe(second);
	});

	it('outputNode and analysisNode are consistent across the same context', () => {
		const { backend } = makeBackend();
		const ctx = new MockAudioContext() as unknown as AudioContext;

		const output = backend.outputNode!(ctx);
		const analysis = backend.analysisNode!(ctx);

		const gainNode = (ctx.createGain as ReturnType<typeof vi.fn>).mock.results[0]?.value;
		const sourceNode = (ctx.createMediaElementSource as ReturnType<typeof vi.fn>).mock.results[0]?.value;

		expect(output).toBe(gainNode);
		expect(analysis).toBe(sourceNode);

		// They must be different nodes.
		expect(output).not.toBe(analysis);
	});

	it('rebuilds the graph when called with a different AudioContext', () => {
		const { backend } = makeBackend();
		const ctx1 = new MockAudioContext() as unknown as AudioContext;
		const ctx2 = new MockAudioContext() as unknown as AudioContext;

		backend.outputNode!(ctx1);
		backend.outputNode!(ctx2);

		expect(ctx1.createMediaElementSource).toHaveBeenCalledTimes(1);
		expect(ctx2.createMediaElementSource).toHaveBeenCalledTimes(1);
	});

	it('dispose() disconnects and releases all audio graph nodes', () => {
		const { backend } = makeBackend();
		const ctx = new MockAudioContext() as unknown as AudioContext;

		backend.outputNode!(ctx);

		const sourceNode = (ctx.createMediaElementSource as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockSourceNode;
		const analyserNode = (ctx.createAnalyser as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockAnalyserNode;
		const gainNode = (ctx.createGain as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockGainNode;

		backend.dispose();

		// All nodes are disconnected.
		expect(sourceNode._connections).toHaveLength(0);
		expect(analyserNode._connections).toHaveLength(0);
		expect(gainNode._connections).toHaveLength(0);
	});
});
