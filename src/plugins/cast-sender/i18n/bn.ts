// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" কাস্ট করা হচ্ছে',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} কাস্ট করা হচ্ছে',
	'plugin.cast-sender.casting.live': 'লাইভ কাস্ট করা হচ্ছে: {title}',
	'plugin.cast-sender.action.cast-from-here': 'এই বিন্দু থেকে কাস্ট করুন',
	'plugin.cast-sender.action.continue-on-tv': 'টিভিতে চালিয়ে যান',
} satisfies Record<CastSenderTranslationKey, string>;
