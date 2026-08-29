// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { IStorage } from '@nomercy-entertainment/nomercy-player-core';

const AUDIO_KEY = 'nmplayer-language-audio';
const SUBTITLE_KEY = 'nmplayer-language-subtitle';

/** Recorded when the viewer turns subtitles off, so a later item stays off. */
export const SUBTITLES_OFF = 'off';

/**
 * The viewer's last chosen audio and subtitle language, carried from one item
 * to the next.
 *
 * A choice is a language, never a track index: an index means a different
 * language on every file, and the master playlist's own DEFAULT flag follows
 * the source's stream order, so neither survives an episode change. Remembering
 * the language is what makes the next episode open in the language the viewer
 * picked, whatever the encode declared.
 */
export class TrackLanguageMemory {
	private audio: string | null = null;
	private subtitle: string | null = null;

	constructor(private readonly storage?: IStorage) {
		this.audio = this.read(AUDIO_KEY);
		this.subtitle = this.read(SUBTITLE_KEY);
	}

	audioLanguage(): string | null {
		return this.audio;
	}

	subtitleLanguage(): string | null {
		return this.subtitle;
	}

	rememberAudio(language: string | null | undefined): void {
		if (!language)
			return;
		this.audio = language;
		this.write(AUDIO_KEY, language);
	}

	/** Pass `SUBTITLES_OFF` for a deliberate off; `undefined` is not a choice. */
	rememberSubtitle(language: string | null | undefined): void {
		if (!language)
			return;
		this.subtitle = language;
		this.write(SUBTITLE_KEY, language);
	}

	private read(key: string): string | null {
		try {
			const raw = this.storage?.get?.(key);
			return typeof raw === 'string' && raw.length > 0 ? raw : null;
		}
		catch {
			return null;
		}
	}

	private write(key: string, value: string): void {
		try {
			void this.storage?.set?.(key, value);
		}
		catch {
			// A viewer with site data blocked still gets the in-memory carry-over.
		}
	}
}
