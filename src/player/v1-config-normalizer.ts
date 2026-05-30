import type { BasePlaylistItem } from '@nomercy-entertainment/nomercy-player-core';
import type { VideoPlayerConfig, VideoPlaylistItem } from '../types';
import { applyKitV1Compat } from '@nomercy-entertainment/nomercy-player-core/compat';

/**
 * Normalise a v1 video player config to the v2 `VideoPlayerConfig` shape.
 *
 * Applies the kit-level normalizer (`accessToken` → `auth.bearerToken`,
 * `debug: true` → `logLevel: 'debug'`) and returns a clean config with the
 * deprecated fields stripped. Called at the library boundary inside the
 * `nmplayer` / `nmVideoPlayer` factory `setup()` wrapper so that core never
 * sees v1-era fields.
 *
 * Safe to call on a config that is already v2-clean — all mappings are
 * additive and conditional (existing v2 values always win).
 */
export function normalizeVideoConfig<T extends BasePlaylistItem = VideoPlaylistItem>(
	config: VideoPlayerConfig<T> & { accessToken?: string | (() => string); debug?: boolean },
): VideoPlayerConfig<T> {
	return applyKitV1Compat(config) as VideoPlayerConfig<T>;
}
