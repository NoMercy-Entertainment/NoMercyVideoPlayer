// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Caster "{title}"',
	'plugin.cast-sender.casting.episode': 'Caster {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Caster direkte: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Cast fra dette punktet',
	'plugin.cast-sender.action.continue-on-tv': 'Fortsett på TV',
} satisfies Record<CastSenderTranslationKey, string>;
