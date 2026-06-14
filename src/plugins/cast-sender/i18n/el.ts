// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Μετάδοση "{title}"',
	'plugin.cast-sender.casting.episode': 'Μετάδοση {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Ζωντανή μετάδοση: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Μετάδοση από αυτό το σημείο',
	'plugin.cast-sender.action.continue-on-tv': 'Συνέχεια στην τηλεόραση',
} satisfies Record<CastSenderTranslationKey, string>;
