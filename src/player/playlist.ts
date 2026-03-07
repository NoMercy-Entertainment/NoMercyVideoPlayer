import type { NMPlayer, PlaylistItem, Track, TrackKindMap, TrackType } from '../types';
import type { VTTData } from 'webvtt-parser';
import { unique } from './utils';

export const playlistMethods = {
	playlist(this: NMPlayer): PlaylistItem[] {
		return this._playlist;
	},

	tracks<K extends TrackType>(this: NMPlayer, kind?: K): Track[] | TrackKindMap[K][] {
		const all = this.playlistItem()?.tracks ?? [];
		if (!kind)
			return all;
		return all.filter((t: Track): t is TrackKindMap[K] => t.kind === kind);
	},

	playlistIndex(this: NMPlayer): number {
		return this._playlist.indexOf(this.currentPlaylistItem);
	},

	playlistItem(this: NMPlayer, index?: number): PlaylistItem | void {
		if (index === undefined) {
			return this.currentPlaylistItem;
		}

		if (index === this.currentIndex) {
			return this.currentPlaylistItem;
		}

		this.playVideo(index);
	},

	playVideo(this: NMPlayer, index: number) {
		if (index >= 0 && index < this._playlist.length) {
			this.currentSubtitleFile = '';
			this.currentSubtitleIndex = -1;
			this._subtitles = <VTTData>{};
			this.subtitleText.textContent = '';
			this.subtitleOverlay.style.display = 'none';
			this.emit('subtitleChanged', this.subtitle());
			this.emit('captionsChanged', this.subtitle());

			this.currentPlaylistItem = this._playlist[index];

			this.videoElement.poster = this.resolveImageUrl(this.currentPlaylistItem.image) ?? '';

			if (this.currentIndex !== index) {
				setTimeout(() => {
					this.emit('item', this.currentPlaylistItem);
				}, 0);
			}

			this.currentIndex = index;

			this.loadSource((this.options.basePath ?? '') + this.currentPlaylistItem.file);
		}
		else {
			this.logger.warn('playVideo() index out of range', { index, playlistLength: this._playlist.length });
		}
	},

	/**
	 * Fetches a playlist from the specified URL and returns it as a converted playlist for the current player.
	 * @param url The URL to fetch the playlist from.
	 * @returns The converted playlist for the current player.
	 */
	async fetchPlaylist(this: NMPlayer, url: string): Promise<PlaylistItem[]> {
		const language = await this.storage.get('NoMercy-displayLanguage', navigator.language);

		const headers: { [arg: string]: string } = {
			'Accept-Language': language,
			'Content-Type': 'application/json',
		};

		if (this.options.accessToken) {
			headers.Authorization = `Bearer ${this.options.accessToken}`;
		}
		const response = await fetch(encodeURI(url), {
			headers,
			method: 'GET',
		});

		if (!response.ok) {
			throw new Error(`Playlist fetch failed: HTTP ${response.status} ${response.statusText} (${url})`);
		}

		const json = await response.json();

		if (!Array.isArray(json)) {
			throw new TypeError(`Playlist fetch returned non-array response (${url})`);
		}

		return json as PlaylistItem[];
	},

	/**
	 * Loads the playlist for the player based on the options provided.
	 * If the playlist is a string, it will be fetched and parsed as JSON.
	 * If the playlist is an array, it will be used directly.
	 */
	loadPlaylist(this: NMPlayer): void {
		if (typeof this.options.playlist === 'string') {
			this.fetchPlaylist(this.options.playlist)
				.then((json: PlaylistItem[]) => {
					this.logger.debug('Playlist fetched', { count: json.length });

					this._playlist = json
						.map(item => ({
							...item,
							season: item.season,
							episode: item.episode,
						}))
						.filter(item => !!item.file);

					setTimeout(() => {
						this.emit('playlist', this._playlist);
					}, 0);

					if (this.options.disableAutoPlayback)
						return;
					this.playVideo(0);
				})
				.catch((err) => {
					this.logger.error('Failed to load playlist', { reason: String(err) });
					this.emit('error', err);
				});
		}
		else if (Array.isArray(this.options.playlist)) {
			this._playlist = this.options.playlist
				.map(item => ({
					...item,
					season: item.season,
					episode: item.episode,
				}))
				.filter(item => !!item.file);

			setTimeout(() => {
				this.emit('playlist', this._playlist);
			}, 0);

			if (this.options.disableAutoPlayback)
				return;
			this.playVideo(0);
		}
	},

	setPlaylist(this: NMPlayer, playlist: string | PlaylistItem[]) {
		this.options.playlist = playlist;
		this.loadPlaylist();
	},

	load(this: NMPlayer, playlist: PlaylistItem[]) {
		this._playlist = playlist;
	},

	next(this: NMPlayer): void {
		if (this.playlistIndex() < this._playlist.length - 1) {
			this.playlistItem(this.playlistIndex() + 1);
		}
	},

	previous(this: NMPlayer): void {
		if (this.playlistIndex() > 0) {
			this.playlistItem(this.playlistIndex() - 1);
		}
	},

	/**
	 * Sets the current episode to play based on the given season and episode numbers.
	 * If the episode is not found in the playlist, the first item in the playlist is played.
	 * @param season - The season number of the episode to play.
	 * @param episode - The episode number to play.
	 */
	setEpisode(this: NMPlayer, season: number, episode: number): void {
		if (!Number.isFinite(season) || !Number.isFinite(episode)) {
			this.logger.warn('setEpisode() expects finite number arguments', { season, episode });
			return;
		}
		const item = this.playlist()
			.findIndex((l: any) => l.season === season && l.episode === episode);
		if (item === -1) {
			this.playlistItem(0);
		}
		else {
			this.playlistItem(item);
		}

		if (this.options.disableAutoPlayback || !this.options.autoPlay)
			return;
		this.play().catch((err) => {
			this.logger.verbose('Play rejected', { reason: String(err) });
		});
	},

	/**
	 * Returns a boolean indicating whether the current playlist item is the first item in the playlist.
	 * @returns {boolean} True if the current playlist item is the first item in the playlist, false otherwise.
	 */
	isFirstPlaylistItem(this: NMPlayer): boolean {
		return this.playlistIndex() === 0;
	},

	/**
	 * Checks if the current playlist item is the last item in the playlist.
	 * @returns {boolean} True if the current playlist item is the last item in the playlist, false otherwise.
	 */
	isLastPlaylistItem(this: NMPlayer): boolean {
		return this.playlistIndex() === this.playlist().length - 1;
	},

	/**
	 * Checks if the player has more than one playlist.
	 * @returns {boolean} True if the player has more than one playlist, false otherwise.
	 */
	hasPlaylists(this: NMPlayer): boolean {
		return this.playlist().length > 1;
	},

	seasons(this: NMPlayer): Array<{ season: number; seasonName: string; episodes: number }> {
		return unique(this.playlist(), 'season').map((s: any) => ({
			season: s.season,
			seasonName: s.seasonName,
			episodes: this.playlist().filter((e: any) => e.season === s.season).length,
		}));
	},
};
