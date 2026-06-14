// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Трансляция "{title}"',
	'plugin.cast-sender.casting.episode': 'Трансляция {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Прямая трансляция: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Транслировать с этого момента',
	'plugin.cast-sender.action.continue-on-tv': 'Продолжить на ТВ',
} satisfies Record<CastSenderTranslationKey, string>;
