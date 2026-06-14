// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Diffusion de "{title}"',
	'plugin.cast-sender.casting.episode': 'Diffusion de {show} S{season}E{episode} : {title}',
	'plugin.cast-sender.casting.live': 'Diffusion en direct : {title}',
	'plugin.cast-sender.action.cast-from-here': 'Diffuser à partir d\'ici',
	'plugin.cast-sender.action.continue-on-tv': 'Continuer sur la TV',
} satisfies Record<CastSenderTranslationKey, string>;
