// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Thin static seed for the title-prefix token translations (`%S<n>` / `%E<n>`
 * plus the season-0 extras label).
 *
 * This bundle contains ONLY the title-prefix token keys from the
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
	'af': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Ekstra' },
	'ar': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'إضافات' },
	'bg': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'bn': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'অতিরিক্ত' },
	'ca': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'cs': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'cy': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Pethau ychwanegol' },
	'da': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'de': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'el': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Έξτρα' },
	'en': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'es': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'et': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'eu': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'fa': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'اضافات' },
	'fi': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'fr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'ga': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Bónais' },
	'gl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'gu': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'વધારાઓ' },
	'he': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'תוספות' },
	'hi': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'अतिरिक्त' },
	'hr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'hu': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'hy': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Լրացուցիչ' },
	'id': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Ekstra' },
	'is': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'it': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'ja': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': '特典' },
	'ka': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'დამატებითი' },
	'kk': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Қосымша' },
	'km': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'ផ្ដល់ជូន' },
	'kn': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'ಎಕ್ಸ್ಟ್ರಾ' },
	'ko': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': '스페셜' },
	'ku': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'ky': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'lo': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'ເພີ່ມເຕີມ' },
	'lt': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'lv': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'mk': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'ml': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'അതിരിക്ത' },
	'mn': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'mr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'एक्सट्रा' },
	'ms': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Ekstra' },
	'my': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'အပိုဆက်တွဲ' },
	'nb': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'ne': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'अतिरिक्त' },
	'nl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'A{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'nn': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'no': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'oc': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'pa': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'ਵਾਧੂ' },
	'pl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'pt': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'pt-BR': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'ro': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'ru': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Дополнения' },
	'si': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'අතිරේකව' },
	'sk': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'sl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'sq': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Shtesa' },
	'sr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'sv': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'sw': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Nyongeza' },
	'ta': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'கூடுதல்' },
	'te': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'అదనం' },
	'tg': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'th': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'เสริม' },
	'tl': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Karagdagan' },
	'tr': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Ekstralar' },
	'uk': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Додатки' },
	'ur': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'اضافے' },
	'uz': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'vi': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Nội dung bổ sung' },
	'xh': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Extras' },
	'yo': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Ẹkstra' },
	'zh': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': '特典' },
	'zh-TW': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': '特典' },
	'zu': { 'plugin.desktop-ui.token.season': 'S{number}', 'plugin.desktop-ui.token.episode': 'E{number}', 'plugin.desktop-ui.token.extras': 'Okusheshana' },
};
