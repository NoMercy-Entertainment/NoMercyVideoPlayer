// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Thin static seed for the `%S<n>` / `%E<n>` title-token translations.
 *
 * This bundle contains ONLY the two season/episode prefix keys from the
 * desktop-ui i18n set. It is imported statically by `NMVideoPlayer` so token
 * resolution at queue-ingest time works regardless of whether `DesktopUiPlugin`
 * has been added, and regardless of which language bundles have been loaded
 * asynchronously. The full desktop-ui bundle is still loaded lazily by the
 * plugin's `static translations` declaration — this file does not replace it,
 * it merely ensures the token keys are never absent.
 *
 * Keys are the canonical `plugin.desktop-ui.token.*` names so they share the
 * same namespace as the full plugin bundle; no key duplication.
 */

import type { Translations } from '@nomercy-entertainment/nomercy-player-core';

export const titleTokenTranslations: Translations = {
	'af': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ar': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'bg': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'bn': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ca': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'cs': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'cy': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'da': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'de': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'el': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'en': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'es': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'et': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'eu': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'fa': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'fi': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'fr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ga': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'gl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'gu': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'he': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'hi': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'hr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'hu': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'hy': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'id': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'is': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'it': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ja': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ka': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'kk': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'km': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'kn': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ko': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ku': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ky': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'lo': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'lt': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'lv': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'mk': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ml': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'mn': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'mr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ms': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'my': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'nb': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ne': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'nl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'A{number}' },
	'nn': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'no': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'oc': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'pa': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'pl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'pt': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'pt-BR': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ro': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ru': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'si': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'sk': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'sl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'sq': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'sr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'sv': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'sw': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ta': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'te': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'tg': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'th': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'tl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'tr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'uk': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'ur': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'uz': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'vi': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'xh': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'yo': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'zh': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'zh-TW': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
	'zu': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}' },
};
