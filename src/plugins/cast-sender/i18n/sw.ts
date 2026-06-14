// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Inatuma "{title}"',
	'plugin.cast-sender.casting.episode': 'Inatuma {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Inatuma moja kwa moja: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Tuma kuanzia hapa',
	'plugin.cast-sender.action.continue-on-tv': 'Endelea kwenye TV',
} satisfies Record<CastSenderTranslationKey, string>;
