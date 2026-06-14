// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" కాస్ట్ చేస్తోంది',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} కాస్ట్ చేస్తోంది',
	'plugin.cast-sender.casting.live': 'లైవ్ కాస్ట్ చేస్తోంది: {title}',
	'plugin.cast-sender.action.cast-from-here': 'ఈ పాయింట్ నుండి కాస్ట్ చేయండి',
	'plugin.cast-sender.action.continue-on-tv': 'టీవీలో కొనసాగించండి',
} satisfies Record<CastSenderTranslationKey, string>;
