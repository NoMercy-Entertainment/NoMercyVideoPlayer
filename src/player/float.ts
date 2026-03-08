import type { NMPlayer } from '../types';

export const floatMethods = {
	float(this: NMPlayer, value?: boolean): boolean | void {
		if (value === undefined)
			return this.shouldFloat;

		if (value === this.shouldFloat)
			return;

		this.shouldFloat = value;

		this.emit('float', value);
	},

	_initFloatObserver(this: NMPlayer): void {
		this.container.classList.add('not-floating');

		const floatConfig = this.options.float;
		if (!floatConfig)
			return;

		if (this.isMobile())
			return;

		this._floatObserver = new IntersectionObserver(
			([entry]) => {
				const isVisible = entry.isIntersecting;
				if (!isVisible && !this.shouldFloat && this.isPlaying) {
					this.float(true);
				}
				else if (isVisible && this.shouldFloat) {
					this.float(false);
				}
			},
			{ threshold: 0.5 },
		);

		this._floatObserver.observe(this.container);
	},

	_destroyFloatObserver(this: NMPlayer): void {
		this._floatObserver?.disconnect();
		this._floatObserver = undefined;
	},
};
