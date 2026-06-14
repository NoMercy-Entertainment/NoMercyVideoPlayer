// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Po transmetohet "{title}"',
	'plugin.cast-sender.casting.episode': 'Po transmetohet {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Po transmetohet drejtpërdrejt: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Transmeto nga kjo pikë',
	'plugin.cast-sender.action.continue-on-tv': 'Vazhdo në TV',
} satisfies Record<CastSenderTranslationKey, string>;
