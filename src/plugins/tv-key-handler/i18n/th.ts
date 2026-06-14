// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { TvKeyHandlerTranslationKey } from './en';

export default {
	'plugin.tv-key-handler.info.chapter': 'บท',
	'plugin.tv-key-handler.info.noTitle': 'ไม่มีชื่อ',
	'plugin.tv-key-handler.info.timeRemaining': 'เหลืออยู่',
	'plugin.tv-key-handler.seek.red': '+30s',
	'plugin.tv-key-handler.seek.green': '+60s',
	'plugin.tv-key-handler.seek.yellow': '+90s',
	'plugin.tv-key-handler.seek.blue': '+120s',
	'plugin.tv-key-handler.aspectRatio.cycled': 'อัตราส่วนภาพ',
	'plugin.tv-key-handler.bookmark.added': 'เพิ่มที่คั่นแล้ว',
} satisfies Record<TvKeyHandlerTranslationKey, string>;
