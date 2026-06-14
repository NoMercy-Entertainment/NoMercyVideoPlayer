// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'S\'està emetent "{title}"',
	'plugin.cast-sender.casting.episode': 'S\'està emetent {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Emissió en directe: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Emet des d\'aquest punt',
	'plugin.cast-sender.action.continue-on-tv': 'Continua a la TV',
} satisfies Record<CastSenderTranslationKey, string>;
