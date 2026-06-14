// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" átküldése',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} átküldése',
	'plugin.cast-sender.casting.live': 'Élő átküldés: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Átküldés ettől a ponttól',
	'plugin.cast-sender.action.continue-on-tv': 'Folytatás a TV-n',
} satisfies Record<CastSenderTranslationKey, string>;
