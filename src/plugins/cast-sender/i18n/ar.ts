// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'جارٍ إرسال "{title}"',
	'plugin.cast-sender.casting.episode': 'جارٍ إرسال {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'بث مباشر: {title}',
	'plugin.cast-sender.action.cast-from-here': 'البث من هذه النقطة',
	'plugin.cast-sender.action.continue-on-tv': 'المتابعة على التلفزيون',
} satisfies Record<CastSenderTranslationKey, string>;
