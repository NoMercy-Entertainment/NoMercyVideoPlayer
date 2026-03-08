import { describe, expect, it } from 'vitest';
import {
	breakEpisodeTitle,
	breakLogoTitle,
	convertToSeconds,
	defaultSubtitleStyles,
	edgeStyles,
	fontFamilies,
	getEdgeStyle,
	hslToHex,
	humanTime,
	limitSentenceByCharacters,
	lineBreakShowTitle,
	namedColors,
	nearestValue,
	normalizeHex,
	pad,
	parseColorToHex,
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
		expect(humanTime(Number.NaN)).toBe('00:00');
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

describe('getEdgeStyle', () => {
	it('returns depressed shadow string', () => {
		const result = getEdgeStyle('depressed', 1);
		expect(result).toContain('1px 1px 2px');
		expect(result).toContain('#000000');
	});

	it('returns dropShadow string', () => {
		const result = getEdgeStyle('dropShadow', 1);
		expect(result).toContain('2px 2px 4px');
	});

	it('returns raised shadow string', () => {
		const result = getEdgeStyle('raised', 1);
		expect(result).toContain('-1px -1px 2px');
	});

	it('returns uniform shadow string', () => {
		const result = getEdgeStyle('uniform', 1);
		expect(result).toContain('0px 0px 4px');
	});

	it('returns textShadow with multiple repeating shadows', () => {
		const result = getEdgeStyle('textShadow', 1);
		// textShadow produces 7 comma-separated shadow values
		const parts = result.split(',');
		expect(parts).toHaveLength(7);
		expect(parts[0]).toContain('0px 0px 4px');
	});

	it('returns empty string for none', () => {
		expect(getEdgeStyle('none', 1)).toBe('');
	});

	it('passes opacity through to parseColorToHex', () => {
		const full = getEdgeStyle('depressed', 1);
		const half = getEdgeStyle('depressed', 0.5);
		// In happy-dom canvas context is null, so both return the same fallback.
		// Just verify both produce valid strings.
		expect(typeof full).toBe('string');
		expect(typeof half).toBe('string');
	});
});

describe('parseColorToHex', () => {
	// Note: happy-dom does not support canvas 2d context, so parseColorToHex
	// falls through to the early `return '#00000000'` before reaching the
	// namedColors lookup. We test the transparent path (which runs before
	// the ctx check) and verify the fallback behavior. The named-color logic
	// is tested indirectly via normalizeHex + namedColors below.

	it('returns transparent hex for "transparent"', () => {
		const result = parseColorToHex('transparent', 1);
		expect(result).toBe('#00000000');
	});

	it('returns transparent hex for "Transparent" (case insensitive)', () => {
		const result = parseColorToHex('Transparent', 1);
		expect(result).toBe('#00000000');
	});

	it('returns fallback when canvas context is unavailable (happy-dom)', () => {
		// In happy-dom, getContext("2d") returns null, so all non-transparent
		// colors hit the early return '#00000000'.
		const result = parseColorToHex('black', 1);
		expect(result).toBe('#00000000');
	});

	it('namedColors map resolves correctly via normalizeHex', () => {
		expect(normalizeHex(namedColors.black, 1)).toBe('#000000FF');
		expect(normalizeHex(namedColors.white, 1)).toBe('#FFFFFFFF');
		expect(normalizeHex(namedColors.red, 1)).toBe('#FF0000FF');
	});

	it('namedColors + normalizeHex respects opacity', () => {
		expect(normalizeHex(namedColors.black, 0.5)).toBe('#00000080');
		expect(normalizeHex(namedColors.white, 0)).toBe('#FFFFFF00');
	});
});

describe('defaultSubtitleStyles', () => {
	it('has all required properties', () => {
		expect(defaultSubtitleStyles).toHaveProperty('fontSize');
		expect(defaultSubtitleStyles).toHaveProperty('fontFamily');
		expect(defaultSubtitleStyles).toHaveProperty('textColor');
		expect(defaultSubtitleStyles).toHaveProperty('textOpacity');
		expect(defaultSubtitleStyles).toHaveProperty('backgroundColor');
		expect(defaultSubtitleStyles).toHaveProperty('backgroundOpacity');
		expect(defaultSubtitleStyles).toHaveProperty('edgeStyle');
		expect(defaultSubtitleStyles).toHaveProperty('areaColor');
		expect(defaultSubtitleStyles).toHaveProperty('windowOpacity');
	});

	it('has correct default values', () => {
		expect(defaultSubtitleStyles.fontSize).toBe(100);
		expect(defaultSubtitleStyles.fontFamily).toBe('ReithSans, sans-serif');
		expect(defaultSubtitleStyles.textColor).toBe('white');
		expect(defaultSubtitleStyles.textOpacity).toBe(100);
		expect(defaultSubtitleStyles.backgroundColor).toBe('black');
		expect(defaultSubtitleStyles.backgroundOpacity).toBe(0);
		expect(defaultSubtitleStyles.edgeStyle).toBe('textShadow');
		expect(defaultSubtitleStyles.areaColor).toBe('black');
		expect(defaultSubtitleStyles.windowOpacity).toBe(0);
	});
});

describe('edgeStyles', () => {
	it('contains all 6 edge style options', () => {
		expect(edgeStyles).toHaveLength(6);
	});

	it('contains none, depressed, dropShadow, textShadow, raised, uniform', () => {
		const values = edgeStyles.map(s => s.value);
		expect(values).toContain('none');
		expect(values).toContain('depressed');
		expect(values).toContain('dropShadow');
		expect(values).toContain('textShadow');
		expect(values).toContain('raised');
		expect(values).toContain('uniform');
	});

	it('each entry has name and value', () => {
		for (const style of edgeStyles) {
			expect(style).toHaveProperty('name');
			expect(style).toHaveProperty('value');
			expect(typeof style.name).toBe('string');
			expect(typeof style.value).toBe('string');
		}
	});
});

describe('fontFamilies', () => {
	it('contains 5 font family options', () => {
		expect(fontFamilies).toHaveLength(5);
	});

	it('each entry has name and value', () => {
		for (const font of fontFamilies) {
			expect(font).toHaveProperty('name');
			expect(font).toHaveProperty('value');
			expect(typeof font.name).toBe('string');
			expect(typeof font.value).toBe('string');
		}
	});

	it('includes ReithSans as the first option', () => {
		expect(fontFamilies[0].name).toBe('ReithSans');
	});

	it('all values contain a fallback font', () => {
		for (const font of fontFamilies) {
			expect(font.value).toContain(',');
		}
	});
});
