// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { TvKeyHandlerTranslationKey } from './en';

export default {
	'plugin.tv-key-handler.info.chapter': 'Kapitel',
	'plugin.tv-key-handler.info.noTitle': 'Ingen titel',
	'plugin.tv-key-handler.info.timeRemaining': 'kvar',
	'plugin.tv-key-handler.seek.red': '+30s',
	'plugin.tv-key-handler.seek.green': '+60s',
	'plugin.tv-key-handler.seek.yellow': '+90s',
	'plugin.tv-key-handler.seek.blue': '+120s',
	'plugin.tv-key-handler.aspectRatio.cycled': 'Bildförhållande',
	'plugin.tv-key-handler.bookmark.added': 'Bokmärke tillagt',
} satisfies Record<TvKeyHandlerTranslationKey, string>;
