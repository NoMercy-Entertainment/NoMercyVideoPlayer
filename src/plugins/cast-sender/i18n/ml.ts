// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" കാസ്റ്റ് ചെയ്യുന്നു',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} കാസ്റ്റ് ചെയ്യുന്നു',
	'plugin.cast-sender.casting.live': 'ലൈവ് കാസ്റ്റ് ചെയ്യുന്നു: {title}',
	'plugin.cast-sender.action.cast-from-here': 'ഈ പോയിന്റിൽ നിന്ന് കാസ്റ്റ് ചെയ്യുക',
	'plugin.cast-sender.action.continue-on-tv': 'ടിവിയിൽ തുടരുക',
} satisfies Record<CastSenderTranslationKey, string>;
