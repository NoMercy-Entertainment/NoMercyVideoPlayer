// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" کاسٹ ہو رہا ہے',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} کاسٹ ہو رہا ہے',
	'plugin.cast-sender.casting.live': 'لائیو کاسٹ ہو رہا ہے: {title}',
	'plugin.cast-sender.action.cast-from-here': 'اس مقام سے کاسٹ کریں',
	'plugin.cast-sender.action.continue-on-tv': 'ٹی وی پر جاری رکھیں',
} satisfies Record<CastSenderTranslationKey, string>;
