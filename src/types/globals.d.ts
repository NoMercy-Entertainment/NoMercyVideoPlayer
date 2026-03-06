import type { PlayerConfig } from './config';
import type { NMPlayer } from './player';

declare global {
	interface Window {
		octopusInstance: any;
		Hls: typeof import('hls.js');
		gainNode: GainNode;
		nmplayer: <Conf extends Partial<PlayerConfig<any>>>(id?: string) => NMPlayer<Conf>;
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
