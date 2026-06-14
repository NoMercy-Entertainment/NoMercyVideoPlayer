// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Емитовање "{title}"',
	'plugin.cast-sender.casting.episode': 'Емитовање {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Емитовање уживо: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Емитуј од ове тачке',
	'plugin.cast-sender.action.continue-on-tv': 'Настави на ТВ-у',
} satisfies Record<CastSenderTranslationKey, string>;
