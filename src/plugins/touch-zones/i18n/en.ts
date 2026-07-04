// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * English strings for the touch-zones plugin. Drop a sibling `<tag>.ts` to add a language.
 */
const translations = {
	'plugin.touch-zones.seek.back': '-{seconds}s',
	'plugin.touch-zones.seek.forward': '+{seconds}s',
};

/** Canonical translation key set for the touch-zones plugin, derived from English. */
export type TouchZonesTranslationKey = keyof typeof translations;

export default translations;
