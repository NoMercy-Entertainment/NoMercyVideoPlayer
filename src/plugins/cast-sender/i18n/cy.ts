// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Castio "{title}"',
	'plugin.cast-sender.casting.episode': 'Castio {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Castio\'n fyw: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Castio o\'r pwynt hwn',
	'plugin.cast-sender.action.continue-on-tv': 'Parhau ar y teledu',
} satisfies Record<CastSenderTranslationKey, string>;
