// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" igortzen',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} igortzen',
	'plugin.cast-sender.casting.live': 'Zuzeneko igorpena: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Igorri puntu honetatik',
	'plugin.cast-sender.action.continue-on-tv': 'Jarraitu telebistan',
} satisfies Record<CastSenderTranslationKey, string>;
