/**
 * Progress-aware start selection for `autoPlay` — the v1 behaviour: the most
 * recently watched item wins, >90% watched rolls over to the next item
 * (fresh start), anything else resumes at the saved position.
 */

import type { VideoPlaylistItem } from '../types';

export interface StartSelection {
	index: number;
	/** Offset (seconds) the item should START at — passed as `startAt` so the backend begins fetching there. Absent = start at 0. */
	resumeTime?: number;
}

export function pickStartItem(items: ReadonlyArray<VideoPlaylistItem>): StartSelection {
	const withProgress = items.filter(item => item.progress);
	if (withProgress.length === 0)
		return { index: 0 };

	const mostRecent = [...withProgress].sort((a, b) => b.progress!.timestamp - a.progress!.timestamp)[0]!;
	const index = items.indexOf(mostRecent);

	if (mostRecent.progress!.percentage > 90)
		return { index: Math.min(index + 1, items.length - 1) };

	const resumeTime = mostRecent.progress!.time;
	return resumeTime ? { index, resumeTime } : { index };
}
