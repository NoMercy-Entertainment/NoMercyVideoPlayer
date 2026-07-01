// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Plugin-registration API tests for NMVideoPlayer. Mirrors music.
 */

import { Plugin } from '@nomercy-entertainment/nomercy-player-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

class HelloPlugin extends Plugin {
	static override readonly id = 'hello';
	static override readonly version = '0.1.0';
	static override readonly translations = { en: { 'plugin.hello.greet': 'hi' } };

	used = false;
	disposed = false;

	override use(): void {
		this.used = true;
	}

	override dispose(): void {
		this.disposed = true;
	}
}

class NeedsHelloPlugin extends Plugin {
	static override readonly id = 'needs-hello';
	static override readonly requires = [HelloPlugin];
}

describe('NMVideoPlayer — plugin registration', () => {
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

	const setup = (): NMVideoPlayer => new NMVideoPlayer('test').setup({});

	it('addPlugin returns this for chaining and instantiates+uses the plugin', async () => {
		const videoPlayer = setup();
		expect(videoPlayer.addPlugin(HelloPlugin)).toBe(videoPlayer);
		await videoPlayer.ready();
		expect(videoPlayer.getPlugin(HelloPlugin)?.used).toBe(true);
	});

	it('emits plugin:installed with id and version', async () => {
		const videoPlayer = setup();
		let payload: { id: string; version: string } | undefined;
		videoPlayer.on('plugin:installed' as any, (data: any) => { payload = data; });
		videoPlayer.addPlugin(HelloPlugin);
		await videoPlayer.ready();
		expect(payload?.id).toBe('hello');
	});

	it('static translations are merged on register and stripped on dispose', async () => {
		const videoPlayer = setup();
		videoPlayer.addPlugin(HelloPlugin);
		await videoPlayer.ready();
		expect(videoPlayer.t('plugin.hello.greet')).toBe('hi');
		videoPlayer.removePlugin(HelloPlugin);
		expect(videoPlayer.t('plugin.hello.greet')).toBe('plugin.hello.greet');
	});

	it('throws core:plugin/duplicate-id on second add', () => {
		const videoPlayer = setup();
		videoPlayer.addPlugin(HelloPlugin);
		expect(() => videoPlayer.addPlugin(HelloPlugin)).toThrow(/core:plugin\/duplicate-id/);
	});

	it('throws core:plugin/missing-dep when a required plugin is absent', () => {
		const videoPlayer = setup();
		expect(() => videoPlayer.addPlugin(NeedsHelloPlugin)).toThrow(/core:plugin\/missing-dep/);
	});

	it('removePlugin disposes the instance and emits plugin:disposed', async () => {
		const videoPlayer = setup();
		videoPlayer.addPlugin(HelloPlugin);
		await videoPlayer.ready();
		const instance = videoPlayer.getPlugin(HelloPlugin);
		let disposedId: string | undefined;
		videoPlayer.on('plugin:disposed' as any, (data: any) => { disposedId = data.id; });
		videoPlayer.removePlugin(HelloPlugin);
		expect(instance?.disposed).toBe(true);
		expect(disposedId).toBe('hello');
	});

	it('plugins() lists every registered plugin', async () => {
		const videoPlayer = setup();
		videoPlayer.addPlugin(HelloPlugin);
		await videoPlayer.ready();
		expect(videoPlayer.plugins().length).toBe(1);
	});
});
