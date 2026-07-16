// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Tests for `DesktopUiOptions.portraitHidden`.
 *
 * Portrait fits roughly five or six controls, so the plugin forces a set off
 * regardless of width. Which set is the consumer's call: an episodic app needs
 * `next`/`chapterNext` to survive so a viewer can skip an intro one-handed.
 */

import type { DesktopUiButtonOptions } from '../../plugins/desktop-ui';
import { describe, expect, it } from 'vitest';
import { PORTRAIT_HIDDEN, resolvePortraitHidden, shouldShowButton } from '../../plugins/desktop-ui/helpers/responsive';

type ButtonKey = keyof DesktopUiButtonOptions;

/** Wide enough that nothing is hidden for want of room — isolates the portrait rule. */
const ROOMY = 10_000;

/**
 * Several buttons are opt-in and stay off when the consumer names no options,
 * which would mask the portrait rule under test. Turn every key on so the only
 * thing that can hide a button here is `portraitHidden`.
 */
const ALL_ENABLED: DesktopUiButtonOptions = Object.fromEntries(
	[...PORTRAIT_HIDDEN, 'play', 'mute', 'fullscreen', 'settings', 'seekBack', 'seekForward'].map(key => [key, true]),
) as DesktopUiButtonOptions;

function showsInPortrait(key: ButtonKey, portraitHidden?: ReadonlySet<ButtonKey>): boolean {
	return shouldShowButton(key, 0, ROOMY, true, false, ALL_ENABLED, portraitHidden);
}

describe('desktopUiOptions.portraitHidden', () => {
	it('falls back to the default set when the consumer says nothing', () => {
		expect(resolvePortraitHidden(undefined)).toBe(PORTRAIT_HIDDEN);
		expect(resolvePortraitHidden({})).toBe(PORTRAIT_HIDDEN);
	});

	it('hides next and chapterNext in portrait by default', () => {
		expect(showsInPortrait('next')).toBe(false);
		expect(showsInPortrait('chapterNext')).toBe(false);
	});

	it('keeps next and chapterNext when the consumer drops them from the set', () => {
		const hidden = resolvePortraitHidden({ portraitHidden: ['previous', 'chapterPrev'] });

		expect(showsInPortrait('next', hidden)).toBe(true);
		expect(showsInPortrait('chapterNext', hidden)).toBe(true);
		expect(showsInPortrait('previous', hidden)).toBe(false);
		expect(showsInPortrait('chapterPrev', hidden)).toBe(false);
	});

	it('replaces the default set rather than merging with it', () => {
		// `quality` is hidden by default; naming only `next` must free it.
		const hidden = resolvePortraitHidden({ portraitHidden: ['next'] });

		expect(showsInPortrait('quality', hidden)).toBe(true);
		expect(showsInPortrait('next', hidden)).toBe(false);
	});

	it('forces nothing off in portrait for an empty set', () => {
		const hidden = resolvePortraitHidden({ portraitHidden: [] });

		for (const key of PORTRAIT_HIDDEN)
			expect(showsInPortrait(key, hidden)).toBe(true);
	});

	it('still yields to width — the override buys a seat, not immunity', () => {
		const hidden = resolvePortraitHidden({ portraitHidden: [] });

		// Accumulated width already at the limit: no room left for another button.
		expect(shouldShowButton('next', ROOMY, ROOMY, true, false, ALL_ENABLED, hidden)).toBe(false);
	});

	it('leaves landscape untouched', () => {
		expect(shouldShowButton('next', 0, ROOMY, false, false, ALL_ENABLED)).toBe(true);
	});
});
