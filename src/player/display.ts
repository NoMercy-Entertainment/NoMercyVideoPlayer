import type { NMPlayer, PlayState, Stretching, TimeData, Track } from '../types';
import { humanTime } from './utils';

export const displayMethods = {
	fullscreen(this: NMPlayer, value?: boolean): boolean | void {
		if (value === undefined)
			return document.fullscreenElement === this.container;
		if (value)
			this.enterFullscreen();
		else this.exitFullscreen();
	},

	/**
	 * Enters fullscreen mode for the player.
	 */
	enterFullscreen(this: NMPlayer): void {
		let isActive = true;
		try {
			isActive = navigator.userActivation?.isActive ?? true;
		}
		catch {
			// navigator.userActivation not available in older browsers
		}
		if (isActive) {
			this.container.requestFullscreen().then(() => {
				this.emit('fullscreen', this.fullscreen());
			}).catch((err) => {
				this.displayMessage(this.localize('Fullscreen not supported'));
				this.logger.warn('Fullscreen not available', { message: err.message });
			});
		}
	},

	/**
	 * Exits fullscreen mode for the player.
	 */
	exitFullscreen(this: NMPlayer): void {
		document.exitFullscreen().then(() => {
			this.emit('fullscreen', this.fullscreen());
		}).catch((err) => {
			this.logger.warn('Fullscreen exit failed', { message: err.message });
		});
	},

	/**
	 * Toggles the fullscreen mode of the player.
	 * If the player is currently in fullscreen mode, it exits fullscreen mode.
	 * If the player is not in fullscreen mode, it enters fullscreen mode.
	 */
	toggleFullscreen(this: NMPlayer): void {
		if (this.fullscreen()) {
			this.exitFullscreen();
		}
		else {
			this.enterFullscreen();
		}
	},

	/**
	 * Returns the current aspect ratio of the player.
	 * If the player is a JWPlayer, it returns the current stretching mode.
	 * Otherwise, it returns the current aspect ratio.
	 * @returns The current aspect ratio of the player.
	 */
	aspect(this: NMPlayer, value?: Stretching): string | void {
		if (value === undefined)
			return this.currentAspectRatio;
		this.setAspect(value);
	},

	/**
	 * Sets the aspect ratio of the player.
	 * @param aspect - The aspect ratio to set.
	 */
	setAspect(this: NMPlayer, aspect: Stretching): void {
		const videoPlayerContainer = this.container.style;
		const videoOverlay = this.overlay.style;
		const videoElementStyle = this.videoElement.style;
		const subtitleOverlayStyle = this.subtitleOverlay.style;

		this.currentAspectRatio = aspect;

		videoPlayerContainer.paddingTop = '';
		videoPlayerContainer.position = '';
		videoPlayerContainer.aspectRatio = '';
		videoElementStyle.position = '';
		videoElementStyle.top = '';
		videoElementStyle.left = '';
		videoElementStyle.width = '';
		videoElementStyle.transform = '';
		videoOverlay.height = '';
		subtitleOverlayStyle.height = '';

		switch (aspect) {
			case 'fill':
				videoElementStyle.objectFit = 'fill';
				break;
			case 'uniform':
				videoElementStyle.objectFit = 'contain';
				break;
			case 'exactfit':
				videoElementStyle.objectFit = 'cover';
				break;
			case '16:9':
				videoPlayerContainer.aspectRatio = '16/9';
				videoElementStyle.objectFit = 'contain';
				break;
			case '4:3':
				videoPlayerContainer.aspectRatio = '4/3';
				videoElementStyle.objectFit = 'contain';
				break;
			case 'none':
				videoElementStyle.objectFit = 'none';
				break;
		}

		this.displayMessage(`${this.localize('Aspect ratio')}: ${this.localize(aspect)}`);
	},

	/**
	 * Cycles through the available aspect ratio options and sets the current aspect ratio to the next one.
	 */
	cycleAspectRatio(this: NMPlayer): void {
		const index = this.stretchOptions.findIndex((s: string) => s === this.aspect());
		if (index === this.stretchOptions.length - 1) {
			this.aspect(this.stretchOptions[0]);
		}
		else {
			this.aspect(this.stretchOptions[index + 1]);
		}
	},

	setAllowFullscreen(this: NMPlayer, allowFullscreen: boolean): void {
		this.allowFullscreen = allowFullscreen;
	},

	resize(this: NMPlayer): void {
		const videoWidth = this.videoElement.videoWidth;
		const videoHeight = this.videoElement.videoHeight;
		const videoAspectRatio = videoWidth / videoHeight;

		this.setResponsiveAspectRatio(videoAspectRatio);

		const containerWidth = this.container.clientWidth;
		const containerHeight = this.container.clientHeight;
		const containerAspectRatio = containerWidth / containerHeight;

		let newWidth: number | string;
		let newHeight: number | string;

		if (videoAspectRatio > containerAspectRatio) {
			newWidth = containerWidth;
			newHeight = containerWidth / videoAspectRatio;
		}
		else {
			newHeight = containerHeight;
			newWidth = containerHeight * videoAspectRatio;
		}

		if (Number.isNaN(newWidth) || Number.isNaN(newHeight) || newWidth === 0 || newHeight === 0) {
			newWidth = '100%';
			newHeight = '100%';
		}

		this.videoElement.style.width = `${newWidth}px`;
		this.videoElement.style.height = `${newHeight}px`;

		this.videoElement.style.position = 'absolute';
		this.videoElement.style.top = '50%';
		this.videoElement.style.left = '50%';
		this.videoElement.style.transform = 'translate(-50%, -50%)';

		if (this.subtitleOverlay) {
			this.subtitleOverlay.style.width = `${newWidth}px`;
			this.subtitleOverlay.style.height = `${newHeight}px`;
			this.subtitleOverlay.style.position = 'absolute';
		}

		const ratio = videoAspectRatio;
		this.videoElement.width = videoWidth;
		this.videoElement.height = videoHeight;
		this.videoElement.style.setProperty('--aspect-ratio', `${Number.isNaN(ratio) ? 'auto' : ratio}`);
	},

	setResponsiveAspectRatio(this: NMPlayer, videoAspectRatio: number): void {
		let containerAspectRatio: string;

		if (videoAspectRatio <= 1.4) {
			containerAspectRatio = '4/3';
		}
		else if (videoAspectRatio <= 1.9) {
			containerAspectRatio = '16/9';
		}
		else if (videoAspectRatio <= 2.5) {
			containerAspectRatio = '21/9';
		}
		else {
			containerAspectRatio = '32/9';
		}

		this.container.style.aspectRatio = containerAspectRatio;
	},

	width(this: NMPlayer): number {
		return this.videoElement.getBoundingClientRect().width;
	},

	height(this: NMPlayer): number {
		return this.videoElement.getBoundingClientRect().height;
	},

	/**
	 * Returns the HTMLDivElement element with the specified player ID.
	 * @returns The HTMLDivElement element with the specified player ID.
	 */
	element(this: NMPlayer): HTMLDivElement {
		return this.container;
	},

	state(this: NMPlayer): PlayState {
		if (this.videoElement.readyState < 3 && !this.videoElement.paused)
			return 'buffering';
		if (this.videoElement.paused)
			return 'paused';
		return 'playing';
	},

	currentTime(this: NMPlayer): number {
		return this.videoElement.currentTime;
	},

	duration(this: NMPlayer): number {
		return this.videoElement.duration;
	},

	buffer(this: NMPlayer): TimeRanges {
		return this.videoElement.buffered;
	},

	/**
	 * Returns the current source URL of the player.
	 * If the player is a JWPlayer, it returns the file URL of the current playlist item.
	 * Otherwise, it returns the URL of the first source in the current playlist item.
	 * @returns The current source URL of the player, or undefined if there is no current source.
	 */
	currentSrc(this: NMPlayer): string {
		return this.playlistItem()?.file ?? '';
	},

	timeData(this: NMPlayer): TimeData {
		return {
			currentTime: this.videoElement.currentTime,
			duration: this.videoElement.duration,
			percentage: (this.videoElement.currentTime / this.videoElement.duration) * 100,
			remaining: this.videoElement.duration - this.videoElement.currentTime,
			currentTimeHuman: humanTime(this.videoElement.currentTime),
			durationHuman: humanTime(this.videoElement.duration),
			remainingHuman: humanTime(this.videoElement.duration - this.videoElement.currentTime),
			playbackRate: this.videoElement.playbackRate,
		};
	},

	hasPIP(this: NMPlayer): boolean {
		return this.hasPipEventHandler;
	},

	setFloatingPlayer(this: NMPlayer, shouldFloat: boolean): void {
		if (this.isMobile()) {
			this.shouldFloat = false;
			return;
		}

		this.shouldFloat = shouldFloat;
	},

	// File getters (renamed from get* pattern)
	/**
	 * Returns the file associated with the thumbnail of the current playlist item.
	 * @returns The file associated with the thumbnail of the current playlist item, or undefined if no thumbnail is found.
	 */
	timeFile(this: NMPlayer): string | undefined {
		return this.playlistItem()?.tracks?.find((t: Track) => t.kind === 'thumbnails')?.file;
	},

	/**
	 * Returns the file associated with the sprite metadata of the current playlist item.
	 * @returns The sprite file, or undefined if no sprite metadata is found.
	 */
	spriteFile(this: NMPlayer): string | undefined {
		return this.playlistItem()?.tracks?.find((t: Track) => t.kind === 'sprite')?.file;
	},
};
