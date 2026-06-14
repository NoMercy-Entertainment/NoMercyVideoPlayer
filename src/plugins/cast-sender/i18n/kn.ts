// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': '"{title}" ಕಾಸ್ಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ',
	'plugin.cast-sender.casting.episode': '{show} S{season}E{episode}: {title} ಕಾಸ್ಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ',
	'plugin.cast-sender.casting.live': 'ಲೈವ್ ಕಾಸ್ಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ: {title}',
	'plugin.cast-sender.action.cast-from-here': 'ಈ ಬಿಂದುವಿನಿಂದ ಕಾಸ್ಟ್ ಮಾಡಿ',
	'plugin.cast-sender.action.continue-on-tv': 'ಟಿವಿಯಲ್ಲಿ ಮುಂದುವರಿಸಿ',
} satisfies Record<CastSenderTranslationKey, string>;
