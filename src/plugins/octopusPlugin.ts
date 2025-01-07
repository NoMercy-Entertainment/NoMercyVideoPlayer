// @ts-nocheck
import SubtitlesOctopus from '../../public/js/octopus/subtitles-octopus';

import Plugin from '../plugin';
import type { NMPlayer } from '../types';

export interface OctopusPluginArgs {
	accessToken: string;
	debug: boolean;
	targetFps: number,
	blendRender: boolean,
	lazyFileLoading: boolean,
	renderAhead: boolean,
}

export class OctopusPlugin extends Plugin {
	player: NMPlayer<OctopusPluginArgs>;

	initialize(player: NMPlayer<OctopusPluginArgs>): void {
		this.player = player;
		// Initialize the plugin with the player
	}

	use(): void {
		// this.player.on('item', this.destroy.bind(this));
		this.player.on('captionsChanged', this.opus.bind(this));
	}

	dispose(): void {
		// this.player.off('item', this.destroy.bind(this));
		this.player.off('captionsChanged', this.opus.bind(this));

		this.destroy();
	}

	destroy(): void {
		this.player.octopusInstance?.dispose();
		this.player.octopusInstance = null;
	}

	async opus(): void {
		this.destroy();

		const subtitleURL = this.player.getSubtitleFile() ? `${this.player.options.basePath ?? ''}${this.player.getSubtitleFile()}` : null;
		if (!subtitleURL) return;

		const tag = subtitleURL?.match(/\w+\.\w+\.\w+$/u)?.[0];
		let [,, ext] = tag ? tag.split('.') : [];
		if (!ext) {
			const parts = subtitleURL.split('.');
			ext = parts.at(-1) || '';
		}

		if (ext != 'ass' && ext != 'ssa') return;

		if (subtitleURL) {
			await this.player.fetchFontFile();

			const fontFiles: string[] = this.player.fonts
				?.map((f: any) => `${this.player.options.basePath ?? ''}${f.file}`);

			(this.player.getElement()
				.querySelectorAll('.libassjs-canvas-parent') as NodeListOf<HTMLDivElement>)
				.forEach(el => el.remove());

			const options = {
				video: this.player.getVideoElement(),
				subUrl: subtitleURL,
				fonts: fontFiles,
				lossyRender: this.player.options.lossyRender,
				accessToken: this.player.options.accessToken,
				targetFps: this.player.options.targetFps,
				debug: this.player.options.debug,
				blendRender: this.player.options.blendRender,
				lazyFileLoading: this.player.options.lazyFileLoading,
				renderAhead: this.player.options.renderAhead,
				workerUrl: '/js/octopus/subtitles-octopus-worker.js',
				legacyWorkerUrl: '/js/octopus/subtitles-octopus-worker-legacy.js',
				fallbackFont: '/js/octopus/default.ttf',
				onReady: async () => {
					// this.player.play();
				},
				onError: (event: any) => {
					console.error('opus error', event);
				},
			};

			console.log(options);

			if (subtitleURL && subtitleURL.includes('.ass')) {
				this.player.octopusInstance = new SubtitlesOctopus(options);
			}
		}
	};
}

export default OctopusPlugin;
