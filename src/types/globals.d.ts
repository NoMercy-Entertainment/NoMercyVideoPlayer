import type { PlayerConfig } from './config';
import type { NMPlayer } from './player';
import type { Base } from '../player/base';
import type { Logger } from '../player/logger';
import type PlayerStorage from '../player/playerStorage';
import type KeyHandlerPlugin from '../plugins/keyHandlerPlugin';
import type OctopusPlugin from '../plugins/octopusPlugin';
import type Plugin from '../plugins/plugin';

interface NMPlayerFactory {
	<Conf extends Partial<PlayerConfig<any>>>(id?: string): NMPlayer<Conf>;
	Base: typeof Base;
	Logger: typeof Logger;
	PlayerStorage: typeof PlayerStorage;
	KeyHandlerPlugin: typeof KeyHandlerPlugin;
	OctopusPlugin: typeof OctopusPlugin;
	Plugin: typeof Plugin;
}

declare global {
	interface Window {
		octopusInstance: any;
		Hls: typeof import('hls.js');
		gainNode: GainNode;
		nmplayer: NMPlayerFactory;
		WebVTTParser: typeof import('webvtt-parser').WebVTTParser;
	}

	interface Navigator {
		deviceMemory: number;
	}

	interface Date {
		format: any;
	}

	interface String {
		capitalize: () => string;
		toPascalCase: (arg: string) => string;
		titleCase: (lang: string, withLowers: boolean) => string;
		toTitleCase: (lang?: string) => string;
	}
}
