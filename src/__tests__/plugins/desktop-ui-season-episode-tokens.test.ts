// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Unit tests for `resolveSeasonEpisodeTokens`.
 *
 * The playlist API embeds braceless `%S<n>`/`%E<n>` tokens in title strings.
 * The resolver expands each to the short, locale-aware prefix from `player.t()`
 * (en `S1`/`E1`, nl `S1`/`A1`) while leaving all surrounding text intact.
 */

import { describe, expect, it } from 'vitest';

import { resolveSeasonEpisodeTokens } from '../../plugins/desktop-ui/seasonEpisodeTokens';

function makePlayer(seasonTpl = 'S{number}', episodeTpl = 'E{number}'): {
	t: (key: string, vars?: Record<string, string>) => string;
} {
	return {
		t(key: string, vars?: Record<string, string>): string {
			const tpl = key.endsWith('.season') ? seasonTpl : episodeTpl;
			return tpl.replace('{number}', vars?.number ?? '');
		},
	};
}

describe('resolveSeasonEpisodeTokens()', () => {
	it('replaces a single %S token', () => {
		const player = makePlayer();
		expect(resolveSeasonEpisodeTokens(player as never, '%S1')).toBe('S1');
	});

	it('replaces a single %E token', () => {
		const player = makePlayer();
		expect(resolveSeasonEpisodeTokens(player as never, '%E5')).toBe('E5');
	});

	it('replaces both tokens in one string with surrounding text', () => {
		const player = makePlayer();
		expect(resolveSeasonEpisodeTokens(player as never, '%S1 %E1 - Now Is Not the End'))
			.toBe('S1 E1 - Now Is Not the End');
	});

	it('preserves text surrounding a single token', () => {
		const player = makePlayer();
		expect(resolveSeasonEpisodeTokens(player as never, 'Recap: %S2'))
			.toBe('Recap: S2');
		expect(resolveSeasonEpisodeTokens(player as never, '%E12 - The Reckoning'))
			.toBe('E12 - The Reckoning');
	});

	it('handles multi-digit season and episode numbers', () => {
		const player = makePlayer();
		expect(resolveSeasonEpisodeTokens(player as never, '%S10')).toBe('S10');
		expect(resolveSeasonEpisodeTokens(player as never, '%E12')).toBe('E12');
	});

	it('returns a no-token string unchanged', () => {
		const player = makePlayer();
		expect(resolveSeasonEpisodeTokens(player as never, 'The Reckoning')).toBe('The Reckoning');
	});

	it('returns empty string for empty input', () => {
		const player = makePlayer();
		expect(resolveSeasonEpisodeTokens(player as never, '')).toBe('');
	});

	it('localizes the episode prefix letter (nl episode is A)', () => {
		const player = makePlayer('S{number}', 'A{number}');
		expect(resolveSeasonEpisodeTokens(player as never, '%S1 %E1'))
			.toBe('S1 A1');
	});

	it('replaces multiple tokens of the same type in one string', () => {
		const player = makePlayer();
		expect(resolveSeasonEpisodeTokens(player as never, '%S1 and %S2'))
			.toBe('S1 and S2');
	});
});
