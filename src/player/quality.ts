import type { Level, NMPlayer } from '../types';

export const qualityMethods = {
	quality(this: NMPlayer, index?: number): number | void {
		if (index === undefined) {
			if (!this.hls)
				return -1;
			return this.hls.currentLevel;
		}

		if (!this.hls)
			return;

		const levels = this.qualityLevels();
		if (index < -1 || index >= levels.length) {
			this.logger.warn('quality() index out of bounds', { index, count: levels.length });
			return;
		}

		this.hls.nextLevel = index;
	},

	qualityLevels(this: NMPlayer): Level[] {
		if (!this.hls)
			return [];

		const levels: Level[] = this.hls.levels
			.map((level, index: number) => ({
				...level,
				id: index,
				label: level.name,
			}) as Level)
			.filter((level) => {
				const range = level._attrs.at(0)?.['VIDEO-RANGE'];
				const browserSupportsHDR = this.hdrSupported();
				if (browserSupportsHDR)
					return true;
				return range !== 'PQ';
			});

		levels.unshift({
			id: -1,
			label: 'Auto',
		} as Level);

		return levels;
	},

	/**
	 * Returns a boolean indicating whether the player has more than one quality.
	 * @returns {boolean} True if the player has more than one quality, false otherwise.
	 */
	hasQualities(this: NMPlayer): boolean {
		return this.qualityLevels().length > 1;
	},
};
