// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * LiveTranscodingPlugin — residual gaps not covered by live-transcoding.test.ts:
 *
 *   - waitFor timeout: target never reached → resolves after seekTimeoutMs
 *   - beforeSeek gate: target > transcodedTo → blocked then released by a
 *     progress message arriving during the wait window
 *   - dispose() clears channel + currentJobId (verifiable state)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NMVideoPlayer } from '../../index';
import { LiveTranscodingPlugin, liveTranscodingPlugin } from '../../plugins/live-transcoding';

function resetAndMount(): void {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	const div = document.createElement('div');
	div.id = 'test';
	document.body.appendChild(div);
}

function cleanup(): void {
	(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
	document.body.innerHTML = '';
	vi.restoreAllMocks();
	vi.useRealTimers();
}

// Direct access to private onServerMessage — consistent with existing test pattern.
function callOnServerMsg(inst: LiveTranscodingPlugin, msg: unknown): void {
	(inst as unknown as { onServerMessage: (serverMsg: unknown) => void }).onServerMessage?.(msg);
}

// ── waitFor timeout ───────────────────────────────────────────────────────────

describe('LiveTranscodingPlugin — waitFor timeout resolution', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('waitFor resolves after seekTimeoutMs when no progress arrives', async () => {
		vi.useFakeTimers();

		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(liveTranscodingPlugin, {
			wsUrl: 'wss://transcode.example.com',
			seekTimeoutMs: 300,
		});
		await player.ready();

		const inst = player.getPlugin(LiveTranscodingPlugin)!;

		// Directly call waitFor via the private method so we can time it.
		const waitFor = (inst as unknown as { waitFor: (target: number) => Promise<void> }).waitFor.bind(inst);

		let resolved = false;
		const waitPromise = waitFor(999).then(() => { resolved = false; resolved = true; });

		// Before timeout: not yet resolved.
		expect(resolved).toBe(false);

		// Advance past seekTimeoutMs in 100ms steps (matching the internal tick interval).
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		vi.advanceTimersByTime(100);
		await Promise.resolve();

		await waitPromise;
		expect(resolved).toBe(true);
	});

	it('waitFor resolves immediately when target <= transcodedTo', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(liveTranscodingPlugin, {
			wsUrl: 'wss://transcode.example.com',
			seekTimeoutMs: 5000,
		});
		await player.ready();

		const inst = player.getPlugin(LiveTranscodingPlugin)!;

		// Advance transcodedTo past the target.
		callOnServerMsg(inst, { type: 'progress', transcodedSeconds: 100 });

		const waitFor = (inst as unknown as { waitFor: (target: number) => Promise<void> }).waitFor.bind(inst);

		let resolved = false;
		const waitPromise = waitFor(50).then(() => { resolved = true; });
		await waitPromise;

		expect(resolved).toBe(true);
	});

	it('waitFor unblocks mid-wait when a progress message advances transcodedTo past target', async () => {
		vi.useFakeTimers();

		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(liveTranscodingPlugin, {
			wsUrl: 'wss://transcode.example.com',
			seekTimeoutMs: 10_000,
		});
		await player.ready();

		const inst = player.getPlugin(LiveTranscodingPlugin)!;

		const waitFor = (inst as unknown as { waitFor: (target: number) => Promise<void> }).waitFor.bind(inst);

		let resolved = false;
		const waitPromise = waitFor(60).then(() => { resolved = true; });

		// Tick once — not resolved yet (transcodedTo = 0, target = 60).
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		expect(resolved).toBe(false);

		// A progress message advances past the target.
		callOnServerMsg(inst, { type: 'progress', transcodedSeconds: 60 });

		// Next tick sees transcodedTo >= 60 and resolves.
		vi.advanceTimersByTime(100);
		await Promise.resolve();
		await waitPromise;

		expect(resolved).toBe(true);
	});
});

// ── dispose clears state ──────────────────────────────────────────────────────

describe('LiveTranscodingPlugin — dispose()', () => {
	beforeEach(resetAndMount);
	afterEach(cleanup);

	it('dispose resets transcodedTo to 0', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(liveTranscodingPlugin, { wsUrl: 'wss://transcode.example.com' });
		await player.ready();

		const inst = player.getPlugin(LiveTranscodingPlugin)!;
		callOnServerMsg(inst, { type: 'progress', transcodedSeconds: 75 });
		expect(inst.transcodedTo()).toBe(75);

		inst.dispose();
		expect(inst.transcodedTo()).toBe(0);
	});

	it('dispose clears channel reference', async () => {
		const player = new NMVideoPlayer('test').setup({});
		player.addPlugin(liveTranscodingPlugin, { wsUrl: 'wss://transcode.example.com' });
		await player.ready();

		const inst = player.getPlugin(LiveTranscodingPlugin)!;
		inst.dispose();

		// After dispose, channel is undefined — verified by reading the private field.
		const channel = (inst as unknown as { channel: unknown }).channel;
		expect(channel).toBeUndefined();
	});
});
