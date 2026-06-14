// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Przesyłanie "{title}"',
	'plugin.cast-sender.casting.episode': 'Przesyłanie {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Przesyłanie na żywo: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Przesyłaj od tego miejsca',
	'plugin.cast-sender.action.continue-on-tv': 'Kontynuuj na telewizorze',
} satisfies Record<CastSenderTranslationKey, string>;
