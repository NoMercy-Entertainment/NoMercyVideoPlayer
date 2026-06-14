// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" таратылууда',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} таратылууда',
	'plugin.cast-sender.casting.live': 'Түз эфирде таратылууда: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Ушул жерден таратуу',
	'plugin.cast-sender.action.continue-on-tv': 'Сыналгыдан улантуу',
} satisfies Record<CastSenderTranslationKey, string>;
