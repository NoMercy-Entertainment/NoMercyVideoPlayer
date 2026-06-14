// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'מעביר את "{title}"',
	'plugin.cast-sender.casting.episode': 'מעביר את {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'מעביר בשידור חי: {title}',
	'plugin.cast-sender.action.cast-from-here': 'העברה מנקודה זו',
	'plugin.cast-sender.action.continue-on-tv': 'המשך בטלוויזיה',
} satisfies Record<CastSenderTranslationKey, string>;
