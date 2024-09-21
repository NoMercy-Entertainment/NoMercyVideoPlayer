// / <reference types="vite/client" />

declare module '*.scss';
declare module '*.jpg';
declare module '*.webp';
declare module '*.svg';
declare module '*.png';
declare module '*.gif';

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

declare let window: Window;
declare let navigator: Navigator;
