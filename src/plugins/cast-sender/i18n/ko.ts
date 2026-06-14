// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" 캐스트 중',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} 캐스트 중',
	'plugin.cast-sender.casting.live': '라이브 캐스트 중: {title}',
	'plugin.cast-sender.action.cast-from-here': '이 지점부터 캐스트',
	'plugin.cast-sender.action.continue-on-tv': 'TV에서 계속하기',
} satisfies Record<CastSenderTranslationKey, string>;
