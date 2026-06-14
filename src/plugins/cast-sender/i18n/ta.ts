// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" அனுப்பப்படுகிறது',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} அனுப்பப்படுகிறது',
	'plugin.cast-sender.casting.live': 'நேரலையில் அனுப்பப்படுகிறது: {title}',
	'plugin.cast-sender.action.cast-from-here': 'இந்த இடத்திலிருந்து அனுப்பு',
	'plugin.cast-sender.action.continue-on-tv': 'டிவியில் தொடரவும்',
} satisfies Record<CastSenderTranslationKey, string>;
