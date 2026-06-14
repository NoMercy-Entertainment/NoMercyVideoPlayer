// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" ਕਾਸਟ ਹੋ ਰਿਹਾ ਹੈ',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} ਕਾਸਟ ਹੋ ਰਿਹਾ ਹੈ',
	'plugin.cast-sender.casting.live': 'ਲਾਈਵ ਕਾਸਟ ਹੋ ਰਿਹਾ ਹੈ: {title}',
	'plugin.cast-sender.action.cast-from-here': 'ਇਸ ਬਿੰਦੂ ਤੋਂ ਕਾਸਟ ਕਰੋ',
	'plugin.cast-sender.action.continue-on-tv': 'ਟੀਵੀ \'ਤੇ ਜਾਰੀ ਰੱਖੋ',
} satisfies Record<CastSenderTranslationKey, string>;
