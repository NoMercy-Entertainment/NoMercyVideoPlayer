// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Perduodama "{title}"',
	'plugin.cast-sender.casting.episode': 'Perduodama {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Perduodama tiesiogiai: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Perduoti nuo šios vietos',
	'plugin.cast-sender.action.continue-on-tv': 'Tęsti per TV',
} satisfies Record<CastSenderTranslationKey, string>;
