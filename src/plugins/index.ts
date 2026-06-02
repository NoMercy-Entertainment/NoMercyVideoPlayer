// Video-specific plugins
export { castSenderPlugin, CastSenderPlugin } from './cast-sender';
export type { CastSenderEvents, CastSenderOptions } from './cast-sender';
export { desktopUiPlugin, DesktopUiPlugin } from './desktop-ui/index';
export type { DesktopUiOptions } from './desktop-ui/index';
export { drmPlugin, DrmPlugin } from './drm';
export type { DrmEvents, DrmOptions } from './drm';

// Cross-library plugins (from the kit, with video-specific defaults where applicable)
export { keyHandlerPlugin, KeyHandlerPlugin } from './key-handler';
// Heavy orchestration plugins — server coordination, DRM, cast handoff, skip ranges
export { liveTranscodingPlugin, LiveTranscodingPlugin } from './live-transcoding';
export type { LiveTranscodingEvents, LiveTranscodingOptions } from './live-transcoding';
export { mediaSessionPlugin, MediaSessionPlugin } from './media-session';
export { octopusPlugin, OctopusPlugin } from './octopus';
export type { OctopusOptions } from './octopus';
export { skipperPlugin, SkipperPlugin } from './skipper';
export type { SkipperEvents, SkipperKind, SkipperOptions, SkipperRange } from './skipper';
export { subtitleOverlayPlugin, SubtitleOverlayPlugin } from './subtitle-overlay/index';
export type { SubtitleOverlayOptions } from './subtitle-overlay/index';
export { touchZonesPlugin, TouchZonesPlugin } from './touch-zones';
export type { TouchZonesOptions } from './touch-zones';
// TV remote control plugin — subclasses KeyHandlerPlugin with TV-specific bindings
export { tvKeyHandlerPlugin, TvKeyHandlerPlugin } from './tv-key-handler';
export type { TvKeyHandlerOptions } from './tv-key-handler';

// Cross-library kit plugins re-exported for ergonomic imports.
export {
	audioGraphPlugin,
	AudioGraphPlugin,
	canvasPlugin,
	CanvasPlugin,
	equalizerPlugin,
	EqualizerPlugin,
	mixerPlugin,
	MixerPlugin,
	spectrumPlugin,
	SpectrumPlugin,
	VisualizationPlugin,
} from '@nomercy-entertainment/nomercy-player-core';
export type {
	AudioGraphEvents,
	AudioGraphOptions,
	CanvasEvents,
	CanvasOptions,
	CanvasRenderFn,
	EqBand,
	EqPreset,
	EqualizerEvents,
	EqualizerOptions,
	MixerEvents,
	MixerOptions,
	SpectrumOptions,
	VisualizationFrame,
	VisualizationOptions,
} from '@nomercy-entertainment/nomercy-player-core';

export { embedPlugin, EmbedPlugin } from '@nomercy-entertainment/nomercy-player-core/plugins/embed';
export type {
	EmbedCommand,
	EmbedEventMessage,
	EmbedForwardedEvent,
	EmbedOptions,
	EmbedSerializedError,
} from '@nomercy-entertainment/nomercy-player-core/plugins/embed';

export { messagePlugin, MessagePlugin } from '@nomercy-entertainment/nomercy-player-core/plugins/message';
export type { MessageInput, MessageOptions } from '@nomercy-entertainment/nomercy-player-core/plugins/message';

export { tabLeaderPlugin, TabLeaderPlugin } from '@nomercy-entertainment/nomercy-player-core/plugins/tab-leader';
export type { TabLeaderEvents, TabLeaderOptions } from '@nomercy-entertainment/nomercy-player-core/plugins/tab-leader';
