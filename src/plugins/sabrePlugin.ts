
import Plugin from '../plugin';
import { NMPlayer } from '../index.d';

export class SabrePlugin extends Plugin {
	player: NMPlayer = <NMPlayer>{};
	frameCallbackHandle: number | null = null;

	initialize(player: NMPlayer) {
		this.player = player;
		// Initialize the plugin with the player
		this.player.appendScriptFilesToDocument([
			'https://storage.nomercy.tv/laravel/player/js/sabre/cptable.js',
			'https://storage.nomercy.tv/laravel/player/js/sabre/cputils.js',
			'https://storage.nomercy.tv/laravel/player/js/sabre/opentype.min.js',
			'https://storage.nomercy.tv/laravel/player/js/sabre/sabre.min.js',
		]);
	}

	use() {
		this.player.on('item', this.sabre.bind(this));
		this.player.on('captionsChanged', this.sabre.bind(this));
	}

	dispose() {
		this.player.off('item', this.sabre.bind(this));
		this.player.off('captionsChanged', this.sabre.bind(this));

		this.destroy();
	}

	destroy() {
		if (this.frameCallbackHandle) {
			this.player.getVideoElement().cancelVideoFrameCallback(this.frameCallbackHandle);
			this.frameCallbackHandle = null;
		}
		const sabreContainer = this.player.getElement().querySelector('.sabre-canvas-container');
		if (sabreContainer) {
			sabreContainer.remove();
		}
	}

	async sabre() {
		if (this.frameCallbackHandle) {
			this.player.getVideoElement().cancelVideoFrameCallback(this.frameCallbackHandle);
			this.frameCallbackHandle = null;
		}

		await this.player.fetchFontFile();

		await new Promise<void>((resolve) => {
			function waitForLoad(): void {
				if (window.sabre) {
					resolve();
					return;
				}
				setTimeout(waitForLoad, 30);
			}

			waitForLoad();
		});

		const sabreContainer = this.player.createElement('div', 'sabre-canvas-container', true)
			.addClasses([
				'absolute',
				'inset-0',
				'pointer-events-none',
				'w-full',
				'h-full',
				'z-10',
			])
			.prependTo(this.player.getVideoElement().parentElement as HTMLElement);

		const video = this.player.getVideoElement();

		const sabreCanvas = this.player.createElement('canvas', 'sabre-canvas', true)
			.addClasses([
				'w-full',
				'h-full',
			])
			.get();

		let sabreRenderer: any;

		function updateCanvas(first: boolean) {
			let videoWidth: number = video.videoWidth;
			let videoHeight: number = video.videoHeight;
			const elementWidth: number = video.offsetWidth;
			const elementHeight: number = video.offsetHeight;
			const pixelRatio: number = window.devicePixelRatio || 1;

			if (!first && videoWidth === elementWidth / pixelRatio && videoHeight == elementHeight / pixelRatio) {
				sabreContainer.style.paddingLeft = `${(sabreContainer.offsetWidth - videoWidth) / 2}px`;
				sabreContainer.style.paddingTop = `${(sabreContainer.offsetHeight - videoHeight) / 2}px`;
				return;
			}

			const elementRatio: number = elementWidth / elementHeight;
			const ratioWidthHeight: number = videoWidth / videoHeight;
			const ratioHeightWidth: number = videoHeight / videoWidth;

			if (isNaN(elementRatio) || isNaN(ratioWidthHeight) || isNaN(ratioHeightWidth)) return;

			if (elementRatio <= ratioWidthHeight) {
				videoWidth = elementWidth;
				videoHeight = elementWidth * ratioHeightWidth;
			} else if (elementRatio > ratioWidthHeight) {
				videoHeight = elementHeight;
				videoWidth = elementHeight * ratioWidthHeight;
			}

			sabreCanvas.width = videoWidth * pixelRatio;
			sabreCanvas.height = videoHeight * pixelRatio;
			sabreCanvas.style.width = `${videoWidth}px`;
			sabreCanvas.style.height = `${videoHeight}px`;
			sabreRenderer.setViewport(videoWidth * pixelRatio, videoHeight * pixelRatio);
			sabreContainer.style.paddingLeft = `${(sabreContainer.offsetWidth - videoWidth) / 2}px`;
			sabreContainer.style.paddingTop = `${(sabreContainer.offsetHeight - videoHeight) / 2}px`;
		}

		const renderFrame: VideoFrameRequestCallback = (_now, metaData) => {
			updateCanvas(false);
			if (sabreRenderer.checkReadyToRender()) {
				sabreRenderer.drawFrame(metaData.mediaTime, sabreCanvas, 'bitmap');
			}
			this.frameCallbackHandle = video.requestVideoFrameCallback(renderFrame);
		};

		sabreContainer.appendChild(sabreCanvas);

		const sabre = window.sabre;

		const fonts: Array<object> = [];

		const fontFiles: string[] = this.player.fonts
			?.map((f: any) => `${this.player.options.basePath ?? ''}${f.file}${this.player.options.accessToken ? `?token=${this.player.options.accessToken}` : ''}`);

		fontFiles.push('https://storage.nomercy.tv/laravel/player/fonts/Arial.ttf');

		await Promise.all(fontFiles.map(font => this.player.getFileContents<ArrayBuffer>({
			url: font,
			options: {
				type: 'arrayBuffer',
			},
			callback: (data: any) => {
				fonts.push(window.opentype.parse(data));
			},
		})));

		const textTrackUrl = this.player.getSubtitleFile() ?? null;

		if (textTrackUrl) {
			await this.player.getFileContents<ArrayBuffer>({
				url: textTrackUrl,
				options: {
					type: 'arrayBuffer',
				},
				callback: (data: any) => {
					const options: any = {
						fonts: fonts,
						subtitles: data,
					};
					sabreRenderer = new sabre.SABRERenderer(options);
					updateCanvas(true);
					sabreRenderer.setColorSpace(1, video.videoWidth, video.videoHeight);
					this.frameCallbackHandle = video.requestVideoFrameCallback(renderFrame.bind(this.player));
				},
			});
		}
	}
}

declare global {
	interface Window {
		opentype: 'module:opentype.js';
		sabre: 'module:@sabre-js/sabre';
	}
}

export default SabrePlugin;