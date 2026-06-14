// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Ń ṣe Cast "{title}"',
	'plugin.cast-sender.casting.episode': 'Ń ṣe Cast {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Ń ṣe Cast tààrà: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Ṣe Cast láti ibí yìí',
	'plugin.cast-sender.action.continue-on-tv': 'Tẹ̀síwájú lórí TV',
} satisfies Record<CastSenderTranslationKey, string>;
