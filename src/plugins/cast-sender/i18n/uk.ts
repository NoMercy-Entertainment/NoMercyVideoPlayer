// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Трансляція "{title}"',
	'plugin.cast-sender.casting.episode': 'Трансляція {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Пряма трансляція: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Транслювати з цього моменту',
	'plugin.cast-sender.action.continue-on-tv': 'Продовжити на телевізорі',
} satisfies Record<CastSenderTranslationKey, string>;
