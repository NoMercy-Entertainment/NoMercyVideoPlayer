// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '正在投放“{title}”',
	'plugin.cast-sender.casting.episode': '正在投放 {show} S{season}E{episode}：{title}',
	'plugin.cast-sender.casting.live': '正在直播投放：{title}',
	'plugin.cast-sender.action.cast-from-here': '从此处开始投放',
	'plugin.cast-sender.action.continue-on-tv': '在电视上继续',
} satisfies Record<CastSenderTranslationKey, string>;
