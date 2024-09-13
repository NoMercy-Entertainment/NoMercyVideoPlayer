import subtitlesOctopus from '../../public/js/octopus/subtitles-octopus';

import Plugin from '../Plugin';
import { NMPlayer } from '../index';

export class OctopusPlugin extends Plugin {
	player: any;

	initialize(player: NMPlayer) {
		this.player = player;
		// Initialize the plugin with the player
	}

	use() {
		this.player.on('item', this.destroy.bind(this));
		this.player.on('captionsChanged', this.opus.bind(this));
	}

	destroy() {
		this.player.octopusInstance?.dispose();
		this.player.octopusInstance = null;
	}

	async opus() {
		this.player.octopusInstance?.dispose();
		this.player.octopusInstance = null;

		const subtitleURL = this.player.getSubtitleFile() ?? null;

		const tag = subtitleURL?.match(/\w+\.\w+\.\w+$/u)?.[0];
		let [,, ext] = tag ? tag.split('.') : [];
		if (!ext) {
			const parts = subtitleURL.split('.');
			ext = parts.at(-1);
		}
		if (ext != 'ass' && ext != 'ssa') return;

		if (subtitleURL) {
			await this.player.fetchFontFile();

			const fontFiles: string[] = this.player.fonts
				?.map((f: any) => `${this.player.options.basePath ?? ''}${f.file}${this.player.options.accessToken ? `?token=${this.player.options.accessToken}` : ''}`);

			(this.player.getElement()
				.querySelectorAll('.libassjs-canvas-parent') as NodeListOf<HTMLDivElement>)
				.forEach(el => el.remove());

			try {
				this.player.octopusInstance.dispose();
			} catch (error) {
				//
			}

			const options = {
				video: this.player.getVideoElement(),
				lossyRender: true,
				subUrl: `${subtitleURL}${this.player.options.accessToken ? `?token=${this.player.options.accessToken}` : ''}`,
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
				this.player.octopusInstance = new subtitlesOctopus(options);
			}
		}
	};
}
