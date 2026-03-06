import type { LevelAttributes, LevelDetails, MediaDecodingInfo } from 'hls.js';

export { type VTTData, WebVTTParser } from 'webvtt-parser';

export interface TypeMapping {
	json: JSON;
	text: string;
	blob: Blob;
	arrayBuffer: ArrayBuffer;
}

export type TypeMappings = string | Blob | ArrayBuffer;

export interface Version {
	version: string;
	major: number;
	minor: number;
}

export interface OS {
	android: boolean;
	iOS: boolean;
	iPad: boolean;
	iPhone: boolean;
	mac: boolean;
	mobile: boolean;
	tizen: boolean;
	tizenApp: boolean;
	version: Version;
	windows: boolean;
}

export interface CaptionsConfig {
	color?: string;
	fontSize?: number;
	fontFamily?: string;
	fontOpacity?: number;
	backgroundColor?: string;
	backgroundOpacity?: number;
	edgeStyle?: 'none' | 'depressed' | 'dropshadow' | 'raised' | 'uniform';
	windowColor?: string;
	windowOpacity?: number;
}

export interface SubtitleStyle {
	textOpacity: number;
	fontFamily: string;
	fontSize: number;
	textColor: string;
	edgeStyle: EdgeStyle;
	backgroundColor: string;
	backgroundOpacity: number;
	areaColor: string;
	windowOpacity: number;
}

export interface Level {
	readonly _attrs: LevelAttributes[];
	readonly audioCodec: string | undefined;
	readonly bitrate: number;
	readonly codecSet: string;
	readonly url: string[];
	readonly frameRate: number;
	readonly height: number;
	readonly id: number;
	readonly name: string;
	readonly videoCodec: string | undefined;
	readonly width: number;
	details?: LevelDetails;
	fragmentError: number;
	loadError: number;
	loaded?: {
		bytes: number;
		duration: number;
	};
	realBitrate: number;
	supportedPromise?: Promise<MediaDecodingInfo>;
	supportedResult?: MediaDecodingInfo;
	label: string;
}

export type Preload = 'metadata' | 'auto' | 'none';

export interface PlaylistItem {
	id: string | number;
	uuid?: string;
	seasonName?: string;
	progress?: {
		time: number;
		date: string;
	};
	duration: string;
	file: string;
	image: string;
	title: string;
	tracks?: Track[];
	description: string;
	season?: number;
	episode?: number;
	show?: string;
	year?: number;
}

export type TrackType = 'subtitles' | 'chapters' | 'thumbnails' | 'sprite' | 'fonts' | 'skippers';

export interface Skipper {
	id: string;
	title: string;
	startTime: number;
	endTime: number;
	type: string;
}

export interface Font {
	file: string;
	mimeType: string;
}

export interface BaseTrack {
	id: number;
	file: string;
	default?: boolean;
	channel_layout?: string;
}

export interface SubtitleTrack extends BaseTrack {
	kind: 'subtitles';
	label: string;
	language: string;
	type?: string;
	ext?: string;
}

export interface ChapterTrack extends BaseTrack {
	kind: 'chapters';
}

export interface ThumbnailTrack extends BaseTrack {
	kind: 'thumbnails';
}

export interface SpriteTrack extends BaseTrack {
	kind: 'sprite';
}

export interface FontTrack extends BaseTrack {
	kind: 'fonts';
}

export interface SkipperTrack extends BaseTrack {
	kind: 'skippers';
}

export type Track = SubtitleTrack | ChapterTrack | ThumbnailTrack | SpriteTrack | FontTrack | SkipperTrack;

export interface TrackKindMap {
	subtitles: SubtitleTrack;
	chapters: ChapterTrack;
	thumbnails: ThumbnailTrack;
	sprite: SpriteTrack;
	fonts: FontTrack;
	skippers: SkipperTrack;
}

export interface AudioTrack {
	id: number;
	language: string;
	label: string;
	name?: string;
}

export interface CurrentTrack {
	id: number;
	name: string;
}

export type PlayState = 'buffering' | 'idle' | 'paused' | 'playing';

export type Stretching = 'exactfit' | 'fill' | 'none' | 'uniform' | '16:9' | '4:3';

export type EdgeStyle = 'none' | 'depressed' | 'dropShadow' | 'textShadow' | 'raised' | 'uniform';

export interface PreviewTime {
	start: number;
	end: number;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface VolumeState {
	muted: boolean;
	volume: number;
}

export interface Chapter {
	endTime: number;
	id: string;
	left: number;
	startTime: number;
	time: number;
	title: string;
	width: number;
}

export interface TimeData {
	currentTime: number;
	duration: number;
	percentage: number;
	remaining: number;
	currentTimeHuman: string;
	durationHuman: string;
	remainingHuman: string;
	playbackRate: number;
}

export interface Position {
	x: {
		start: number;
		end: number;
	};
	y: {
		start: number;
		end: number;
	};
}

export type StretchOptions = 'exactfit' | 'fill' | 'none' | 'uniform';
