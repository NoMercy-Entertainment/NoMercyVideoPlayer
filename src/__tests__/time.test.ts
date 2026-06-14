// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Time / position tests for NMVideoPlayer. Mirrors music.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../index';

describe('NMVideoPlayer — time', () => {
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

	it('time() returns 0 initially', () => {
		expect(setup().time()).toBe(0);
	});

	it('time(t) emits beforeSeek then seek', async () => {
		const p = setup();
		const order: string[] = [];
		p.on('beforeSeek' as any, () => order.push('beforeSeek'));
		p.on('seek' as any, () => order.push('seek'));
		await p.time(10);
		expect(order).toEqual(['beforeSeek', 'seek']);
		expect(p.time()).toBe(10);
	});

	it('preventDefault on beforeSeek leaves the value unchanged + emits seekPrevented', async () => {
		const p = setup();
		await p.time(5);
		let preventedReason: string | undefined;
		p.on('beforeSeek' as any, (e: any) => { e.preventDefault(); });
		p.on('seekPrevented' as any, (data: any) => { preventedReason = data.reason; });
		await p.time(99);
		expect(p.time()).toBe(5);
		expect(preventedReason).toBe('listener-prevented');
	});

	it('clamps negative values to 0', () => {
		const p = setup();
		p.time(-5);
		expect(p.time()).toBe(0);
	});

	it('playbackRate() round-trips and emits backend:ratechange', () => {
		const p = setup();
		expect(p.playbackRate()).toBe(1);
		let rate: number | undefined;
		p.on('backend:ratechange' as any, (data: any) => { rate = data.rate; });
		p.playbackRate(1.5);
		expect(p.playbackRate()).toBe(1.5);
		expect(rate).toBe(1.5);
	});

	it('playbackRates() returns the standard set', () => {
		const rates = setup().playbackRates();
		expect(rates).toContain(1);
		expect(Array.isArray(rates)).toBe(true);
	});

	it('timeData() exposes the aggregated TimeState shape', async () => {
		const p = setup();
		await p.time(3);
		const data = p.timeData();
		expect(data.position).toBe(3);
		expect(data.duration).toBe(0);
		expect(data.buffered).toBe(0);
	});
});
