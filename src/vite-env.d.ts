/// <reference types="vite/client" />

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

}

declare let window: Window;
declare let navigator: Navigator;
