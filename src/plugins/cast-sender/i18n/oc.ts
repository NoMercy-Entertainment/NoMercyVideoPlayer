// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Difusion de "{title}"',
	'plugin.cast-sender.casting.episode': 'Difusion de {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Difusion en dirècte : {title}',
	'plugin.cast-sender.action.cast-from-here': 'Difusar a partir d\'aquí',
	'plugin.cast-sender.action.continue-on-tv': 'Contunhar sus la TV',
} satisfies Record<CastSenderTranslationKey, string>;
