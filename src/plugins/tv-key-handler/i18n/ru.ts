// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { TvKeyHandlerTranslationKey } from './en';

export default {
	'plugin.tv-key-handler.info.chapter': 'Глава',
	'plugin.tv-key-handler.info.noTitle': 'Без названия',
	'plugin.tv-key-handler.info.timeRemaining': 'осталось',
	'plugin.tv-key-handler.seek.red': '+30s',
	'plugin.tv-key-handler.seek.green': '+60s',
	'plugin.tv-key-handler.seek.yellow': '+90s',
	'plugin.tv-key-handler.seek.blue': '+120s',
	'plugin.tv-key-handler.aspectRatio.cycled': 'Соотношение сторон',
	'plugin.tv-key-handler.bookmark.added': 'Закладка добавлена',
} satisfies Record<TvKeyHandlerTranslationKey, string>;
