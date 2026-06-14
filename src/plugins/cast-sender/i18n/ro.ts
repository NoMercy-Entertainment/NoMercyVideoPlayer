// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Se transmite "{title}"',
	'plugin.cast-sender.casting.episode': 'Se transmite {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Se transmite live: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Transmite din acest punct',
	'plugin.cast-sender.action.continue-on-tv': 'Continuă pe TV',
} satisfies Record<CastSenderTranslationKey, string>;
