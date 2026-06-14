// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Transmitindo "{title}"',
	'plugin.cast-sender.casting.episode': 'Transmitindo {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Transmitindo ao vivo: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Transmitir a partir deste ponto',
	'plugin.cast-sender.action.continue-on-tv': 'Continuar na TV',
} satisfies Record<CastSenderTranslationKey, string>;
