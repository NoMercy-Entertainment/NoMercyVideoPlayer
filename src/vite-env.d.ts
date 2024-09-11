// / <reference types="vite/client" />

declare module '*.scss';
declare module '*.jpg';
declare module '*.webp';
declare module '*.svg';
declare module '*.png';
declare module '*.gif';
declare module '@sabre-js/sabre';


interface Window {
	octopusInstance: any;
	Hls: import('hls.js');
	opentype: import('opentype.js');
	sabre: import('@sabre/sabre/dist/sabre.min.js');
	gainNode: GainNode;
	nmplayer: (id?: string) => NMPlayer;
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

declare let window: Window;
declare let navigator: Navigator;
