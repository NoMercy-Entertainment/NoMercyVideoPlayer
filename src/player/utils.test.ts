import { describe, expect, it } from 'vitest';
import {
	breakEpisodeTitle,
	breakLogoTitle,
	convertToSeconds,
	hslToHex,
	humanTime,
	limitSentenceByCharacters,
	lineBreakShowTitle,
	nearestValue,
	normalizeHex,
	pad,
	rgbToHex,
	unique,
} from './utils';

describe('humanTime', () => {
	it('formats zero', () => {
		expect(humanTime(0)).toBe('00:00');
	});

	it('formats seconds only', () => {
		expect(humanTime(45)).toBe('00:45');
	});

	it('formats minutes and seconds', () => {
		expect(humanTime(90)).toBe('01:30');
	});

	it('formats hours', () => {
		expect(humanTime(3661)).toBe('01:01:01');
	});

	it('formats days', () => {
		expect(humanTime(90061)).toBe('1:01:01:01');
	});

	it('handles NaN input', () => {
		expect(humanTime(NaN)).toBe('00:00');
	});

	it('handles string input', () => {
		expect(humanTime('90')).toBe('01:30');
	});
});

describe('convertToSeconds', () => {
	it('converts MM:SS', () => {
		expect(convertToSeconds('01:30')).toBe(90);
	});

	it('converts HH:MM:SS', () => {
		expect(convertToSeconds('1:02:03')).toBe(3723);
	});

	it('returns 0 for null', () => {
		expect(convertToSeconds(null)).toBe(0);
	});

	it('returns 0 for empty string', () => {
		expect(convertToSeconds('')).toBe(0);
	});
});

describe('pad', () => {
	it('pads single digit', () => {
		expect(pad(5, 2)).toBe('05');
	});

	it('does not pad when already long enough', () => {
		expect(pad(100, 2)).toBe('100');
	});

	it('pads with more places', () => {
		expect(pad(5, 4)).toBe('0005');
	});

	it('returns empty string for undefined', () => {
		expect(pad(undefined as any)).toBe('');
	});

	it('defaults to 2 places', () => {
		expect(pad(3)).toBe('03');
	});
});

describe('unique', () => {
	it('removes duplicates by key', () => {
		const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
		expect(unique(arr, 'id')).toEqual([{ id: 1, name: 'a' }, { id: 2, name: 'b' }]);
	});

	it('returns empty array for null', () => {
		expect(unique(null as any, 'id')).toEqual([]);
	});

	it('returns empty array for non-array', () => {
		expect(unique('not an array' as any, 'id')).toEqual([]);
	});

	it('returns same array when no duplicates', () => {
		const arr = [{ id: 1 }, { id: 2 }];
		expect(unique(arr, 'id')).toEqual(arr);
	});
});

describe('breakLogoTitle', () => {
	it('breaks at colon + space', () => {
		expect(breakLogoTitle('Title: Subtitle')).toBe('Title:\nSubtitle');
	});

	it('breaks at question mark + space', () => {
		expect(breakLogoTitle('What? Something')).toBe('What?\nSomething');
	});

	it('does not break when no punctuation match', () => {
		expect(breakLogoTitle('No Break Here')).toBe('No Break Here');
	});

	it('returns empty string for falsy input', () => {
		expect(breakLogoTitle('')).toBe('');
	});
});

describe('breakEpisodeTitle', () => {
	it('replaces / with backslash-newline', () => {
		expect(breakEpisodeTitle('Part 1/Part 2')).toBe('Part 1\\\nPart 2');
	});

	it('returns empty string for falsy input', () => {
		expect(breakEpisodeTitle('')).toBe('');
	});
});

describe('nearestValue', () => {
	it('finds exact match', () => {
		expect(nearestValue([10, 20, 30], 20)).toBe(20);
	});

	it('finds nearest value', () => {
		expect(nearestValue([10, 20, 30], 22)).toBe(20);
	});

	it('finds nearest when closer to higher', () => {
		expect(nearestValue([10, 20, 30], 28)).toBe(30);
	});
});

describe('limitSentenceByCharacters', () => {
	it('returns empty for falsy input', () => {
		expect(limitSentenceByCharacters('')).toBe('');
	});

	it('truncates at sentence boundary', () => {
		const text = 'First sentence. Second sentence. Third sentence that is very long.';
		const result = limitSentenceByCharacters(text, 40);
		expect(result).toBe('First sentence. Second sentence.');
	});
});

describe('lineBreakShowTitle', () => {
	it('breaks at episode marker', () => {
		expect(lineBreakShowTitle('Show S01E02 Title')).toBe('Show \nS01E02 Title');
	});

	it('removes show name when requested', () => {
		expect(lineBreakShowTitle('Show S01E02 Title', true)).toBe('S01E02 Title');
	});

	it('returns original when no episode marker', () => {
		expect(lineBreakShowTitle('No Episode Here')).toBe('No Episode Here');
	});

	it('returns empty for falsy input', () => {
		expect(lineBreakShowTitle('')).toBe('');
	});
});

describe('rgbToHex', () => {
	it('converts rgb to hex with full opacity', () => {
		expect(rgbToHex('rgb(255, 0, 0)', 1)).toBe('#FF0000FF');
	});

	it('converts rgb with partial opacity', () => {
		expect(rgbToHex('rgb(0, 128, 255)', 0.5)).toBe('#0080FF80');
	});

	it('returns transparent for invalid input', () => {
		expect(rgbToHex('not-rgb', 1)).toBe('#00000000');
	});
});

describe('hslToHex', () => {
	it('converts hsl(0,100,50) to red', () => {
		const result = hslToHex('hsl(0, 100%, 50%)', 1);
		expect(result).toBe('#ff0000FF');
	});

	it('returns transparent for invalid', () => {
		expect(hslToHex('invalid', 1)).toBe('#00000000');
	});
});

describe('normalizeHex', () => {
	it('expands 3-digit hex', () => {
		expect(normalizeHex('#F00', 1)).toBe('#FF0000FF');
	});

	it('appends alpha to 6-digit hex', () => {
		expect(normalizeHex('#FF0000', 0.5)).toBe('#FF000080');
	});

	it('returns 8-digit hex as-is (uppercased)', () => {
		expect(normalizeHex('#ff0000ff', 1)).toBe('#FF0000FF');
	});
});
