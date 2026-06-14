// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * English strings for the tv-key-handler plugin. Drop a sibling `<tag>.ts` to add a language.
 */
const translations = {
	'plugin.tv-key-handler.info.chapter': 'Chapter',
	'plugin.tv-key-handler.info.noTitle': 'No title',
	'plugin.tv-key-handler.info.timeRemaining': 'remaining',
	'plugin.tv-key-handler.seek.red': '+30s',
	'plugin.tv-key-handler.seek.green': '+60s',
	'plugin.tv-key-handler.seek.yellow': '+90s',
	'plugin.tv-key-handler.seek.blue': '+120s',
	'plugin.tv-key-handler.aspectRatio.cycled': 'Aspect ratio',
	'plugin.tv-key-handler.bookmark.added': 'Bookmark added',
};

/** Canonical translation key set for the tv-key-handler plugin, derived from English. */
export type TvKeyHandlerTranslationKey = keyof typeof translations;

export default translations;
