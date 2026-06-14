// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Odesílání "{title}"',
	'plugin.cast-sender.casting.episode': 'Odesílání {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Živé odesílání: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Odeslat od tohoto bodu',
	'plugin.cast-sender.action.continue-on-tv': 'Pokračovat na TV',
} satisfies Record<CastSenderTranslationKey, string>;
