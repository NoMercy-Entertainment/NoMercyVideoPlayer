// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" कास्ट गर्दै',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} कास्ट गर्दै',
	'plugin.cast-sender.casting.live': 'लाइभ कास्ट गर्दै: {title}',
	'plugin.cast-sender.action.cast-from-here': 'यस बिन्दुबाट कास्ट गर्नुहोस्',
	'plugin.cast-sender.action.continue-on-tv': 'टिभीमा जारी राख्नुहोस्',
} satisfies Record<CastSenderTranslationKey, string>;
