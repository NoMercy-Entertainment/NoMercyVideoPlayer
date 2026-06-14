// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" कास्ट हो रहा है',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} कास्ट हो रहा है',
	'plugin.cast-sender.casting.live': 'लाइव कास्ट हो रहा है: {title}',
	'plugin.cast-sender.action.cast-from-here': 'इस बिंदु से कास्ट करें',
	'plugin.cast-sender.action.continue-on-tv': 'टीवी पर जारी रखें',
} satisfies Record<CastSenderTranslationKey, string>;
