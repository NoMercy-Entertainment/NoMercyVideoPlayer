// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Се емитува "{title}"',
	'plugin.cast-sender.casting.episode': 'Се емитува {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Се емитува во живо: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Емитувај од оваа точка',
	'plugin.cast-sender.action.continue-on-tv': 'Продолжи на ТВ',
} satisfies Record<CastSenderTranslationKey, string>;
