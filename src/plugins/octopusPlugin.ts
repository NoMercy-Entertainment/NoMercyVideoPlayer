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
	private boundOpus!: () => Promise<void>;
	private currentLoadedUrl: string | null = null;

	constructor(options: OctopusPluginOptions = {}) {
		super();
		this.pluginOptions = options;
	}

	initialize(player: NMPlayer): void {
		this.player = player;
	}

	use(): void {
		this.boundOpus = this.opus.bind(this);
		this.player.on('subtitleChanged', this.boundOpus);

		this.resizeObserver = new ResizeObserver(() => {
			this.resize();
		});
		this.resizeObserver.observe(this.player.container);

		// If a subtitle is already active when the plugin is activated,
		// trigger opus() immediately (handles late registration after setup()).
		if (this.player.subtitleFile()) {
			this.opus();
		}
	}

	dispose(): void {
		this.player.off('subtitleChanged', this.boundOpus);
		this.resizeObserver?.disconnect();

		this.destroy();
	}

	destroy(): void {
		this.currentLoadedUrl = null;
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
		const subtitleURL = this.player.subtitleFile()
			? `${this.player.options.basePath ?? ''}${this.player.subtitleFile()}`
			: null;

		// No subtitle selected — tear down any active instance
		if (!subtitleURL) {
			if (this.currentLoadedUrl) {
				this.destroy();
			}
			return;
		}

		// Same subtitle already loaded (or currently loading) — skip
		if (subtitleURL === this.currentLoadedUrl) {
			return;
		}

		const tag = subtitleURL.match(/\w+\.\w+\.\w+$/u)?.[0];
		let [,, ext] = tag ? tag.split('.') : [];
		if (!ext) {
			const parts = subtitleURL.split('.');
			ext = parts.at(-1) || '';
		}

		if (ext !== 'ass' && ext !== 'ssa') {
			if (this.currentLoadedUrl) {
				this.destroy();
			}
			return;
		}

		// Different ASS/SSA subtitle — tear down old instance and load new one
		this.destroy();
		this.currentLoadedUrl = subtitleURL;

		try {
			this.player.logger.debug('OctopusPlugin: loading ASS subtitle', { url: subtitleURL });

			await this.player.fetchFontFile();

			// Guard against race: if another opus() call changed the URL while we awaited
			if (this.currentLoadedUrl !== subtitleURL) {
				return;
			}

			const fontFiles: string[] = this.player.fonts
				?.map(f => encodeURI(`${this.player.options.basePath ?? ''}${f.file}`));

			(this.player.element()
				.querySelectorAll('.libassjs-canvas-parent') as NodeListOf<HTMLDivElement>)
				.forEach(el => el.remove());

			this.player.octopusInstance = new SubtitlesOctopus({
				video: this.player.videoElement,
				subUrl: encodeURI(subtitleURL),
				fonts: fontFiles,
				lossyRender: this.pluginOptions.lossyRender,
				accessToken: this.player.getAccessToken(),
				targetFps: this.pluginOptions.targetFps,
				debug: this.player.options.debug,
				blendRender: this.pluginOptions.blendRender,
				lazyFileLoading: this.pluginOptions.lazyFileLoading,
				renderAhead: this.pluginOptions.renderAhead,
				workerUrl: this.pluginOptions.workerUrl ?? `${OCTOPUS_CDN_BASE}/subtitles-octopus-worker.js`,
				legacyWorkerUrl: this.pluginOptions.legacyWorkerUrl ?? `${OCTOPUS_CDN_BASE}/subtitles-octopus-worker-legacy.js`,
				fallbackFont: this.pluginOptions.fallbackFont ?? `${OCTOPUS_CDN_BASE}/default.ttf`,
				onReady: () => {
					this.player.logger.debug('OctopusPlugin: SubtitlesOctopus ready');
				},
				onError: (event: unknown) => {
					this.player.logger.error('OctopusPlugin: SubtitlesOctopus error', { event });
				},
			});

			this.player.logger.debug('OctopusPlugin: SubtitlesOctopus instance created');
		}
		catch (error) {
			this.player.logger.error('OctopusPlugin: failed to initialize', { error: String(error) });
			this.currentLoadedUrl = null;
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
