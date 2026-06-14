// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" yayınlanıyor',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} yayınlanıyor',
	'plugin.cast-sender.casting.live': 'Canlı yayınlanıyor: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Bu noktadan yayınla',
	'plugin.cast-sender.action.continue-on-tv': 'TV\'de devam et',
} satisfies Record<CastSenderTranslationKey, string>;
