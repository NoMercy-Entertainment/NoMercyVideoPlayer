// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * English strings for the media-session plugin. Drop a sibling `<tag>.ts` to add a language.
 */
const translations = {
	'plugin.media-session.season': 'Season {season}',
};

/** Canonical translation key set for the media-session plugin, derived from English. */
export type MediaSessionTranslationKey = keyof typeof translations;

export default translations;
