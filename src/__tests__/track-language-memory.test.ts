// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { IStorage } from '@nomercy-entertainment/nomercy-player-core';
import { describe, expect, it } from 'vitest';
import { SUBTITLES_OFF, TrackLanguageMemory } from '../player/track-language-memory';

function fakeStorage(seed: Record<string, string> = {}): IStorage {
	const store = new Map(Object.entries(seed));
	return {
		get: (key: string) => store.get(key) ?? null,
		set: (key: string, value: string) => { store.set(key, value); },
		remove: (key: string) => { store.delete(key); },
		clear: () => { store.clear(); },
	} as unknown as IStorage;
}

describe('trackLanguageMemory', () => {
	it('carries the chosen audio language to the next item', () => {
		// Death Note ep 18 declares French DEFAULT=YES and Japanese fourth. The
		// viewer picking Japanese must not be undone by the next episode's own
		// stream order.
		const memory = new TrackLanguageMemory();

		expect(memory.audioLanguage()).toBeNull();
		memory.rememberAudio('jpn');
		expect(memory.audioLanguage()).toBe('jpn');
	});

	it('keeps the choice across sessions when storage is available', () => {
		const storage = fakeStorage();
		new TrackLanguageMemory(storage).rememberAudio('jpn');

		expect(new TrackLanguageMemory(storage).audioLanguage()).toBe('jpn');
	});

	it('remembers subtitles turned off as a deliberate choice', () => {
		const memory = new TrackLanguageMemory();
		memory.rememberSubtitle(SUBTITLES_OFF);

		expect(memory.subtitleLanguage()).toBe(SUBTITLES_OFF);
	});

	it('ignores a track that reports no language rather than clearing the choice', () => {
		const memory = new TrackLanguageMemory();
		memory.rememberAudio('jpn');
		memory.rememberAudio(undefined);

		expect(memory.audioLanguage()).toBe('jpn');
	});

	it('survives a storage backend that throws on every access', () => {
		const hostile = {
			get: () => { throw new Error('site data blocked'); },
			set: () => { throw new Error('site data blocked'); },
		} as unknown as IStorage;

		const memory = new TrackLanguageMemory(hostile);
		memory.rememberAudio('jpn');

		expect(memory.audioLanguage()).toBe('jpn');
	});
});
