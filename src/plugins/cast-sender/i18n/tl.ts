// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Kina-cast ang "{title}"',
	'plugin.cast-sender.casting.episode': 'Kina-cast ang {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Kina-cast nang live: {title}',
	'plugin.cast-sender.action.cast-from-here': 'I-cast mula sa puntong ito',
	'plugin.cast-sender.action.continue-on-tv': 'Magpatuloy sa TV',
} satisfies Record<CastSenderTranslationKey, string>;
