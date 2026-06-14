// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}"-ի հեռարձակում',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} հեռարձակում',
	'plugin.cast-sender.casting.live': 'Ուղիղ հեռարձակում՝ {title}',
	'plugin.cast-sender.action.cast-from-here': 'Հեռարձակել այս կետից',
	'plugin.cast-sender.action.continue-on-tv': 'Շարունակել հեռուստացույցով',
} satisfies Record<CastSenderTranslationKey, string>;
