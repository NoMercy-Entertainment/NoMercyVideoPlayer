// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Sendir "{title}"',
	'plugin.cast-sender.casting.episode': 'Sendir {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Sendir í beinni: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Senda frá þessum stað',
	'plugin.cast-sender.action.continue-on-tv': 'Halda áfram í sjónvarpi',
} satisfies Record<CastSenderTranslationKey, string>;
