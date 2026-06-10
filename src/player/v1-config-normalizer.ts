import type { BasePlaylistItem, Translations } from '@nomercy-entertainment/nomercy-player-core';
import type { VideoPlayerConfig, VideoPlaylistItem } from '../types';
import { applyKitV1Compat } from '@nomercy-entertainment/nomercy-player-core/compat';

/**
 * Extended v1 config shape accepted at the library boundary.
 *
 * The compat layer widens these fields so existing consumer code that passes
 * v1-style values compiles without source changes.
 */
export type V1VideoConfig<T extends BasePlaylistItem> = Omit<VideoPlayerConfig<T>, 'playlist' | 'translations'> & {
	/**
	 * Playlist items. Accepts the v2 `T[]` shape, the base `VideoPlaylistItem[]`,
	 * or a URL string. Also accepts arrays of v1-era items (wider fonts/tracks
	 * shape) so consumer code that adds extra fields on playlist items compiles
	 * without changes — the runtime only reads fields it knows about.
	 */
	playlist?: T[] | VideoPlaylistItem[] | BasePlaylistItem[] | string;
	/** @deprecated v1 bearer token shortcut. Maps to `auth.bearerToken`. */
	accessToken?: string | (() => string);
	/** @deprecated v1 debug flag. Maps to `logLevel: 'debug'`. */
	debug?: boolean;
	/**
	 * v1 URL-template array (e.g. `['/locales/{lang}/player.json']`) or a
	 * canonical v2 `Translations` bundle. URL templates are dropped silently —
	 * the v2 kit uses `loadTranslations` for runtime fetching. Pass a
	 * `Translations` object for static bundles.
	 */
	translations?: string | string[] | Translations;
	/** @deprecated v1 server base URL hint. Accepted and dropped. */
	basePath?: string;
	/** @deprecated v1 CDN image base. Accepted and dropped. */
	imageBasePath?: string;
	/** @deprecated v1 touch-control flag. Accepted and dropped. */
	disableTouchControls?: boolean;
	/** @deprecated v1 native controls toggle. Accepted and dropped (always false in v2). */
	controls?: boolean;
	/**
	 * @deprecated v1 UI delay (ms) before controls auto-hide. Accepted at the
	 * library boundary and used by the DesktopUI / TvUI plugins — core ignores it.
	 */
	controlsTimeout?: number;
	/**
	 * @deprecated v1 double-click delay (ms) for distinguishing single vs double
	 * taps. Accepted at the library boundary for DesktopUI / TvUI plugins.
	 */
	doubleClickDelay?: number;
	/**
	 * @deprecated v1 custom storage adapter — an object with `set`, `get`, and
	 * `remove` methods. Accepted at the library boundary and dropped silently;
	 * use the v2 storage adapter contract instead.
	 */
	customStorage?: {
		set(key: string, value: string): Promise<void>;
		get(key: string): Promise<string | null>;
		remove(key: string): Promise<void>;
	};
};

/**
 * Normalise a v1 video player config to the v2 `VideoPlayerConfig` shape.
 *
 * Applies the kit-level normalizer (`accessToken` → `auth.bearerToken`,
 * `debug: true` → `logLevel: 'debug'`) and strips v1-only fields that have
 * no v2 equivalent. Called at the library boundary inside the
 * `nmplayer` / `nmVideoPlayer` factory `setup()` wrapper so that core never
 * sees v1-era fields.
 *
 * Safe to call on a config that is already v2-clean — all mappings are
 * additive and conditional (existing v2 values always win).
 */
export function normalizeVideoConfig<T extends BasePlaylistItem = VideoPlaylistItem>(
	config: V1VideoConfig<T>,
): VideoPlayerConfig<T> {
	const { translations, basePath, imageBasePath, disableTouchControls, controls, controlsTimeout, doubleClickDelay, customStorage, playlist, ...rest } = config;

	void basePath;
	void imageBasePath;
	void disableTouchControls;
	void controls;
	void controlsTimeout;
	void doubleClickDelay;
	void customStorage;

	const normalised: VideoPlayerConfig<T> & { accessToken?: string | (() => string); debug?: boolean } = {
		...rest,
		// Cast the widened playlist back to the v2 type. At runtime the player only
		// reads fields it knows about — extra consumer fields are silently ignored.
		playlist: playlist as T[] | string | undefined,
		// Preserve v2-style Translations objects; drop string / string[] URL templates.
		translations: translations !== undefined && typeof translations !== 'string' && !Array.isArray(translations)
			? translations
			: undefined,
	};

	return applyKitV1Compat(normalised) as VideoPlayerConfig<T>;
}
