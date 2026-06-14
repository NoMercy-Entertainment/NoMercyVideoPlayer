// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" විකාශනය වෙමින්',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} විකාශනය වෙමින්',
	'plugin.cast-sender.casting.live': 'සජීවී විකාශනය: {title}',
	'plugin.cast-sender.action.cast-from-here': 'මෙම ස්ථානයේ සිට විකාශනය කරන්න',
	'plugin.cast-sender.action.continue-on-tv': 'රූපවාහිනියේ දිගටම කරගෙන යන්න',
} satisfies Record<CastSenderTranslationKey, string>;
