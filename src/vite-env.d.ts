// / <reference types="vite/client" />

import nmplayer from "./index";

declare module '*.scss';
declare module '*.jpg';
declare module '*.webp';
declare module '*.svg';
declare module '*.png';
declare module '*.gif';
declare module 'opentype.js/dist/opentype.min.js';

declare global {
	interface Window {
		octopusInstance: any;
		Hls: import('hls.js');
		gainNode: GainNode;
		nmplayer: <Conf extends Partial<PlayerConfig>>(id?: string) => NMPlayer<Conf>;
	}

	interface Navigator {
		deviceMemory: number;
	}

	interface Date {
		format: any;
	}

	interface String {
		capitalize: () => string;
		toPascalCase: (string) => string;
		titleCase: (lang: string, withLowers: boolean) => string;
		toTitleCase: (lang?: string) => string;

	}
}

declare let window: Window;
declare let navigator: Navigator;
