// @ts-nocheck
import SubtitlesOctopus from '../../public/js/octopus/subtitles-octopus';

import Plugin from '../plugin';
import { NMPlayer } from '../index.d';

export class OctopusPlugin extends Plugin {
	player: any;

	initialize(player: NMPlayer): void {
		this.player = player;
		// Initialize the plugin with the player
	}

	use(): void {
		this.player.on('item', this.destroy.bind(this));
		this.player.on('captionsChanged', this.opus.bind(this));
	}

	dispose(): void {
		this.player.off('item', this.destroy.bind(this));
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
				lossyRender: true,
				accessToken: this.player.options.accessToken,
				subUrl: subtitleURL,
				debug: this.player.options.debug,
				blendRender: true,
				lazyFileLoading: true,
				targetFps: 24,
				fonts: fontFiles,
				workerUrl: '/js/octopus/subtitles-octopus-worker.js',
				legacyWorkerUrl: '/js/octopus/subtitles-octopus-worker-legacy.js',
				onReady: async () => {
					// this.player.play();
				},
				onError: (event: any) => {
					console.error('opus error', event);
				},
			};

			if (subtitleURL && subtitleURL.includes('.ass')) {
				this.player.octopusInstance = new SubtitlesOctopus(options);
			}
		}
	};
}

export default OctopusPlugin;
