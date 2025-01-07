// / <reference types="vite/client" />

import {NMPlayer} from "./index";

declare module '*.scss';
declare module '*.jpg';
declare module '*.webp';
declare module '*.svg';
declare module '*.png';
declare module '*.gif';
declare module '@sabre-js/sabre';
declare module 'opentype.js/dist/opentype.min.js';

declare global {
	interface Window {
		octopusInstance: any;
		Hls: import('hls.js');
		gainNode: GainNode;
		nmplayer: (id?: string) => import('./index').NMPlayer;
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
