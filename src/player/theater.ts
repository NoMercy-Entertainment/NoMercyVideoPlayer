import type { NMPlayer } from '../types';

export const theaterMethods = {
	theater(this: NMPlayer, value?: boolean): boolean | void {
		if (value === undefined)
			return this._theaterMode;

		if (value === this._theaterMode)
			return;

		this._theaterMode = value;

		if (value) {
			this.container.classList.remove('not-theater');
			this.container.classList.add('theater');
		}
		else {
			this.container.classList.remove('theater');
			this.container.classList.add('not-theater');
		}

		this.storage.set('theater', value).catch(() => {});
		this.emit('theater', value);
	},

	_destroyTheater(this: NMPlayer): void {
		// No persistent listeners to clean up; included for init/dispose lifecycle symmetry.
	},

	_initTheater(this: NMPlayer): void {
		const theaterConfig = this.options.theater;
		if (!theaterConfig)
			return;

		this.storage.get<boolean>('theater', false).then((val) => {
			if (val) {
				this.theater(true);
			}
		});
	},
};
