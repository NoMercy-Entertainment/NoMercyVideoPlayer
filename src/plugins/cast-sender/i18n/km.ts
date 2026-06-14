// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'កំពុងថត "{title}"',
	'plugin.cast-sender.casting.episode': 'កំពុងថត {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'កំពុងថតផ្សាយផ្ទាល់៖ {title}',
	'plugin.cast-sender.action.cast-from-here': 'ថតចាប់ពីចំណុចនេះ',
	'plugin.cast-sender.action.continue-on-tv': 'បន្តនៅលើទូរទស្សន៍',
} satisfies Record<CastSenderTranslationKey, string>;
