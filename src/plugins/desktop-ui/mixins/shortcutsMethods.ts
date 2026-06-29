// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Keyboard-shortcuts overlay mixin — show/hide/toggle the `?`-keybinds dialog.
 *
 * Owns: toggleShortcuts, showShortcuts, hideShortcuts.
 *
 * The overlay DOM node (`shortcutsOverlay`) and visibility flag
 * (`_shortcutsVisible`) live on the plugin class.
 */

import type { DesktopUiInternals } from './internals';

export const shortcutsMethods = {
	toggleShortcuts(this: DesktopUiInternals): void {
		if (this._shortcutsVisible) {
			this.hideShortcuts();
		}
		else {
			this.showShortcuts();
		}
	},

	showShortcuts(this: DesktopUiInternals): void {
		this._shortcutsVisible = true;
		this.shortcutsOverlay?.classList.add('keybinds-dialog-visible');
	},

	hideShortcuts(this: DesktopUiInternals): void {
		this._shortcutsVisible = false;
		this.shortcutsOverlay?.classList.remove('keybinds-dialog-visible');
	},
} as const;
