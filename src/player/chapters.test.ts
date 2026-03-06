import { describe, expect, it, vi } from 'vitest';
import { chapterMethods } from './chapters';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const player: any = {
		_chapters: {
			cues: [
				{ id: '1', text: 'Intro', startTime: 0, endTime: 60 },
				{ id: '2', text: 'Main', startTime: 60, endTime: 180 },
				{ id: '3', text: 'Credits', startTime: 180, endTime: 240 },
			],
		},
		currentChapterFile: '',
		currentTime: vi.fn(() => 70),
		duration: vi.fn(() => 240),
		seek: vi.fn(),
		emit: vi.fn(),
		once: vi.fn(),
		getFileContents: vi.fn(() => Promise.resolve()),
		logger: { debug: vi.fn() },
		playlistItem: vi.fn(() => ({
			tracks: [{ kind: 'chapters', file: 'chapters.vtt', id: 0 }],
		})),
		...overrides,
	};

	// Bind methods
	for (const [key, value] of Object.entries(chapterMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('chapterMethods', () => {
	describe('chapters()', () => {
		it('maps cues to Chapter[] with position data', () => {
			const player = createMockPlayer();
			const chapters = player.chapters();
			expect(chapters).toHaveLength(3);
			expect(chapters[0]).toMatchObject({
				id: 'Chapter 0',
				title: 'Intro',
				startTime: 0,
			});
			expect(chapters[0].left).toBe(0);
			expect(chapters[0].width).toBe(25); // 60/240 * 100
		});

		it('returns empty array when no chapters', () => {
			const player = createMockPlayer({ _chapters: {} });
			expect(player.chapters()).toEqual([]);
		});
	});

	describe('chapter(time)', () => {
		it('finds chapter at given time', () => {
			const player = createMockPlayer();
			const chapter = player.chapter(70);
			expect(chapter?.text).toBe('Main');
		});

		it('returns undefined for time outside chapters', () => {
			const player = createMockPlayer();
			expect(player.chapter(999)).toBeUndefined();
		});
	});

	describe('chapterText(time)', () => {
		it('returns title for time in chapter', () => {
			const player = createMockPlayer();
			expect(player.chapterText(70)).toBe('Main');
		});

		it('returns last chapter title when time is beyond all', () => {
			const player = createMockPlayer();
			expect(player.chapterText(999)).toBe('Credits');
		});

		it('returns null when no chapters', () => {
			const player = createMockPlayer({ _chapters: {} });
			expect(player.chapterText(10)).toBeNull();
		});
	});

	describe('previousChapter()', () => {
		it('seeks to start of current chapter when >10s in', () => {
			const player = createMockPlayer();
			player.currentTime = vi.fn(() => 75);
			player.previousChapter();
			expect(player.seek).toHaveBeenCalledWith(60);
		});

		it('seeks to previous chapter when <10s in', () => {
			const player = createMockPlayer();
			player.currentTime = vi.fn(() => 63);
			player.previousChapter();
			expect(player.seek).toHaveBeenCalledWith(0);
		});
	});

	describe('nextChapter()', () => {
		it('seeks to next chapter', () => {
			const player = createMockPlayer();
			player.currentTime = vi.fn(() => 70);
			player.nextChapter();
			expect(player.seek).toHaveBeenCalledWith(180);
		});
	});

	describe('chapterFile()', () => {
		it('returns chapter track file', () => {
			const player = createMockPlayer();
			expect(player.chapterFile()).toBe('chapters.vtt');
		});

		it('returns undefined when no chapter track', () => {
			const player = createMockPlayer({
				playlistItem: vi.fn(() => ({ tracks: [] })),
			});
			expect(player.chapterFile()).toBeUndefined();
		});
	});
});
