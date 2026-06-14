// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" कास्ट होत आहे',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} कास्ट होत आहे',
	'plugin.cast-sender.casting.live': 'थेट कास्ट होत आहे: {title}',
	'plugin.cast-sender.action.cast-from-here': 'या बिंदूपासून कास्ट करा',
	'plugin.cast-sender.action.continue-on-tv': 'टीव्हीवर सुरू ठेवा',
} satisfies Record<CastSenderTranslationKey, string>;
