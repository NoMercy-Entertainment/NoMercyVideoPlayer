// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Lähetetään "{title}"',
	'plugin.cast-sender.casting.episode': 'Lähetetään {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Lähetetään suorana: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Lähetä tästä kohdasta',
	'plugin.cast-sender.action.continue-on-tv': 'Jatka televisiossa',
} satisfies Record<CastSenderTranslationKey, string>;
