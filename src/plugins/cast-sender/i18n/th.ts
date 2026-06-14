// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'กำลังแคสต์ "{title}"',
	'plugin.cast-sender.casting.episode': 'กำลังแคสต์ {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'กำลังแคสต์สด: {title}',
	'plugin.cast-sender.action.cast-from-here': 'แคสต์จากจุดนี้',
	'plugin.cast-sender.action.continue-on-tv': 'เล่นต่อบนทีวี',
} satisfies Record<CastSenderTranslationKey, string>;
