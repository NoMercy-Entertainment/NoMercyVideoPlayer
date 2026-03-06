import type { NMPlayer } from '../types';

export const volumeMethods = {
	volume(this: NMPlayer, value?: number): number | void {
		if (value === undefined)
			return Math.floor(this.videoElement.volume * 100);
		if (value < 0)
			value = 0;
		if (value > 100)
			value = 100;
		let vol = value / 100;
		if (vol > 1)
			vol = 1;
		if (vol < 0)
			vol = 0;
		this.videoElement.volume = vol;
		this.muted(false);
		this.storage.set('volume', this.videoElement.volume * 100).catch(() => {});
	},

	muted(this: NMPlayer, value?: boolean): boolean | void {
		if (value === undefined)
			return this.videoElement.muted;
		this.videoElement.muted = value;
	},

	toggleMute(this: NMPlayer): void {
		this.muted(!this.videoElement.muted);

		this.storage.set('muted', this.videoElement.muted).catch(() => {});

		if (this.videoElement.muted) {
			this.displayMessage(this.localize('Muted'));
		}
		else {
			this.displayMessage(`${this.localize('Volume')}: ${this.volume()}%`);
		}
	},

	/**
	 * Increases the volume of the player by 10 units, up to a maximum of 100.
	 */
	volumeUp(this: NMPlayer): void {
		if (this.volume() === 100) {
			this.volume(100);
			this.displayMessage(`${this.localize('Volume')}: 100%`);
		}
		else {
			this.volume(this.volume() + 10);
			this.displayMessage(`${this.localize('Volume')}: ${this.volume()}%`);
		}
	},

	/**
	 * Decreases the volume of the player by 10 units. If the volume is already at 0, the player is muted.
	 */
	volumeDown(this: NMPlayer): void {
		if (this.volume() === 0) {
			this.muted(true);
			this.displayMessage(`${this.localize('Volume')}: ${this.volume()}%`);
		}
		else {
			this.muted(false);
			this.volume(this.volume() - 10);
			this.displayMessage(`${this.localize('Volume')}: ${this.volume()}%`);
		}
	},

	gain(this: NMPlayer, value?: number): { min: number; max: number; defaultValue: number; value: number } | undefined | void {
		if (value === undefined) {
			if (!this.gainNode) {
				this.logger.warn('gain() called before addGainNode()');
				return undefined;
			}
			return {
				value: this.gainNode.gain.value,
				min: this.gainNode.gain.minValue,
				max: this.gainNode.gain.maxValue,
				defaultValue: this.gainNode.gain.defaultValue,
			};
		}
		if (!this.gainNode) {
			this.logger.warn('gain() called before addGainNode()');
			return;
		}
		if (!Number.isFinite(value)) {
			this.logger.warn('gain() requires a finite number', { value });
			return;
		}
		this.gainNode.gain.value = value;
		this.emit('gain', this.gain());
	},
};
