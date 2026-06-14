// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Predvajanje "{title}"',
	'plugin.cast-sender.casting.episode': 'Predvajanje {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Predvajanje v živo: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Predvajaj od te točke',
	'plugin.cast-sender.action.continue-on-tv': 'Nadaljuj na TV',
} satisfies Record<CastSenderTranslationKey, string>;
