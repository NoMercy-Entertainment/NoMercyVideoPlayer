// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Subtitle menu row labels — v1 parity. Sidecar tracks arrive with raw wire
 * values (`language: 'eng'`, `type: 'full'`); the menu must show the
 * localized language name with the variant suffix: `English (Full)`. The
 * regression: rows rendered the raw `label` field and read "full" / "sign"
 * with no language at all.
 */

import type { SubtitleTrackRef } from '../../types';
import { describe, expect, it } from 'vitest';
import { languageDisplayName, subtitleTrackLabel } from '../../plugins/desktop-ui/language-names';

function t(key: string): string {
	return ({
		'plugin.desktop-ui.menu.subtitleType.full': 'Full',
		'plugin.desktop-ui.menu.subtitleType.sign': 'Sign',
	} as Record<string, string>)[key] ?? key;
}

function track(overrides: Partial<SubtitleTrackRef>): SubtitleTrackRef {
	return { id: 'subtitle-sidecar-0', label: 'full', url: 'https://x.test/s.ass', ...overrides };
}

describe('languageDisplayName()', () => {
	it('resolves ISO 639-2 bibliographic codes', () => {
		expect(languageDisplayName('eng', 'en')).toBe('English');
		expect(languageDisplayName('dut', 'en')).toBe('Dutch');
	});

	it('renders in the requested UI language', () => {
		expect(languageDisplayName('eng', 'nl')).toBe('Engels');
	});

	it('maps container quirk codes to BCP-47', () => {
		expect(languageDisplayName('pob', 'en')).toBe('Brazilian Portuguese');
	});

	it('returns null for unresolvable codes', () => {
		expect(languageDisplayName('zz-invalid', 'en')).toBeNull();
		expect(languageDisplayName(undefined, 'en')).toBeNull();
	});
});

describe('subtitleTrackLabel()', () => {
	it('composes language + translated variant — the regression case', () => {
		expect(subtitleTrackLabel(track({ language: 'eng', type: 'full', label: 'full' }), 'en', t, 'Track 1')).toBe('English (Full)');
		expect(subtitleTrackLabel(track({ language: 'eng', type: 'sign', label: 'sign' }), 'en', t, 'Track 2')).toBe('English (Sign)');
	});

	it('localizes the language name to the UI language', () => {
		expect(subtitleTrackLabel(track({ language: 'eng', type: 'full' }), 'nl', t, 'Track 1')).toBe('Engels (Full)');
	});

	it('shows untranslated variants raw', () => {
		expect(subtitleTrackLabel(track({ language: 'eng', type: 'sdh' }), 'en', t, 'Track 1')).toBe('English (sdh)');
	});

	it('language without variant renders the name alone', () => {
		expect(subtitleTrackLabel(track({ language: 'eng', type: undefined, label: 'English' }), 'en', t, 'Track 1')).toBe('English');
	});

	it('falls back to the raw label, then the default', () => {
		expect(subtitleTrackLabel(track({ language: undefined, type: undefined, label: 'Commentary' }), 'en', t, 'Track 1')).toBe('Commentary');
		expect(subtitleTrackLabel(track({ language: undefined, type: undefined, label: '' }), 'en', t, 'Track 3')).toBe('Track 3');
	});
});
