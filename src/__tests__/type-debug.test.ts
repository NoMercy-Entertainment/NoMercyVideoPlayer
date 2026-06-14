// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import type { VideoEventMap } from '../types';
import { describe, expect, it } from 'vitest';

// Compile-time assertions: 'waiting' and 'fullscreen' must be present in
// VideoEventMap so DesktopUiPlugin can subscribe to them via Plugin.on().
type _HasWaiting = 'waiting' extends keyof VideoEventMap ? true : never;
type _HasFullscreen = 'fullscreen' extends keyof VideoEventMap ? true : never;
const _w: _HasWaiting = true as const;
const _f: _HasFullscreen = true as const;

describe('VideoEventMap shape', () => {
	it('keeps the `waiting` + `fullscreen` keys consumers depend on', () => {
		expect(_w).toBe(true);
		expect(_f).toBe(true);
	});
});
