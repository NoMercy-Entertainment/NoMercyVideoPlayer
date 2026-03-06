import type { PlaylistItem, Track, TrackKindMap, TrackType } from './data';
import type { PlayerConfig } from './config';

export interface NMPlayerPlaylist<T extends Record<string, any> = Record<string, any>> {
	/**
	 * Returns the full playlist array.
	 * @returns An array of playlist items.
	 */
	playlist(): (PlaylistItem & T['playlist'][number])[];

	/**
	 * Returns all tracks from the current playlist item.
	 * @returns An array of all tracks.
	 */
	tracks(): Track[];
	/**
	 * Returns tracks filtered by kind, with the return type narrowed to the specific track subtype.
	 * @param kind - The track kind to filter by (e.g. `'subtitles'`, `'chapters'`).
	 * @returns An array of tracks matching the given kind.
	 */
	tracks<K extends TrackType>(kind: K): TrackKindMap[K][];

	/**
	 * Returns the index of the currently playing playlist item.
	 * @returns The zero-based index in the playlist.
	 */
	playlistIndex(): number;

	/**
	 * Returns the currently active playlist item object.
	 * @returns The current playlist item with all its metadata.
	 */
	playlistItem(): PlaylistItem & T['playlist'][number];
	/**
	 * Switches playback to the playlist item at the given index.
	 * Resets subtitle state, loads the new source, and emits an `'item'` event.
	 * @param index - The zero-based playlist index to switch to.
	 */
	playlistItem(index: number): void;

	/**
	 * Loads and starts playback of the playlist item at the given index.
	 * @param value - The zero-based playlist index to play.
	 */
	playVideo(value: number): void;

	/**
	 * Fetches a playlist from a remote URL and returns the parsed JSON data.
	 * @param url - The URL to fetch the playlist from.
	 * @returns A promise that resolves with the fetched playlist data.
	 */
	fetchPlaylist(url: string): Promise<PlaylistItem[]>;

	/**
	 * Loads the current playlist item's source and initializes playback.
	 * Sets up subtitle, chapter, font, and skipper files for the current item.
	 */
	loadPlaylist(): void;

	/**
	 * Sets the playlist and begins loading/playback.
	 * If the playlist is a string URL, it will be fetched and parsed as JSON.
	 * If it's an array, it will be used directly.
	 * @param playlist - The playlist array or URL to load.
	 */
	setPlaylist(playlist: PlayerConfig<T>['playlist'] | string): void;

	/**
	 * Sets the playlist array directly without triggering playback or source loading.
	 * Use this to preload a playlist before the user initiates playback.
	 * @param playlist - The playlist array to set.
	 */
	load(playlist: (PlaylistItem & T)[]): void;

	/**
	 * Advances to the next item in the playlist.
	 * Does nothing if already on the last item.
	 */
	next(): void;

	/**
	 * Goes back to the previous item in the playlist.
	 * Does nothing if already on the first item.
	 */
	previous(): void;

	/**
	 * Switches to a specific episode by season and episode number.
	 * If the episode is not found in the playlist, falls back to the first item.
	 * Starts playback if `autoPlay` is enabled and `disableAutoPlayback` is false.
	 * @param season - The season number of the episode.
	 * @param episode - The episode number to play.
	 */
	setEpisode(season: number, episode: number): void;

	/**
	 * Registers a callback that is invoked before each playlist item starts playing.
	 * The callback receives the playlist item and its index. It can optionally return
	 * a new playlist to replace the current one.
	 * @param callback - The callback function, or `null` to remove.
	 */
	setPlaylistItemCallback(callback: null | ((item: PlaylistItem & T['playlist'][number], index: number) => void | Promise<PlayerConfig<T>['playlist']>)): void;

	/**
	 * Returns whether the current playlist item is the first item in the playlist.
	 * @returns `true` if playing the first item.
	 */
	isFirstPlaylistItem(): boolean;

	/**
	 * Returns whether the current playlist item is the last item in the playlist.
	 * @returns `true` if playing the last item.
	 */
	isLastPlaylistItem(): boolean;

	/**
	 * Returns whether the playlist has more than one item.
	 * @returns `true` if the playlist contains multiple items.
	 */
	hasPlaylists(): boolean;

	/**
	 * Returns an array of unique seasons derived from the playlist, with episode counts.
	 * @returns An array of objects with `season`, `seasonName`, and `episodes` properties.
	 */
	seasons(): Array<{ season: number; seasonName: string; episodes: number }>;
}
