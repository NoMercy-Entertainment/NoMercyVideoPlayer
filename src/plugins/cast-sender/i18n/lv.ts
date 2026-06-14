// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Tiek apraidīts "{title}"',
	'plugin.cast-sender.casting.episode': 'Tiek apraidīts {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Tiešraides apraide: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Apraidīt no šī punkta',
	'plugin.cast-sender.action.continue-on-tv': 'Turpināt televizorā',
} satisfies Record<CastSenderTranslationKey, string>;
