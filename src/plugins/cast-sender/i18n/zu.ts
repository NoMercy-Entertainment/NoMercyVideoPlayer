// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Kusakazwa "{title}"',
	'plugin.cast-sender.casting.episode': 'Kusakazwa {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Kusakazwa bukhoma: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Sakaza kusukela kuleli phuzu',
	'plugin.cast-sender.action.continue-on-tv': 'Qhubeka ku-TV',
} satisfies Record<CastSenderTranslationKey, string>;
