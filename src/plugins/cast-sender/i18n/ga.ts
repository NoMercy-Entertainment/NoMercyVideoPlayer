// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" á chaitheamh',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} á chaitheamh',
	'plugin.cast-sender.casting.live': 'Á chaitheamh beo: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Caith ón bpointe seo',
	'plugin.cast-sender.action.continue-on-tv': 'Lean ar an teilifís',
} satisfies Record<CastSenderTranslationKey, string>;
