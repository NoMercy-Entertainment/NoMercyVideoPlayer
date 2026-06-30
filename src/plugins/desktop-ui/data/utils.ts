// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Generic, pure, dependency-free helpers — thin re-export barrel.
 *
 * All four utilities now live in `@nomercy-entertainment/nomercy-player-core`
 * so that the music player and other consumers can share them. This file
 * re-exports from core to preserve existing import paths inside this plugin.
 *
 * Widget-specific positioning helpers (clampPopOffset, clampTooltip) stay in
 * their respective modules.
 */

export {
	clampVolume,
	escapeHtml,
	formatDuration,
	formatSeconds,
} from '@nomercy-entertainment/nomercy-player-core';
