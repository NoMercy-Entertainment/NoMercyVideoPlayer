// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" aan het casten',
	'plugin.cast-sender.casting.episode': '{show} S{season}A{episode}: {title} aan het casten',
	'plugin.cast-sender.casting.live': 'Live aan het casten: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Casten vanaf hier',
	'plugin.cast-sender.action.continue-on-tv': 'Doorgaan op TV',
} satisfies Record<CastSenderTranslationKey, string>;
