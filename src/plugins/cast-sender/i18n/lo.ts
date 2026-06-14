// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'ກຳລັງສົ່ງ "{title}"',
	'plugin.cast-sender.casting.episode': 'ກຳລັງສົ່ງ {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'ກຳລັງສົ່ງສົດ: {title}',
	'plugin.cast-sender.action.cast-from-here': 'ສົ່ງຈາກຈຸດນີ້',
	'plugin.cast-sender.action.continue-on-tv': 'ສືບຕໍ່ໃນໂທລະທັດ',
} satisfies Record<CastSenderTranslationKey, string>;
