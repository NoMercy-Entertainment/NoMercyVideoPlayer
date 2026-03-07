import type { AudioTrack, NMPlayer } from '../types';

export const audioMethods = {
	audioTrack(this: NMPlayer, index?: number): AudioTrack | null | void {
		if (index === undefined) {
			if (!this.hls)
				return null;
			return this.audioTracks()[this.hls.audioTrack] ?? null;
		}
		if (!this.hls)
			return;

		// -1 means "no change" (consistent with subtitle(-1) and quality(-1))
		if (index < 0)
			return;

		// Same track already selected — no-op
		if (index === this.hls.audioTrack)
			return;

		const tracks = this.audioTracks();
		if (index >= tracks.length) {
			this.logger.warn('audioTrack() index out of bounds', { index, count: tracks.length });
			return;
		}
		this.hls.audioTrack = index;
		this.storage.set('audio-language', tracks[index]?.language ?? '').catch(() => {});
	},

	audioTracks(this: NMPlayer): AudioTrack[] {
		if (!this.hls)
			return [];
		return this.hls.audioTracks.map((playlist, index: number): AudioTrack => ({
			id: index,
			language: playlist.lang ?? '',
			label: playlist.name,
			name: playlist.name,
		}));
	},

	audioTrackIndex(this: NMPlayer): number {
		if (!this.hls)
			return -1;
		return this.hls.audioTrack;
	},

	/**
	 * Returns a boolean indicating whether there are multiple audio tracks available.
	 * @returns {boolean} True if there are multiple audio tracks, false otherwise.
	 */
	hasAudioTracks(this: NMPlayer): boolean {
		return this.audioTracks().length > 1;
	},

	/**
	 * Cycles to the next audio track in the playlist.
	 * If there are no audio tracks, this method does nothing.
	 * If the current track is the last track in the playlist, this method will cycle back to the first track.
	 * Otherwise, this method will cycle to the next track in the playlist.
	 * After cycling to the next track, this method will display a message indicating the new audio track.
	 */
	cycleAudioTracks(this: NMPlayer): void {
		if (!this.hasAudioTracks()) {
			return;
		}

		if (this.audioTrackIndex() === this.audioTracks().length - 1) {
			this.audioTrack(0);
		}
		else {
			this.audioTrack(this.audioTrackIndex() + 1);
		}

		const track = this.audioTrack();
		this.displayMessage(`${this.localize('Audio')}: ${this.localize(track?.name ?? '') || this.localize('Unknown')}`);
	},

	/**
	 * Returns the index of the audio track with the specified language.
	 * @param language The language of the audio track to search for.
	 * @returns The index of the audio track with the specified language, or -1 if no such track exists.
	 */
	audioTrackIndexByLanguage(this: NMPlayer, language: string): number {
		return this.audioTracks().findIndex(t => t.language === language);
	},

	setCurrentAudioTrackFromStorage(this: NMPlayer): void {
		if (this.options.disableAutoPlayback)
			return;
		this.storage.get('audio-language', null).then((val) => {
			if (val) {
				this.audioTrack(this.audioTrackIndexByLanguage(val));
			}
			else {
				this.audioTrack(0);
			}
		});
	},
};
