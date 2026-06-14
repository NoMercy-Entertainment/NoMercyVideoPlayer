// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'در حال ارسال "{title}"',
	'plugin.cast-sender.casting.episode': 'در حال ارسال {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'پخش زنده: {title}',
	'plugin.cast-sender.action.cast-from-here': 'ارسال از این نقطه',
	'plugin.cast-sender.action.continue-on-tv': 'ادامه روی تلویزیون',
} satisfies Record<CastSenderTranslationKey, string>;
