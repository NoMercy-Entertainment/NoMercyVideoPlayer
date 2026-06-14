// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Пахши "{title}"',
	'plugin.cast-sender.casting.episode': 'Пахши {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Пахши мустақим: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Аз ин нуқта пахш кунед',
	'plugin.cast-sender.action.continue-on-tv': 'Дар телевизор идома диҳед',
} satisfies Record<CastSenderTranslationKey, string>;
