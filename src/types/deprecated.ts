import type { Cue } from 'webvtt-parser';
import type Plugin from '../plugins/plugin';
import type {
	AudioTrack,
	Chapter,
	Level,
	PlaylistItem,
	PlayState,
	Skipper,
	Stretching,
	SubtitleStyle,
	SubtitleTrack,
	TimeData,
} from './data';

export interface NMPlayerDeprecated<T extends Record<string, any> = Record<string, any>> {
	// ── Playback ─────────────────────────────────────────────────────
	/** @deprecated Use `rewind()` */ rewindVideo(seconds?: number): void;
	/** @deprecated Use `forward()` */ forwardVideo(seconds?: number): void;
	/** @deprecated Use `speed(value)` */ setSpeed(speed: number): void;
	/** @deprecated Use `speed()` */ getSpeed(): number;
	/** @deprecated Use `speeds()` */ getSpeeds(): number[];

	// ── Volume ───────────────────────────────────────────────────────
	/** @deprecated Use `volume()` */ getVolume(): number;
	/** @deprecated Use `volume(value)` */ setVolume(volume: number): void;
	/** @deprecated Use `muted()` */ getMute(): boolean;
	/** @deprecated Use `muted(value)` */ setMute(state: boolean): void;
	/** @deprecated Use `gain()` */ getGain(): { min: number; max: number; defaultValue: number; value: number } | undefined;
	/** @deprecated Use `gain(value)` */ setGain(value: number): void;

	// ── Audio ────────────────────────────────────────────────────────
	/** @deprecated Use `audioTracks()` */ getAudioTracks(): AudioTrack[];
	/** @deprecated Use `audioTrack()` */ getCurrentAudioTrack(): AudioTrack | null;
	/** @deprecated Use `audioTrackIndex()` */ getAudioTrackIndex(): number;
	/** @deprecated Use `audioTrack(index)` */ setCurrentAudioTrack(index: number): void;
	/** @deprecated Use `audioTrackIndexByLanguage()` */ getAudioTrackIndexByLanguage(language: string): number;

	// ── Quality ──────────────────────────────────────────────────────
	/** @deprecated Use `qualityLevels()` — v0 list had "Auto" at index 0 */ getQualityLevels(): Level[];
	/** @deprecated Use `quality()` — returns v0-style index (shifted +1) */ getCurrentQuality(): number;
	/** @deprecated Use `quality(index)` — accepts v0-style index (shifted -1) */ setCurrentQuality(index: number): void;

	// ── Subtitles ────────────────────────────────────────────────────
	/** @deprecated Use `subtitles()` */ getSubtitles(): SubtitleTrack[];
	/** @deprecated Use `subtitles()` — v0 list had "Off" at index 0 */ getCaptionsList(): SubtitleTrack[];
	/** @deprecated Use `hasSubtitles()` */ hasCaptions(): boolean;
	/** @deprecated Use `subtitle()` */ getCurrentCaption(): SubtitleTrack | undefined;
	/** @deprecated Use `subtitleIndex()` — returns v0-style index (shifted +1) */ getCaptionIndex(): number;
	/** @deprecated Use `subtitleIndexBy()` — returns v0-style index (shifted +1) */ getCaptionIndexBy(language: string, type: string, ext: string): number | undefined;
	/** @deprecated Use `subtitle(index)` — accepts v0-style index (shifted -1) */ setCurrentCaption(index: number): void;
	/** @deprecated Use `subtitleStyle()` */ getSubtitleStyle(): SubtitleStyle;
	/** @deprecated Use `subtitleStyle(value)` */ setSubtitleStyle(style: Partial<SubtitleStyle>): void;
	/** @deprecated Use `subtitleFile()` */ getSubtitleFile(): string | undefined;

	// ── Playlist ─────────────────────────────────────────────────────
	/** @deprecated Use `playlist()` */ getPlaylist(): (PlaylistItem & T['playlist'][number])[];
	/** @deprecated Use `playlistIndex()` */ getPlaylistIndex(): number;
	/** @deprecated Use `seasons()` */ getSeasons(): Array<{ season: number; seasonName: string; episodes: number }>;
	/** @deprecated Use `currentSrc()` */ getCurrentSrc(): string;

	// ── Chapters ─────────────────────────────────────────────────────
	/** @deprecated Use `chapters()` */ getChapters(): Chapter[];
	/** @deprecated Use `chapter()` */ getCurrentChapter(currentTime: number): Cue | undefined;
	/** @deprecated Use `chapterFile()` */ getChapterFile(): string | undefined;
	/** @deprecated Use `previousChapterAt()` */ getPreviousChapter(currentStartTime: number): Cue | undefined;
	/** @deprecated Use `nextChapterAt()` */ getNextChapter(currentEndTime: number): Cue | undefined;
	/** @deprecated Use `chapterText()` */ getChapterText(scrubTimePlayer: number): string | null;

	// ── Skippers ─────────────────────────────────────────────────────
	/** @deprecated Use `skippers()` */ getSkippers(): Skipper[];
	/** @deprecated Use `skip()` */ getSkip(): Skipper | undefined;
	/** @deprecated Use `skipFile()` */ getSkipFile(): string | undefined;

	// ── Fonts ────────────────────────────────────────────────────────
	/** @deprecated Use `fontsFile()` */ getFontsFile(): string | undefined;

	// ── Display ──────────────────────────────────────────────────────
	/** @deprecated Use `fullscreen()` */ getFullscreen(): boolean;
	/** @deprecated Use `fullscreen(value)` */ setFullscreen(state: boolean): void;
	/** @deprecated Use `aspect(value)` */ setAspect(aspect: Stretching): void;
	/** @deprecated Use `width()` */ getWidth(): number;
	/** @deprecated Use `height()` */ getHeight(): number;
	/** @deprecated Use `aspect()` */ getCurrentAspect(): string | void;

	// ── Core ─────────────────────────────────────────────────────────
	/** @deprecated Use `element()` */ getElement(): HTMLDivElement;
	/** @deprecated Use `videoElement` (field) */ getVideoElement(): HTMLVideoElement;
	/** @deprecated Use `currentTime()` */ getCurrentTime(): number;
	/** @deprecated Use `duration()` */ getDuration(): number;
	/** @deprecated Use `timeData()` */ getTimeData(): TimeData;
	/** @deprecated Use `buffer()` */ getBuffer(): TimeRanges;
	/** @deprecated Use `state()` */ getState(): PlayState;
	/** @deprecated Use `timeFile()` */ getTimeFile(): string | undefined;
	/** @deprecated Use `spriteFile()` */ getSpriteFile(): string | undefined;
	/** @deprecated Use `plugin(name)` */ getPlugin(name: string): Plugin | undefined;
}
