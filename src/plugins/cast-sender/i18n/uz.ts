// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" uzatilmoqda',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} uzatilmoqda',
	'plugin.cast-sender.casting.live': 'Jonli uzatilmoqda: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Shu nuqtadan uzatish',
	'plugin.cast-sender.action.continue-on-tv': 'Televizorda davom ettirish',
} satisfies Record<CastSenderTranslationKey, string>;
