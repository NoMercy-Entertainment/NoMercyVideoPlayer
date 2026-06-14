// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" wird gestreamt',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} wird gestreamt',
	'plugin.cast-sender.casting.live': 'Live-Streaming: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Ab dieser Stelle streamen',
	'plugin.cast-sender.action.continue-on-tv': 'Auf dem TV fortsetzen',
} satisfies Record<CastSenderTranslationKey, string>;
