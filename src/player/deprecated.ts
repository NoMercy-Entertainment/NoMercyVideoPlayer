import type { MediaPlaylist } from 'hls.js';
import type { Cue } from 'webvtt-parser';
import type { Chapter, Level, NMPlayer, PlaylistItem, PlayState, Skipper, SubtitleStyle, SubtitleTrack, TimeData } from '../types';

/**
 * ALL deprecated method wrappers. Each method delegates to its modern equivalent.
 * Delete this file and its import to drop v0 compatibility.
 */
export const deprecatedMethods = {
	// ── Playback ─────────────────────────────────────────────────────

	/** @deprecated Use `rewind(time)` instead. */
	rewindVideo(this: NMPlayer, time?: number): void {
		this.rewind(time);
	},

	/** @deprecated Use `forward(time)` instead. */
	forwardVideo(this: NMPlayer, time?: number): void {
		this.forward(time);
	},

	/** @deprecated Use `speed(value)` instead. */
	setSpeed(this: NMPlayer, speed: number): void {
		this.speed(speed);
	},

	/** @deprecated Use `speed()` instead. */
	getSpeed(this: NMPlayer): number {
		return this.speed();
	},

	/** @deprecated Use `speeds()` instead. */
	getSpeeds(this: NMPlayer): number[] {
		return this.speeds();
	},

	// ── Volume ───────────────────────────────────────────────────────

	/** @deprecated Use `volume()` instead. */
	getVolume(this: NMPlayer): number {
		return this.volume();
	},

	/** @deprecated Use `volume(value)` instead. */
	setVolume(this: NMPlayer, value: number): void {
		this.volume(value);
	},

	/** @deprecated Use `muted()` instead. */
	getMute(this: NMPlayer): boolean {
		return this.muted();
	},

	/** @deprecated Use `muted(value)` instead. */
	setMute(this: NMPlayer, muted: boolean): void {
		this.muted(muted);
	},

	/** @deprecated Use `gain()` instead. */
	getGain(this: NMPlayer): { min: number; max: number; defaultValue: number; value: number } | undefined {
		return this.gain();
	},

	/** @deprecated Use `gain(value)` instead. */
	setGain(this: NMPlayer, value: number): void {
		this.gain(value);
	},

	// ── Audio ────────────────────────────────────────────────────────

	/** @deprecated Use `audioTracks()` instead. */
	getAudioTracks(this: NMPlayer): MediaPlaylist[] {
		return this.audioTracks() as unknown as MediaPlaylist[];
	},

	/** @deprecated Use `audioTrack()` instead. */
	getCurrentAudioTrack(this: NMPlayer): MediaPlaylist | null {
		return this.audioTrack() as unknown as MediaPlaylist | null;
	},

	/** @deprecated Use `audioTrackIndex()` instead. */
	getAudioTrackIndex(this: NMPlayer): number {
		return this.audioTrackIndex();
	},

	/** @deprecated Use `audioTrack(index)` instead. */
	setCurrentAudioTrack(this: NMPlayer, index: number): void {
		this.audioTrack(index);
	},

	/** @deprecated Use `audioTrackIndexByLanguage(lang)` instead. */
	getAudioTrackIndexByLanguage(this: NMPlayer, language: string): number {
		return this.audioTrackIndexByLanguage(language);
	},

	// ── Quality ──────────────────────────────────────────────────────

	/** @deprecated Use `qualityLevels()` instead. */
	getQualityLevels(this: NMPlayer): Level[] {
		return this.qualityLevels();
	},

	/** @deprecated Use `quality()` instead. */
	getCurrentQuality(this: NMPlayer): number {
		return this.quality();
	},

	/** @deprecated Use `quality(index)` instead. */
	setCurrentQuality(this: NMPlayer, index: number): void {
		this.quality(index);
	},

	// ── Subtitles ────────────────────────────────────────────────────

	/** @deprecated Use `subtitles()` instead. */
	getSubtitles(this: NMPlayer): SubtitleTrack[] | undefined {
		return this.subtitles();
	},

	/** @deprecated Use `subtitles()` instead. */
	getCaptionsList(this: NMPlayer): SubtitleTrack[] {
		return this.subtitles();
	},

	/** @deprecated Use `hasSubtitles()` instead. */
	hasCaptions(this: NMPlayer): boolean {
		return this.hasSubtitles();
	},

	/** @deprecated Use `subtitle()` instead. */
	getCurrentCaption(this: NMPlayer): SubtitleTrack | undefined {
		return this.subtitle();
	},

	/** @deprecated Use `subtitleIndex()` instead. */
	getCaptionIndex(this: NMPlayer): number {
		return this.subtitleIndex();
	},

	/** @deprecated Use `subtitleIndexBy(language, type, ext)` instead. */
	getCaptionIndexBy(this: NMPlayer, language: string, type: string, ext: string): number | undefined {
		return this.subtitleIndexBy(language, type, ext);
	},

	/** @deprecated Use `subtitle(index)` instead. */
	setCurrentCaption(this: NMPlayer, index?: number): void {
		if (index !== undefined)
			this.subtitle(index);
	},

	/** @deprecated Use `subtitleStyle(style)` instead. */
	setSubtitleStyle(this: NMPlayer, style: Partial<SubtitleStyle>): void {
		this.subtitleStyle(style);
	},

	/** @deprecated Use `subtitleStyle()` instead. */
	getSubtitleStyle(this: NMPlayer): SubtitleStyle {
		return this.subtitleStyle();
	},

	/** @deprecated Use `subtitleFile()` instead. */
	getSubtitleFile(this: NMPlayer): string | undefined {
		return this.subtitleFile();
	},

	// ── Playlist ─────────────────────────────────────────────────────

	/** @deprecated Use `playlist()` instead. */
	getPlaylist(this: NMPlayer): PlaylistItem[] {
		return this.playlist();
	},

	/** @deprecated Use `playlistIndex()` instead. */
	getPlaylistIndex(this: NMPlayer): number {
		return this.playlistIndex();
	},

	/** @deprecated Use `seasons()` instead. */
	getSeasons(this: NMPlayer): Array<{ season: number; seasonName: string; episodes: number }> {
		return this.seasons();
	},

	/** @deprecated Use `currentSrc()` instead. */
	getCurrentSrc(this: NMPlayer): string {
		return this.currentSrc();
	},

	// ── Chapters ─────────────────────────────────────────────────────

	/** @deprecated Use `chapters()` instead. */
	getChapters(this: NMPlayer): Chapter[] {
		return this.chapters();
	},

	/** @deprecated Use `chapter(currentTime)` instead. */
	getCurrentChapter(this: NMPlayer, currentTime: number): Cue | undefined {
		return this.chapter(currentTime);
	},

	/** @deprecated Use `chapterFile()` instead. */
	getChapterFile(this: NMPlayer): string | undefined {
		return this.chapterFile();
	},

	/** @deprecated Use `previousChapterAt(time)` instead. */
	getPreviousChapter(this: NMPlayer, currentStartTime: number): Cue | undefined {
		return this.previousChapterAt(currentStartTime);
	},

	/** @deprecated Use `nextChapterAt(time)` instead. */
	getNextChapter(this: NMPlayer, currentEndTime: number): Cue | undefined {
		return this.nextChapterAt(currentEndTime);
	},

	/** @deprecated Use `chapterText(time)` instead. */
	getChapterText(this: NMPlayer, scrubTimePlayer: number): string | null {
		return this.chapterText(scrubTimePlayer);
	},

	// ── Skippers ─────────────────────────────────────────────────────

	/** @deprecated Use `skippers()` instead. */
	getSkippers(this: NMPlayer): Skipper[] {
		return this.skippers();
	},

	/** @deprecated Use `skip()` instead. */
	getSkip(this: NMPlayer): Skipper | undefined {
		return this.skip();
	},

	/** @deprecated Use `skipFile()` instead. */
	getSkipFile(this: NMPlayer): string | undefined {
		return this.skipFile();
	},

	// ── Fonts ────────────────────────────────────────────────────────

	/** @deprecated Use `fontsFile()` instead. */
	getFontsFile(this: NMPlayer): string | undefined {
		return this.fontsFile();
	},

	// ── Display ──────────────────────────────────────────────────────

	/** @deprecated Use `fullscreen()` instead. */
	getFullscreen(this: NMPlayer): boolean {
		return this.fullscreen();
	},

	/** @deprecated Use `width()` instead. */
	getWidth(this: NMPlayer): number {
		return this.width();
	},

	/** @deprecated Use `height()` instead. */
	getHeight(this: NMPlayer): number {
		return this.height();
	},

	/** @deprecated Use `aspect()` instead. */
	getCurrentAspect(this: NMPlayer): string | void {
		return this.aspect();
	},

	// ── Core ─────────────────────────────────────────────────────────

	/** @deprecated Use `element()` instead. */
	getElement(this: NMPlayer): HTMLDivElement {
		return this.element();
	},

	/** @deprecated Use `videoElement` directly instead. */
	getVideoElement(this: NMPlayer): HTMLVideoElement {
		return this.videoElement;
	},

	/** @deprecated Use `currentTime()` instead. */
	getCurrentTime(this: NMPlayer): number {
		return this.currentTime();
	},

	/** @deprecated Use `duration()` instead. */
	getDuration(this: NMPlayer): number {
		return this.duration();
	},

	/** @deprecated Use `timeData()` instead. */
	getTimeData(this: NMPlayer): TimeData {
		return this.timeData();
	},

	/** @deprecated Use `buffer()` instead. */
	getBuffer(this: NMPlayer): TimeRanges {
		return this.buffer();
	},

	/** @deprecated Use `state()` instead. */
	getState(this: NMPlayer): PlayState {
		return this.state();
	},

	/** @deprecated Use `timeFile()` instead. */
	getTimeFile(this: NMPlayer): string | undefined {
		return this.timeFile();
	},

	/** @deprecated Use `spriteFile()` instead. */
	getSpriteFile(this: NMPlayer): string | undefined {
		return this.spriteFile();
	},

	/** @deprecated Use `plugin(name)` instead. */
	getPlugin(this: NMPlayer, name: string): any {
		return this.plugin(name);
	},
};
