// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '「{title}」をキャスト中',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} をキャスト中',
	'plugin.cast-sender.casting.live': 'ライブ配信中: {title}',
	'plugin.cast-sender.action.cast-from-here': 'この位置からキャスト',
	'plugin.cast-sender.action.continue-on-tv': 'テレビで続ける',
} satisfies Record<CastSenderTranslationKey, string>;
