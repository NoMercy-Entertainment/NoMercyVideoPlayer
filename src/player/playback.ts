import type { NMPlayer } from '../types';

export const playbackMethods = {
	play(this: NMPlayer): Promise<void> {
		this.options.autoPlay = true;
		this.mediaSession?.setPlaybackState('playing');

		return this.videoElement.play();
	},

	pause(this: NMPlayer): void {
		this.mediaSession?.setPlaybackState('paused');

		return this.videoElement.pause();
	},

	togglePlayback(this: NMPlayer): void {
		if (this.videoElement.paused) {
			this.play().catch((err) => {
				this.logger.verbose('Play rejected', { reason: String(err) });
			});
		}
		else {
			this.pause();
		}
	},

	stop(this: NMPlayer): void {
		this.videoElement.pause();
		this.videoElement.currentTime = 0;
		this.mediaSession?.setPlaybackState('none');
	},

	seek(this: NMPlayer, arg: number): number {
		if (!Number.isFinite(arg)) {
			this.logger.warn('seek() received non-finite value', { arg });
			return this.videoElement.currentTime;
		}

		const duration = this.videoElement.duration;
		if (Number.isFinite(duration)) {
			arg = Math.max(0, Math.min(arg, duration));
		}

		this.lastTime = 0;

		this.emit('seek');

		this.videoElement.currentTime = arg;

		setTimeout(() => {
			this.emit('seeked');
		}, 10);

		return this.videoElement.currentTime;
	},

	restart(this: NMPlayer): void {
		this.seek(0);
		this.play().catch((err) => {
			this.logger.verbose('Play rejected', { reason: String(err) });
		});
	},

	seekByPercentage(this: NMPlayer, arg: number): number {
		if (!Number.isFinite(arg)) {
			this.logger.warn('seekByPercentage() received non-finite value', { arg });
			return this.videoElement.currentTime;
		}
		const pct = Math.max(0, Math.min(arg, 100));
		const duration = this.videoElement.duration;
		if (!Number.isFinite(duration) || duration === 0) {
			this.logger.warn('seekByPercentage() called before duration is available');
			return this.videoElement.currentTime;
		}
		return this.seek(duration * pct / 100);
	},

	/**
	 * Rewinds the video by a specified time interval.
	 * @param time - The time interval to rewind the video by. Defaults to 10 seconds if not provided.
	 */
	rewind(this: NMPlayer, time?: number): void {
		time = time ?? this.seekInterval ?? 10;
		this.emit('remove-forward');
		this.forwardCount = 0;
		clearTimeout(this.leftTap);
		this.rewindCount += time;
		this.emit('rewind', this.rewindCount);
		this.leftTap = setTimeout(() => {
			this.emit('remove-rewind');
			if (!this.options.disableAutoPlayback) {
				this.seek(this.currentTime() - this.rewindCount);
			}
			this.rewindCount = 0;
		}, this.leeway);
	},

	/**
	 * Forwards the video by the specified time interval.
	 * @param time - The time interval to forward the video by, in seconds. Defaults to 10 seconds if not provided.
	 */
	forward(this: NMPlayer, time?: number): void {
		time = time ?? this.seekInterval ?? 10;
		this.emit('remove-rewind');
		this.rewindCount = 0;
		clearTimeout(this.rightTap);
		this.forwardCount += time;
		this.emit('forward', this.forwardCount);
		this.rightTap = setTimeout(() => {
			this.emit('remove-forward');
			if (!this.options.disableAutoPlayback) {
				this.seek(this.currentTime() + this.forwardCount);
			}
			this.forwardCount = 0;
		}, this.leeway);
	},

	/**
	 * Returns the current playback speed of the player.
	 * @returns The current playback speed of the player.
	 */
	speed(this: NMPlayer, value?: number): number | void {
		if (value === undefined)
			return this.videoElement.playbackRate;
		if (!Number.isFinite(value) || value <= 0) {
			this.logger.warn('speed() requires a positive finite number', { value });
			return;
		}
		this.videoElement.playbackRate = value;
		this.emit('speed', value);
	},

	/**
	 * @returns An array of available playback speeds.
	 */
	speeds(this: NMPlayer): number[] {
		return this.options.playbackRates ?? [];
	},

	/**
	 * Checks if the player has multiple speeds.
	 * @returns {boolean} True if the player has multiple speeds, false otherwise.
	 */
	hasSpeeds(this: NMPlayer): boolean {
		const speeds = this.speeds();
		return speeds !== undefined && speeds.length > 1;
	},
};
