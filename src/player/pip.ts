import type { NMPlayer } from '../types';

export const pipMethods = {
	pip(this: NMPlayer, value?: boolean): boolean | void {
		if (value === undefined)
			return document.pictureInPictureElement === this.videoElement;

		if (value) {
			this.videoElement.requestPictureInPicture?.().catch((err) => {
				this.logger.warn('PIP not available', { message: err.message });
			});
		}
		else {
			document.exitPictureInPicture?.().catch((err) => {
				this.logger.warn('PIP exit failed', { message: err.message });
			});
		}
	},

	_initPipListeners(this: NMPlayer): void {
		this.container.classList.add('not-pip');

		const pipConfig = this.options.pip;
		if (!pipConfig)
			return;

		this.videoElement.addEventListener('enterpictureinpicture', () => {
			this.emit('pip', true);
		});

		this.videoElement.addEventListener('leavepictureinpicture', () => {
			this.emit('pip', false);
		});

		if (typeof pipConfig === 'object' && pipConfig.trigger === 'tab-hidden') {
			this._pipVisibilityHandler = () => {
				if (document.hidden && this.isPlaying) {
					this.pip(true);
				}
				else if (!document.hidden && this.pip()) {
					this.pip(false);
				}
			};
			document.addEventListener('visibilitychange', this._pipVisibilityHandler);
		}

		if (typeof pipConfig === 'object' && pipConfig.trigger === 'float') {
			this.on('float', (isFloating: boolean) => {
				if (isFloating) {
					this.pip(true);
				}
				else if (this.pip()) {
					this.pip(false);
				}
			});
		}
	},

	_destroyPipListeners(this: NMPlayer): void {
		if (this._pipVisibilityHandler) {
			document.removeEventListener('visibilitychange', this._pipVisibilityHandler);
			this._pipVisibilityHandler = undefined;
		}
	},
};
