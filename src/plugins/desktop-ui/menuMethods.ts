// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Menu mixin — open/close orchestration, repaint dispatch, keyboard nav.
 *
 * `menuControl.ts` owns the pure rendering and aria-management logic
 * (openMainMenu, openSubMenu, closeAllMenus, repaint*, syncActiveIndexes,
 * wireMenuKeyboardNav). This mixin binds those functions to the plugin's
 * state bags (`_menuControlState`, `_activityState`, `menus`,
 * `_menuControlRefs`) and the lifecycle-managed `listen`.
 *
 * Owns: openMainMenu, openSubMenu, closeAllMenus, syncActiveIndexes,
 *       wireMenuKeyboardNav, repaintSubsIfOpen, repaintAudioIfOpen,
 *       repaintQualityIfOpen, repaintSpeedIfOpen, repaintPlaylistIfOpen,
 *       repaintAspectRatioIfOpen.
 */

import type { SubMenuId } from './menus';
import type { DesktopUiInternals } from './internals';
import {
	closeAllMenus as closeAllMenusFn,
	openMainMenu as openMainMenuFn,
	openSubMenu as openSubMenuFn,
	repaintAspectRatioIfOpen as repaintAspectRatioIfOpenFn,
	repaintAudioIfOpen as repaintAudioIfOpenFn,
	repaintPlaylistIfOpen as repaintPlaylistIfOpenFn,
	repaintQualityIfOpen as repaintQualityIfOpenFn,
	repaintSpeedIfOpen as repaintSpeedIfOpenFn,
	repaintSubsIfOpen as repaintSubsIfOpenFn,
	syncActiveIndexes as syncActiveIndexesFn,
	wireMenuKeyboardNav as wireMenuKeyboardNavFn,
} from './menuControl';

export const menuMethods = {
	openMainMenu(this: DesktopUiInternals): void {
		openMainMenuFn(this._menuControlState, this._activityState, this.menus, this._menuControlRefs);
	},

	openSubMenu(this: DesktopUiInternals, id: SubMenuId): void {
		openSubMenuFn(
			id,
			this._menuControlState,
			this._activityState,
			this.menus,
			this._menuControlRefs,
			this.player,
			this.listen.bind(this),
			() => this.closeAllMenus(),
			this.opts,
			() => this.bumpActivity(),
		);
	},

	wireMenuKeyboardNav(this: DesktopUiInternals): void {
		wireMenuKeyboardNavFn(this._menuControlState, this.menus, this.listen.bind(this));
	},

	closeAllMenus(this: DesktopUiInternals): void {
		closeAllMenusFn(
			this._menuControlState,
			this._activityState,
			this.menus,
			this._menuControlRefs,
			() => this.bumpActivity(),
		);
	},

	syncActiveIndexes(this: DesktopUiInternals): void {
		syncActiveIndexesFn(this._menuControlState, this.player);
	},

	repaintSubsIfOpen(this: DesktopUiInternals): void {
		repaintSubsIfOpenFn(
			this._menuControlState,
			this.menus,
			this.player,
			this.listen.bind(this),
			() => this.closeAllMenus(),
			this.opts,
		);
	},

	repaintAudioIfOpen(this: DesktopUiInternals): void {
		repaintAudioIfOpenFn(
			this._menuControlState,
			this.menus,
			this.player,
			this.listen.bind(this),
			() => this.closeAllMenus(),
			this.opts,
		);
	},

	repaintQualityIfOpen(this: DesktopUiInternals): void {
		repaintQualityIfOpenFn(
			this._menuControlState,
			this.menus,
			this.player,
			this.listen.bind(this),
			() => this.closeAllMenus(),
			this.opts,
		);
	},

	repaintSpeedIfOpen(this: DesktopUiInternals): void {
		repaintSpeedIfOpenFn(
			this._menuControlState,
			this.menus,
			this.player,
			this.listen.bind(this),
			() => this.closeAllMenus(),
			this.opts,
		);
	},

	repaintPlaylistIfOpen(this: DesktopUiInternals): void {
		repaintPlaylistIfOpenFn(
			this._menuControlState,
			this.menus,
			this.player,
			this.listen.bind(this),
			() => this.closeAllMenus(),
			this.opts,
		);
	},

	repaintAspectRatioIfOpen(this: DesktopUiInternals): void {
		repaintAspectRatioIfOpenFn(
			this._menuControlState,
			this.menus,
			this.player,
			this.listen.bind(this),
			() => this.closeAllMenus(),
			this.opts,
		);
	},
} as const;
