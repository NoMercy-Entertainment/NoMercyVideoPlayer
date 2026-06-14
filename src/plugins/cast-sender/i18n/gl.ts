// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Emitindo "{title}"',
	'plugin.cast-sender.casting.episode': 'Emitindo {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Emitindo en directo: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Emitir desde este punto',
	'plugin.cast-sender.action.continue-on-tv': 'Continuar na TV',
} satisfies Record<CastSenderTranslationKey, string>;
