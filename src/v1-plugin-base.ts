// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * @module v1-plugin-base — v1 Plugin base class shim.
 *
 * Provides the v1 `Plugin` base class contract so existing consumer plugins
 * that extend `Plugin` compile against v2 without source changes.
 *
 * v1 Plugin lifecycle:
 *   1. `new MyPlugin()` — construction (no args required by base)
 *   2. `player.registerPlugin('name', instance)` — calls `initialize(player)`
 *   3. `player.usePlugin('name')` — calls `use()`
 *   4. `player.dispose()` — calls `dispose()` on all registered plugins
 *
 * @deprecated Extend `Plugin` from `@nomercy-entertainment/nomercy-player-core`
 * in new code. This class will be removed in the first stable 2.x release.
 */

// Use a structural player type to avoid circular import with index.ts.
// No index signature here — NMPlayer satisfies this without one.
interface _V1Player {
	readonly playerId: string;
	on(event: string, callback: (...args: unknown[]) => void): void;
	off(event: string, callback?: (...args: unknown[]) => void): void;
}

/**
 * @deprecated v1 Plugin base class. Extend this class during the migration window
 * only. New plugins should extend `Plugin` from `@nomercy-entertainment/nomercy-player-core`.
 *
 * The v1 lifecycle contract:
 *  - `initialize(player)` — called once when `registerPlugin` is invoked.
 *  - `use()` — called when `usePlugin` is invoked.
 *  - `dispose()` — called when the player disposes.
 *
 * The `player` field is set by `initialize()` and is available from `use()` onward.
 */
// `T` is the public playlist-item generic v1 consumers supply via
// `class MyPlugin extends Plugin<MyItem>`; subclasses reference it through
// `declare player: NMPlayer<T>`. It is intentionally unused in the base body.
// eslint-disable-next-line unused-imports/no-unused-vars
export class Plugin<T = Record<string, unknown>> {
	static readonly id: string = 'plugin';

	/**
	 * The player instance. Set by `initialize()`. Available from `use()` onward.
	 * Typed as `_V1Player` — subclasses narrow this via `declare player: NMPlayer<T>`.
	 * @deprecated In v2 plugins (`extends Plugin` from core), use `this.player`.
	 */
	player!: _V1Player;

	/**
	 * Called once when the plugin is registered via `player.registerPlugin(name, instance)`.
	 * @deprecated In v2 plugins, the player reference is injected by the core plugin host.
	 */
	initialize(player: _V1Player): void {
		this.player = player;
	}

	/**
	 * Called when the plugin is activated via `player.usePlugin(name)`.
	 * Wire event listeners here.
	 * @deprecated In v2 plugins, override `use()` from the core `Plugin` base.
	 */
	use(): void {}

	/**
	 * Called when the player disposes. Remove event listeners and free resources.
	 * @deprecated In v2 plugins, override `dispose()` from the core `Plugin` base.
	 */
	dispose(): void {}
}
