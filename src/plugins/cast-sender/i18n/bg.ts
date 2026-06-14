// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Предаване на "{title}"',
	'plugin.cast-sender.casting.episode': 'Предаване на {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Предаване на живо: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Предаване от тази точка',
	'plugin.cast-sender.action.continue-on-tv': 'Продължи на телевизора',
} satisfies Record<CastSenderTranslationKey, string>;
