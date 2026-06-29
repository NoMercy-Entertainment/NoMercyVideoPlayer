// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Integration smoke-test: `NMVideoPlayer` registers `%S`/`%E` token keys at
 * construction and seeds the translator with token translations, so titles
 * arrive pre-resolved after `queue()` ingest.
 *
 * This replaces `desktop-ui-season-episode-tokens.test.ts`. The generic engine
 * and its pure-function contract are tested exhaustively in core
 * (`title-tokens.test.ts`). These tests focus on the per-player wiring via the
 * `queueMethods` harness so they run without a backend.
 */

import type { BasePlaylistItem } from '@nomercy-entertainment/nomercy-player-core';
import { DefaultTranslator, MediaList, queueMethods } from '@nomercy-entertainment/nomercy-player-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { titleTokenTranslations } from '../../plugins/desktop-ui/i18n/token-bundle';

// ── Shared token registry that NMVideoPlayer registers ───────────────────────

const VIDEO_TOKEN_REGISTRY = {
	S: 'plugin.desktop-ui.token.season',
	E: 'plugin.desktop-ui.token.episode',
};

// ── Build an internals stub that mirrors the video player's construction ──────

function makeVideoInternals(lang: string = 'en'): ThisParameterType<typeof queueMethods.queue> {
	const translator = new DefaultTranslator({ language: lang });
	translator.addTranslations(titleTokenTranslations);
	void translator.language(lang);

	return {
		_queueList: new MediaList<BasePlaylistItem>(),
		_backlogList: new MediaList<BasePlaylistItem>(),
		_queueWired: true,
		_titleTokenRegistry: { ...VIDEO_TOKEN_REGISTRY },
		_translator: translator,
		normalizePlaylistItem: undefined,
		options: {},
		emit: () => {},
	} as unknown as ThisParameterType<typeof queueMethods.queue>;
}

let internals: ThisParameterType<typeof queueMethods.queue>;

beforeEach(() => {
	internals = makeVideoInternals('en');
});

afterEach(() => {
	internals = undefined as unknown as typeof internals;
});

describe('NMVideoPlayer title-token ingest', () => {
	it('resolves %S and %E tokens in a queued item title (en)', () => {
		queueMethods.queue.call(internals, [{ id: 1, title: '%S1 %E1 - Pilot' }]);

		const items = queueMethods.queue.call(internals) as ReadonlyArray<BasePlaylistItem>;
		expect(items[0]?.title).toBe('S1 E1 - Pilot');
	});

	it('resolves %E token with nl locale (A prefix)', () => {
		const nlInternals = makeVideoInternals('nl');
		queueMethods.queue.call(nlInternals, [{ id: 1, title: '%S2 %E3 - Aflevering' }]);

		const items = queueMethods.queue.call(nlInternals) as ReadonlyArray<BasePlaylistItem>;
		expect(items[0]?.title).toBe('S2 A3 - Aflevering');
	});

	it('leaves a no-token title unchanged', () => {
		queueMethods.queue.call(internals, [{ id: 1, title: 'A Plain Movie Title' }]);

		const items = queueMethods.queue.call(internals) as ReadonlyArray<BasePlaylistItem>;
		expect(items[0]?.title).toBe('A Plain Movie Title');
	});

	it('handles multi-digit episode numbers', () => {
		queueMethods.queue.call(internals, [{ id: 1, title: '%S10 %E12 - Episode' }]);

		const items = queueMethods.queue.call(internals) as ReadonlyArray<BasePlaylistItem>;
		expect(items[0]?.title).toBe('S10 E12 - Episode');
	});

	it('is idempotent: re-ingesting a resolved item leaves title unchanged', () => {
		queueMethods.queue.call(internals, [{ id: 1, title: '%S1 %E1 - Pilot' }]);
		const first = (queueMethods.queue.call(internals) as ReadonlyArray<BasePlaylistItem>)[0];
		if (!first)
			throw new Error('expected item');

		queueMethods.queue.call(internals, [{ id: first.id, title: first.title }]);
		const items = queueMethods.queue.call(internals) as ReadonlyArray<BasePlaylistItem>;
		expect(items[0]?.title).toBe('S1 E1 - Pilot');
	});
});
