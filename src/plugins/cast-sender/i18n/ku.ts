// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" tê weşandin',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} tê weşandin',
	'plugin.cast-sender.casting.live': 'Weşana zindî: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Ji vê xalê biweşîne',
	'plugin.cast-sender.action.continue-on-tv': 'Li ser TV bidomîne',
} satisfies Record<CastSenderTranslationKey, string>;
