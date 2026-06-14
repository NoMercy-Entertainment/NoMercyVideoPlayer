// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}"-г дамжуулж байна',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} дамжуулж байна',
	'plugin.cast-sender.casting.live': 'Шууд дамжуулж байна: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Энэ цэгээс дамжуулах',
	'plugin.cast-sender.action.continue-on-tv': 'Зурагтаар үргэлжлүүлэх',
} satisfies Record<CastSenderTranslationKey, string>;
