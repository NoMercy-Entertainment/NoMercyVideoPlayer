// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" કાસ્ટ થઈ રહ્યું છે',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} કાસ્ટ થઈ રહ્યું છે',
	'plugin.cast-sender.casting.live': 'લાઇવ કાસ્ટ થઈ રહ્યું છે: {title}',
	'plugin.cast-sender.action.cast-from-here': 'આ બિંદુથી કાસ્ટ કરો',
	'plugin.cast-sender.action.continue-on-tv': 'ટીવી પર ચાલુ રાખો',
} satisfies Record<CastSenderTranslationKey, string>;
