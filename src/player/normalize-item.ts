/**
 * Built-in playlist-item normalizer — accepts the v1 / NoMercy server wire
 * format and reshapes it to the v2 canonical `VideoPlaylistItem`, per field
 * and idempotently: canonical input passes through untouched. Wired into the
 * kit's queue ingest pipeline via `normalizePlaylistItem`, so consumers hand
 * `setup({ playlist })` the raw server payload — exactly like v1 / JW /
 * video.js — and never reshape items themselves. App-specific concerns go in
 * the `transformPlaylistItem` config callback instead.
 */

import type { ChapterRef, VideoPlaylistItem, WatchProgress } from '../types';

interface LegacyTrackEntry {
	id?: string | number;
	kind?: string;
	file?: string;
	label?: string;
	language?: string;
	type?: string;
}

interface LegacyChapterEntry {
	id?: number;
	start_time?: number;
	end_time?: number;
	title?: string;
}

interface LegacyProgressEntry {
	time?: number;
	date?: string;
	timestamp?: number;
	percentage?: number;
}

/** The loose wire shape: canonical v2 fields plus every v1 spelling. */
type LooseVideoItem = Omit<VideoPlaylistItem, 'duration' | 'chapters' | 'progress'> & {
	file?: string;
	duration?: number | string;
	tracks?: LegacyTrackEntry[];
	chapters?: ChapterRef[] | LegacyChapterEntry[];
	progress?: WatchProgress | LegacyProgressEntry | null;
};

/** Parse `"1:24:14"` / `"24:14"` style durations to seconds. */
function parseDurationSeconds(value: string): number | undefined {
	const parts = value.split(':').map(Number);
	if (parts.length === 0 || parts.some(Number.isNaN))
		return undefined;
	return parts.reduce((total, part) => total * 60 + part, 0);
}

function normalizeDuration(value: number | string | undefined): number | undefined {
	if (typeof value === 'number')
		return value;
	if (typeof value === 'string')
		return parseDurationSeconds(value);
	return undefined;
}

function isLegacyChapter(entry: ChapterRef | LegacyChapterEntry): entry is LegacyChapterEntry {
	return typeof (entry as LegacyChapterEntry).start_time === 'number'
		&& typeof (entry as ChapterRef).start !== 'number';
}

function normalizeChapters(chapters: LooseVideoItem['chapters']): ChapterRef[] | undefined {
	if (!chapters || chapters.length === 0)
		return chapters as ChapterRef[] | undefined;

	return chapters.map((entry, index) => {
		if (!isLegacyChapter(entry))
			return entry as ChapterRef;
		return {
			index,
			// v1 server cues are in milliseconds; the kit Chapter contract is seconds.
			start: (entry.start_time ?? 0) / 1000,
			end: (entry.end_time ?? 0) / 1000,
			title: entry.title ?? '',
		};
	});
}

function isLegacyProgress(progress: WatchProgress | LegacyProgressEntry): progress is LegacyProgressEntry {
	return typeof (progress as WatchProgress).timestamp !== 'number'
		&& typeof (progress as LegacyProgressEntry).date === 'string';
}

function normalizeProgress(
	progress: LooseVideoItem['progress'],
	durationSeconds: number | undefined,
): WatchProgress | undefined {
	if (!progress)
		return undefined;
	if (!isLegacyProgress(progress))
		return progress as WatchProgress;

	const time = progress.time ?? 0;
	const percentage = durationSeconds
		? Math.min(100, (time / durationSeconds) * 100)
		: 0;
	return {
		timestamp: Date.parse(progress.date!),
		percentage,
		time,
	};
}

function normalizeTracks(tracks: LegacyTrackEntry[] | undefined): LegacyTrackEntry[] | undefined {
	if (!tracks)
		return undefined;
	// v1 marked subtitle variants ('full' / 'sign') in `label`; the v2 track
	// model carries that distinction in `type`.
	return tracks.map(track => track.kind === 'subtitles' && track.type === undefined
		? { ...track, type: track.label }
		: track);
}

function fontsFromTracks(tracks: LegacyTrackEntry[] | undefined): Array<{ file: string }> | undefined {
	const files = [...new Set(
		tracks
			?.filter(track => track.kind === 'fonts' && !!track.file)
			.map(track => track.file!) ?? [],
	)];
	return files.length > 0 ? files.map(file => ({ file })) : undefined;
}

/**
 * Normalize one playlist item from the loose v1 / server wire format to the
 * v2 canonical shape. Idempotent — already-canonical fields pass through.
 */
export function normalizeVideoPlaylistItem(item: VideoPlaylistItem): VideoPlaylistItem {
	const loose = item as LooseVideoItem;
	const durationSeconds = normalizeDuration(loose.duration);
	const tracks = normalizeTracks(loose.tracks);

	return {
		...loose,
		url: loose.url ?? loose.file,
		duration: durationSeconds,
		tracks,
		chapters: normalizeChapters(loose.chapters),
		previewSpriteUrl: loose.previewSpriteUrl
			?? tracks?.find(track => track.kind === 'thumbnails')?.file,
		fonts: loose.fonts ?? fontsFromTracks(tracks),
		progress: normalizeProgress(loose.progress, durationSeconds),
	} as VideoPlaylistItem;
}
