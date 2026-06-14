// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Trasmissione di "{title}"',
	'plugin.cast-sender.casting.episode': 'Trasmissione di {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Trasmissione in diretta: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Trasmetti da questo punto',
	'plugin.cast-sender.action.continue-on-tv': 'Continua sulla TV',
} satisfies Record<CastSenderTranslationKey, string>;
