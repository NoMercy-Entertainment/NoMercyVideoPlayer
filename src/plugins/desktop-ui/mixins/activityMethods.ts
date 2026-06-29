// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Activity / auto-hide mixin — wrapper layer over the free functions in
 * `activity.ts`.
 *
 * `activity.ts` owns the pure state-machine logic (bumpActivity, maybeHide,
 * dismissOverlay, setActivity). This mixin binds those functions to the
 * plugin's `_activityState`, `player`, `opts.inactivityMs`, and the
 * lifecycle-managed `timeout` — concerns that belong on the plugin, not on
 * the stateless free functions.
 *
 * Owns: bumpActivity, maybeHide, dismissOverlay.
 */

import type { DesktopUiInternals } from '../internals';
import { bumpActivity, dismissOverlay, maybeHide } from '../helpers/activity';

export const activityMethods = {
	bumpActivity(this: DesktopUiInternals): void {
		bumpActivity(
			this._activityState,
			this.player,
			this.opts?.inactivityMs ?? 4000,
			ms => this.timeout(() => this.maybeHide(), ms),
		);
	},

	maybeHide(this: DesktopUiInternals): void {
		maybeHide(this._activityState, this.player);
	},

	dismissOverlay(this: DesktopUiInternals): void {
		dismissOverlay(this._activityState, this.player);
	},
} as const;
