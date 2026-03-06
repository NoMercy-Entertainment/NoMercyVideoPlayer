import SubtitlesOctopus from '../../public/js/octopus/subtitles-octopus';

import Plugin from './plugin';
import type { NMPlayer } from '../types';

const OCTOPUS_CDN_BASE = 'https://cdn.jsdelivr.net/npm/@nomercy-entertainment/nomercy-video-player@latest/public/js/octopus';

export interface OctopusPluginOptions {
	workerUrl?: string;
	legacyWorkerUrl?: string;
	fallbackFont?: string;
	targetFps?: number;
	blendRender?: boolean;
	lazyFileLoading?: boolean;
	renderAhead?: number;
	lossyRender?: boolean;
}

export class OctopusPlugin extends Plugin {
	declare player: NMPlayer;
	resizeObserver!: ResizeObserver;
	private pluginOptions: OctopusPluginOptions;

	constructor(options: OctopusPluginOptions = {}) {
		super();
		this.pluginOptions = options;
	}

	initialize(player: NMPlayer): void {
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
			this.player.octopusInstance?.worker?.terminate();
			if (this.player.octopusInstance?.canvasParent) {
				this.player.octopusInstance.dispose();
			}
			this.player.octopusInstance = null;
		}
		catch {
			//
		}
	}

	async opus(): Promise<void> {
		this.dispose();

		const subtitleURL = this.player.getSubtitleFile() ? `${this.player.options.basePath ?? ''}${this.player.getSubtitleFile()}` : null;
		if (!subtitleURL)
			return;

		const tag = subtitleURL?.match(/\w+\.\w+\.\w+$/u)?.[0];
		let [,, ext] = tag ? tag.split('.') : [];
		if (!ext) {
			const parts = subtitleURL.split('.');
			ext = parts.at(-1) || '';
		}

		if (ext !== 'ass' && ext !== 'ssa')
			return;

		if (subtitleURL) {
			await this.player.fetchFontFile();

			const fontFiles: string[] = this.player.fonts
				?.map(f => encodeURI(`${this.player.options.basePath ?? ''}${f.file}`));

			(this.player.element()
				.querySelectorAll('.libassjs-canvas-parent') as NodeListOf<HTMLDivElement>)
				.forEach(el => el.remove());

			const options = {
				video: this.player.videoElement,
				subUrl: encodeURI(subtitleURL),
				fonts: fontFiles,
				lossyRender: this.pluginOptions.lossyRender,
				accessToken: this.player.options.accessToken,
				targetFps: this.pluginOptions.targetFps,
				debug: this.player.options.debug,
				blendRender: this.pluginOptions.blendRender,
				lazyFileLoading: this.pluginOptions.lazyFileLoading,
				renderAhead: this.pluginOptions.renderAhead,
				workerUrl: this.pluginOptions.workerUrl ?? `${OCTOPUS_CDN_BASE}/subtitles-octopus-worker.js`,
				legacyWorkerUrl: this.pluginOptions.legacyWorkerUrl ?? `${OCTOPUS_CDN_BASE}/subtitles-octopus-worker-legacy.js`,
				fallbackFont: this.pluginOptions.fallbackFont ?? `${OCTOPUS_CDN_BASE}/default.ttf`,
				onReady: async () => {
				},
				onError: (event: unknown) => {
					console.error('opus error', event);
				},
			};

			if (subtitleURL && subtitleURL.includes('.ass')) {
				this.player.octopusInstance?.worker?.terminate();
				this.player.octopusInstance = new SubtitlesOctopus(options);
			}
		}
	}

	resize(): void {
		if (!this.player?.octopusInstance?.canvasParent || !this.player.subtitleOverlay)
			return;
		this.player.octopusInstance.canvasParent.style.width = this.player.subtitleOverlay.style.width;
		this.player.octopusInstance.canvasParent.style.height = this.player.subtitleOverlay.style.height;
		this.player.octopusInstance.canvasParent.style.position = this.player.subtitleOverlay.style.position;
		this.player.octopusInstance.canvasParent.style.top = this.player.subtitleOverlay.style.top;
		this.player.octopusInstance.canvasParent.style.left = this.player.subtitleOverlay.style.left;
		this.player.octopusInstance.canvasParent.style.transform = this.player.subtitleOverlay.style.transform;
	}
}

export default OctopusPlugin;
