// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" ကို Cast လုပ်နေသည်',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} ကို Cast လုပ်နေသည်',
	'plugin.cast-sender.casting.live': 'တိုက်ရိုက် Cast လုပ်နေသည်: {title}',
	'plugin.cast-sender.action.cast-from-here': 'ဤနေရာမှ Cast လုပ်ပါ',
	'plugin.cast-sender.action.continue-on-tv': 'တီဗီတွင် ဆက်လုပ်ပါ',
} satisfies Record<CastSenderTranslationKey, string>;
