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
	resizeObserver: ResizeObserver;

	initialize(player: NMPlayer<OctopusPluginArgs>): void {
		this.player = player;
	}

	use(): void {
		this.player.on('captionsChanged', this.opus.bind(this));

		this.resizeObserver = new ResizeObserver(() => {
			this.resize();
		});
		this.resizeObserver.observe(this.player.container);
	}

	dispose(): void {
		this.player.off('captionsChanged', this.opus.bind(this));
		this.resizeObserver?.disconnect();

		this.destroy();
	}

	destroy(): void {
        try {
            this.player.octopusInstance?.worker.terminate();
            if (this.player.octopusInstance.canvasParent) {
                this.player.octopusInstance?.dispose();
            }
            this.player.octopusInstance = null;
        } catch (e) {
            //
        }
	}

	async opus(): Promise<void> {
        this.dispose();

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
				?.map((f: any) => encodeURI(`${this.player.options.basePath ?? ''}${f.file}`));

			(this.player.getElement()
				.querySelectorAll('.libassjs-canvas-parent') as NodeListOf<HTMLDivElement>)
				.forEach(el => el.remove());

			const options = {
				video: this.player.getVideoElement(),
				subUrl: encodeURI(subtitleURL),
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
				},
				onError: (event: any) => {
					console.error('opus error', event);
				},
			};

			if (subtitleURL && subtitleURL.includes('.ass')) {
                this.player.octopusInstance?.worker.terminate();
                this.player.octopusInstance = new SubtitlesOctopus(options);
			}
		}
	};

	resize() {
		if(!this.player?.octopusInstance?.canvasParent || !this.subtitleOverlay) return;
		this.player.octopusInstance.canvasParent.style.width = this.subtitleOverlay.style.width;
		this.player.octopusInstance.canvasParent.style.height = this.subtitleOverlay.style.height;
		this.player.octopusInstance.canvasParent.style.position = this.subtitleOverlay.style.position;
		this.player.octopusInstance.canvasParent.style.top = this.subtitleOverlay.style.top;
		this.player.octopusInstance.canvasParent.style.left = this.subtitleOverlay.style.left;
		this.player.octopusInstance.canvasParent.style.transform = this.subtitleOverlay.style.transform;
	}
}

export default OctopusPlugin;
