// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}"-ის ტრანსლაცია',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} ტრანსლაცია',
	'plugin.cast-sender.casting.live': 'პირდაპირი ტრანსლაცია: {title}',
	'plugin.cast-sender.action.cast-from-here': 'ამ წერტილიდან ტრანსლაცია',
	'plugin.cast-sender.action.continue-on-tv': 'გააგრძელეთ ტელევიზორზე',
} satisfies Record<CastSenderTranslationKey, string>;
