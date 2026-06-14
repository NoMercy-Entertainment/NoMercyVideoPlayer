// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Menghantar "{title}"',
	'plugin.cast-sender.casting.episode': 'Menghantar {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Menghantar secara langsung: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Hantar dari titik ini',
	'plugin.cast-sender.action.continue-on-tv': 'Teruskan pada TV',
} satisfies Record<CastSenderTranslationKey, string>;
