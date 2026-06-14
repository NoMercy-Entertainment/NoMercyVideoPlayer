// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Đang truyền "{title}"',
	'plugin.cast-sender.casting.episode': 'Đang truyền {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Đang truyền trực tiếp: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Truyền từ điểm này',
	'plugin.cast-sender.action.continue-on-tv': 'Tiếp tục trên TV',
} satisfies Record<CastSenderTranslationKey, string>;
