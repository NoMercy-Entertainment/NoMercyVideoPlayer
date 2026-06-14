// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Kusasazwa "{title}"',
	'plugin.cast-sender.casting.episode': 'Kusasazwa {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Kusasazwa bukhoma: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Sasaza ukusuka kule ndawo',
	'plugin.cast-sender.action.continue-on-tv': 'Qhubeka kwiTV',
} satisfies Record<CastSenderTranslationKey, string>;
