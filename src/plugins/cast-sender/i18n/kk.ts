// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" таратылуда',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} таратылуда',
	'plugin.cast-sender.casting.live': 'Тікелей таратылуда: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Осы нүктеден таратыңыз',
	'plugin.cast-sender.action.continue-on-tv': 'Теледидарда жалғастыру',
} satisfies Record<CastSenderTranslationKey, string>;
