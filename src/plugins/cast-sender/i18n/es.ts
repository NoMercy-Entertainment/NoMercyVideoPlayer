// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { CastSenderTranslationKey } from './en';

export default {
	'plugin.cast-sender.casting.movie': 'Enviando "{title}"',
	'plugin.cast-sender.casting.episode': 'Enviando {show} S{season}E{episode}: {title}',
	'plugin.cast-sender.casting.live': 'Enviando en directo: {title}',
	'plugin.cast-sender.action.cast-from-here': 'Enviar desde este punto',
	'plugin.cast-sender.action.continue-on-tv': 'Continuar en la TV',
} satisfies Record<CastSenderTranslationKey, string>;
