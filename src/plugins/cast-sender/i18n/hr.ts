// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Emitiranje "{title}"',
	'plugin.cast-sender.casting.episode': 'Emitiranje {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Emitiranje uživo: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Emitiraj od ove točke',
	'plugin.cast-sender.action.continue-on-tv': 'Nastavi na TV-u',
} satisfies Record<CastSenderTranslationKey, string>;
