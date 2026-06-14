// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Castar "{title}"',
	'plugin.cast-sender.casting.episode': 'Castar {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Castar direkte: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Cast frå dette punktet',
	'plugin.cast-sender.action.continue-on-tv': 'Hald fram på TV',
} satisfies Record<CastSenderTranslationKey, string>;
