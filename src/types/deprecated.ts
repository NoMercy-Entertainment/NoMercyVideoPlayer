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
	/** @deprecated Use `plugin()` */ getPlugin(name: string): Plugin | undefined;
	/** @deprecated Use `nextChapterAt()` */ getNextChapter(currentEndTime: number): Cue | undefined;
	/** @deprecated Use `previousChapterAt()` */ getPreviousChapter(currentStartTime: number): Cue | undefined;
	/** @deprecated Use `audioTrackIndexByLanguage()` */ getAudioTrackIndexByLanguage(language: string): number | undefined;
	/** @deprecated Use `spriteFile()` */ getSpriteFile(): string | undefined;
	/** @deprecated Use `subtitleFile()` */ getSubtitleFile(): string | undefined;
	/** @deprecated Use `timeFile()` */ getTimeFile(): string | undefined;

	/** @deprecated Use `volume()` / `volume(value)` */ getVolume(): number;
	/** @deprecated Use `volume(value)` */ setVolume(volume: number): void;
	/** @deprecated Use `muted()` */ getMute(): boolean;
	/** @deprecated Use `muted(value)` */ setMute(state?: boolean): void;
	/** @deprecated Use `speed()` / `speed(value)` */ getSpeed(): number;
	/** @deprecated Use `speed(value)` */ setSpeed(speed: any): void;
	/** @deprecated Use `fullscreen()` */ getFullscreen(): boolean;
	/** @deprecated Use `fullscreen(value)` */ setFullscreen(state: boolean): void;
	/** @deprecated Use `subtitle()` / `subtitle(index)` */ getCurrentCaption(): SubtitleTrack | undefined;
	/** @deprecated Use `subtitle(index)` */ setCurrentCaption(index: number): void;
	/** @deprecated Use `audioTrack()` / `audioTrack(index)` */ getCurrentAudioTrack(): AudioTrack | null;
	/** @deprecated Use `audioTrack(index)` */ setCurrentAudioTrack(index: number): void;
	/** @deprecated Use `quality()` / `quality(index)` */ getCurrentQuality(): number;
	/** @deprecated Use `quality(index)` */ setCurrentQuality(index: number): void;
	/** @deprecated Use `aspect()` / `aspect(value)` */ getCurrentAspect(): string;
	/** @deprecated Use `aspect(value)` */ setAspect(aspect: Stretching): void;
	/** @deprecated Use `subtitleStyle()` / `subtitleStyle(value)` */ getSubtitleStyle(): SubtitleStyle;
	/** @deprecated Use `subtitleStyle(value)` */ setSubtitleStyle(style: Partial<SubtitleStyle>): void;
	/** @deprecated Use `gain()` / `gain(value)` */ getGain(): { min: number; max: number; defaultValue: number; value: number } | undefined;
	/** @deprecated Use `gain(value)` */ setGain(value: number): void;
	/** @deprecated Use `state()` */ getState(): PlayState;
	/** @deprecated Use `currentTime()` */ getCurrentTime(): number;
	/** @deprecated Use `duration()` */ getDuration(): number;
	/** @deprecated Use `buffer()` */ getBuffer(): TimeRanges;
	/** @deprecated Use `width()` */ getWidth(): number;
	/** @deprecated Use `height()` */ getHeight(): number;
	/** @deprecated Use `element()` */ getElement(): HTMLDivElement;
	/** @deprecated Use `videoElement` (field) */ getVideoElement(): HTMLVideoElement;
	/** @deprecated Use `currentSrc()` */ getCurrentSrc(): string;
	/** @deprecated Use `playlist()` */ getPlaylist(): (PlaylistItem & T['playlist'][number])[];
	/** @deprecated Use `playlistIndex()` */ getPlaylistIndex(): number;
	/** @deprecated Use `audioTracks()` */ getAudioTracks(): AudioTrack[];
	/** @deprecated Use `audioTrackIndex()` */ getAudioTrackIndex(): number;
	/** @deprecated Use `qualityLevels()` */ getQualityLevels(): Level[];
	/** @deprecated Use `subtitles()` */ getSubtitles(): SubtitleTrack[];
	/** @deprecated Use `subtitles()` */ getCaptionsList(): SubtitleTrack[];
	/** @deprecated Use `subtitleIndex()` */ getCaptionIndex(): number;
	/** @deprecated Use `subtitleIndexBy()` */ getCaptionIndexBy(language: string, type: string, ext: string): number | undefined;
	/** @deprecated Use `chapters()` */ getChapters(): Chapter[];
	/** @deprecated Use `chapter()` */ getCurrentChapter(currentTime: number): Cue | undefined;
	/** @deprecated Use `speeds()` */ getSpeeds(): number[];
	/** @deprecated Use `skippers()` */ getSkippers(): Skipper[];
	/** @deprecated Use `skip()` */ getSkip(): Skipper | undefined;
	/** @deprecated Use `seasons()` */ getSeasons(): Array<{ season: number; seasonName: string; episodes: number }>;
	/** @deprecated Use `timeData()` */ getTimeData(): TimeData;
	/** @deprecated Use `rewind()` */ rewindVideo(seconds?: number): void;
	/** @deprecated Use `forward()` */ forwardVideo(seconds?: number): void;
	/** @deprecated Use `hasSubtitles()` */ hasCaptions(): boolean;
}
