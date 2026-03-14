import type { PlaylistItem, StretchOptions } from './data';
import type { FloatConfig } from './float';
import type { PipConfig } from './pip';
import type { TheaterConfig } from './theater';
import type { LogConfig } from '../player/logger';

export type { LogConfig, LogHandler, LogLevel } from '../player/logger';

export interface PlayerConfig<T = Record<string, any>> {
	chapters?: boolean;
	playlist: string | (PlaylistItem & T)[];
	debug?: boolean;
	log?: LogConfig;
	muted?: boolean;
	controls?: boolean;
	autoPlay?: boolean;
	preload?: 'auto' | 'metadata' | 'none';
	stretching?: StretchOptions;
	playbackRates?: number[];
	accessToken?: string | (() => string);
	basePath?: string;
	imageBasePath?: string;
	language?: string;
	/**
	 * Custom translations. Accepts either:
	 * - `string[]` — URL patterns (supports `{lang}` placeholder) for additional JSON locale files to fetch.
	 * - `Record<string, string>` — inline key-value overrides merged directly into the translations dictionary.
	 */
	translations?: string[] | Record<string, string>;
	doubleClickDelay?: number;
	controlsTimeout?: number;
	displayLanguage?: string;
	disableControls?: boolean;
	disableTouchControls?: boolean;
	disableMediaControls?: boolean;
	customStorage?: StorageInterface;
	disableAutoPlayback?: boolean;
	messagePlugin?: boolean;
	disableHls?: boolean;
	forceHls?: boolean;
	float?: boolean | FloatConfig;
	pip?: boolean | PipConfig;
	theater?: boolean | TheaterConfig;
}

export interface StorageInterface {
	get: (key: string) => Promise<string | null>;
	set: (key: string, value: string) => Promise<void>;
	remove: (key: string) => Promise<void>;
}
