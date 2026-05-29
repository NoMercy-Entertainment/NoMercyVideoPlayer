// Video-specific plugins
export { autoAdvancePlugin, AutoAdvancePlugin } from './auto-advance';
export type { AutoAdvanceOptions } from './auto-advance';
export { castSenderPlugin, CastSenderPlugin } from './cast-sender';
export type { CastSenderEvents, CastSenderOptions } from './cast-sender';
export { desktopUiPlugin, DesktopUiPlugin } from './desktop-ui/index';
export type { DesktopUiOptions } from './desktop-ui/index';
export { drmPlugin, DrmPlugin } from './drm';
export type { DrmEvents, DrmOptions } from './drm';
export { embedPlugin, EmbedPlugin } from './embed';
export type { EmbedCommand, EmbedEventMessage, EmbedOptions } from './embed';

// Cross-library plugins (from the kit, with video-specific defaults where applicable)
export { keyHandlerPlugin, KeyHandlerPlugin } from './key-handler';
// Heavy orchestration plugins — server coordination, DRM, cast handoff, skip ranges
export { liveTranscodingPlugin, LiveTranscodingPlugin } from './live-transcoding';

export type { LiveTranscodingEvents, LiveTranscodingOptions } from './live-transcoding';
export { mediaSessionPlugin, MediaSessionPlugin } from './media-session';

export { messagePlugin, MessagePlugin } from './message';
export type { MessageOptions } from './message';
export { octopusPlugin, OctopusPlugin } from './octopus';
export type { OctopusOptions } from './octopus';
export { skipperPlugin, SkipperPlugin } from './skipper';
export type { SkipperEvents, SkipperKind, SkipperOptions, SkipperRange } from './skipper';
export { subtitleOverlayPlugin, SubtitleOverlayPlugin } from './subtitle-overlay/index';
export type { SubtitleOverlayOptions } from './subtitle-overlay/index';

export { tabLeaderPlugin, TabLeaderPlugin } from './tab-leader';
export type { TabLeaderOptions } from './tab-leader';
export { touchZonesPlugin, TouchZonesPlugin } from './touch-zones';
export type { TouchZonesOptions } from './touch-zones';
// TV remote control plugin — subclasses KeyHandlerPlugin with TV-specific bindings
export { tvUiPlugin, TvUiPlugin } from './tv-ui';
export type { TvUiOptions } from './tv-ui';
// Audio-graph plugins re-exported from core for ergonomic imports.
// Layered composition: addPlugin(audioGraphPlugin) → addPlugin(equalizerPlugin / mixerPlugin / spectrumPlugin / canvasPlugin / visualizers).
// All opt-in — video apps that don't want EQ on audio tracks pay zero cost.
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
