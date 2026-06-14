// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Odosiela sa "{title}"',
	'plugin.cast-sender.casting.episode': 'Odosiela sa {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Živé odosielanie: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Odoslať od tohto bodu',
	'plugin.cast-sender.action.continue-on-tv': 'Pokračovať na TV',
} satisfies Record<CastSenderTranslationKey, string>;
