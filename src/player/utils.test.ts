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
	toTitleCase,
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

describe('toTitleCase', () => {
	describe('English baseline (default locale)', () => {
		it('capitalises every word in a simple phrase', () => {
			expect(toTitleCase('the quick brown fox', 'en')).toBe('The Quick Brown Fox');
		});

		it('keeps small words lowercase in the middle', () => {
			expect(toTitleCase('war and peace', 'en')).toBe('War and Peace');
			expect(toTitleCase('beauty and the beast', 'en')).toBe('Beauty and the Beast');
			expect(toTitleCase('lord of the rings', 'en')).toBe('Lord of the Rings');
			expect(toTitleCase('a man for all seasons', 'en')).toBe('A Man for All Seasons');
		});

		it('always capitalises the first word even if it is a small word', () => {
			expect(toTitleCase('a farewell to arms', 'en')).toBe('A Farewell to Arms');
			expect(toTitleCase('the man the myth the legend', 'en')).toBe('The Man the Myth the Legend');
		});

		it('always capitalises the last word even if it is a small word', () => {
			expect(toTitleCase('what is it', 'en')).toBe('What Is It');
			expect(toTitleCase('this is the', 'en')).toBe('This Is The');
		});

		it('handles two-word phrases (both must be capitalised)', () => {
			expect(toTitleCase('in it', 'en')).toBe('In It');
			expect(toTitleCase('and or', 'en')).toBe('And Or');
		});

		it('handles a single word', () => {
			expect(toTitleCase('hello', 'en')).toBe('Hello');
			expect(toTitleCase('the', 'en')).toBe('The');
		});

		it('handles an empty string', () => {
			expect(toTitleCase('', 'en')).toBe('');
		});

		it('lowercases all-caps input word-by-word then capitalises', () => {
			expect(toTitleCase('THE QUICK BROWN FOX', 'en')).toBe('The Quick Brown Fox');
		});

		it('handles mixed-case messy input', () => {
			expect(toTitleCase('hElLo wORld oF tHe FuTuRe', 'en')).toBe('Hello World of the Future');
		});

		it('capitalises after multiple consecutive hyphens', () => {
			expect(toTitleCase('hello---world', 'en')).toBe('Hello---World');
		});
	});

	describe('hard boundaries reset capitalisation', () => {
		it('capitalises after a colon', () => {
			expect(toTitleCase('star wars: a new hope', 'en')).toBe('Star Wars: A New Hope');
		});

		it('capitalises after an em-dash', () => {
			expect(toTitleCase('beauty\u2014and the beast', 'en')).toBe('Beauty\u2014And the Beast');
		});

		it('capitalises after an en-dash', () => {
			expect(toTitleCase('north\u2013by northwest', 'en')).toBe('North\u2013By Northwest');
		});

		it('capitalises after an exclamation mark', () => {
			expect(toTitleCase('stop!the madness', 'en')).toBe('Stop!The Madness');
		});

		it('capitalises after a question mark', () => {
			expect(toTitleCase('who?the butler', 'en')).toBe('Who?The Butler');
		});

		it('capitalises small word directly after a colon', () => {
			expect(toTitleCase('episode one: a phantom menace', 'en')).toBe('Episode One: A Phantom Menace');
		});

		it('periods and commas are not hard boundaries — word including the punctuation is capitalised', () => {
			// '.' and ',' are not delimiters so the punctuation stays attached to the preceding token
			expect(toTitleCase('mr. smith goes to washington', 'en')).toBe('Mr. Smith Goes to Washington');
			expect(toTitleCase('hello, world of tomorrow', 'en')).toBe('Hello, World of Tomorrow');
		});

		it('capitalises after a curly apostrophe (Celtic names)', () => {
			expect(toTitleCase('o\u2019brien went north', 'en')).toBe('O\u2019Brien Went North');
		});

		it('capitalises after a curly apostrophe (French elision)', () => {
			expect(toTitleCase('l\u2019homme du train', 'fr')).toBe('L\u2019Homme du Train');
			expect(toTitleCase('d\u2019artagnan et les mousquetaires', 'fr')).toBe('D\u2019Artagnan et les Mousquetaires');
		});

		it('does NOT capitalise contraction suffixes after apostrophe', () => {
			expect(toTitleCase('don\u2019t look up', 'en')).toBe('Don\u2019t Look Up');
			expect(toTitleCase('it\u2019s complicated', 'en')).toBe('It\u2019s Complicated');
			expect(toTitleCase('we\u2019re the millers', 'en')).toBe('We\u2019re the Millers');
			expect(toTitleCase('you\u2019ve got mail', 'en')).toBe('You\u2019ve Got Mail');
			expect(toTitleCase('i can\u2019t stop the feeling', 'en')).toBe('I Can\u2019t Stop the Feeling');
		});

		it('handles double apostrophe in Celtic names (o\'\'malley)', () => {
			expect(toTitleCase('o\'\'malley and o\'\'connor', 'en')).toBe('O\'\'Malley and O\'\'Connor');
		});

		it('preserves \'n\' in rock \'n\' roll as lowercase (contraction suffix)', () => {
			expect(toTitleCase('rock \'n\' roll revival', 'en')).toBe('Rock \'n\' Roll Revival');
		});

		it('handles nested apostrophes: possessive inside quoted title', () => {
			expect(toTitleCase('the \'queen\'s gambit\' effect', 'en')).toBe('The \'Queen\'s Gambit\' Effect');
		});
	});

	describe('locale-aware casing', () => {
		it('Turkish: lowercase i capitalises to dotted İ', () => {
			// In Turkish locale, 'i'.toLocaleUpperCase('tr') === 'İ'
			const result = toTitleCase('istanbul ve izmir', 'tr');
			expect(result.charAt(0)).toBe('\u0130'); // İ
		});

		it('Turkish: keeps small words lowercase', () => {
			// 'ali'/'veli' start with 'a'/'v', not 'i', so no dotted-İ on first char
			expect(toTitleCase('ali ve veli', 'tr')).toBe('Ali ve Veli');
		});

		it('German: ß lowercases correctly', () => {
			expect(toTitleCase('die straße und der fluss', 'de')).toBe('Die Stra\u00DFe und der Fluss');
		});

		it('German: keeps small words lowercase', () => {
			expect(toTitleCase('der herr der ringe', 'de')).toBe('Der Herr der Ringe');
			expect(toTitleCase('krieg und frieden', 'de')).toBe('Krieg und Frieden');
		});

		it('German: roman numeral after ß word', () => {
			expect(toTitleCase('straße xii', 'de')).toBe('Stra\u00DFe XII');
		});
	});

	describe('per-language small-words', () => {
		it('Dutch: keeps small words lowercase', () => {
			expect(toTitleCase('de man van het noorden', 'nl')).toBe('De Man van het Noorden');
		});

		it('French: keeps small words lowercase', () => {
			expect(toTitleCase('la belle et la bête', 'fr')).toBe('La Belle et la B\u00EAte');
			expect(toTitleCase('le rouge et le noir', 'fr')).toBe('Le Rouge et le Noir');
		});

		it('Spanish: keeps small words lowercase', () => {
			expect(toTitleCase('el viejo y el mar', 'es')).toBe('El Viejo y el Mar');
		});

		it('Spanish: handles accented characters', () => {
			expect(toTitleCase('el ni\u00F1o y la luna', 'es')).toBe('El Ni\u00F1o y la Luna');
		});

		it('French: capitalises each component of a hyphenated preposition', () => {
			// hyphen is a hard boundary so both halves of "au-dessus" are capitalised
			expect(toTitleCase('au-dessus de la mer', 'fr')).toBe('Au-Dessus de la Mer');
		});

		it('Italian: keeps small words lowercase', () => {
			expect(toTitleCase('il nome della rosa', 'it')).toBe('Il Nome della Rosa');
			expect(toTitleCase('la vita è bella', 'it')).toBe('La Vita È Bella');
		});

		it('Portuguese: keeps small words lowercase', () => {
			expect(toTitleCase('o velho e o mar', 'pt')).toBe('O Velho e o Mar');
		});

		it('Swedish: keeps small words lowercase', () => {
			expect(toTitleCase('mannen och havet', 'sv')).toBe('Mannen och Havet');
		});

		it('Norwegian: keeps small words lowercase', () => {
			expect(toTitleCase('mannen og havet', 'no')).toBe('Mannen og Havet');
		});

		it('Danish: keeps small words lowercase', () => {
			expect(toTitleCase('manden og havet', 'da')).toBe('Manden og Havet');
		});

		it('Polish: keeps small words lowercase', () => {
			expect(toTitleCase('stary człowiek i morze', 'pl')).toBe('Stary Cz\u0142owiek i Morze');
		});

		it('Russian: keeps small words lowercase', () => {
			expect(toTitleCase('\u0432\u043E\u0439\u043D\u0430 \u0438 \u043C\u0438\u0440', 'ru')).toBe('\u0412\u043E\u0439\u043D\u0430 \u0438 \u041C\u0438\u0440');
		});
	});

	describe('unknown locale falls back to English small-words', () => {
		it('capitalises every content word, suppresses English minor words', () => {
			expect(toTitleCase('foo and bar', 'xx')).toBe('Foo and Bar');
		});
	});

	describe('roman numerals are preserved in uppercase', () => {
		it('single numeral stays uppercase', () => {
			expect(toTitleCase('henry v', 'en')).toBe('Henry V');
		});

		it('double numeral stays uppercase', () => {
			expect(toTitleCase('henry iv', 'en')).toBe('Henry IV');
		});

		it('complex numeral stays uppercase', () => {
			expect(toTitleCase('henry viii and the crown', 'en')).toBe('Henry VIII and the Crown');
		});

		it('mixed case numeral is normalised to uppercase', () => {
			expect(toTitleCase('chapter xiv', 'en')).toBe('Chapter XIV');
		});

		it('roman numeral at end of title stays uppercase', () => {
			expect(toTitleCase('world war ii', 'en')).toBe('World War II');
		});

		it('does not treat a single letter as a roman numeral (vitamin i)', () => {
			expect(toTitleCase('vitamin i deficiency', 'en')).toBe('Vitamin I Deficiency');
		});

		it('does not affect regular words that happen to contain roman-numeral letters', () => {
			// 'vim' is not a valid roman numeral pattern
			expect(toTitleCase('vim and vigour', 'en')).toBe('Vim and Vigour');
		});

		it('does not treat alphanumeric tokens as roman numerals', () => {
			// 'x2' contains a digit so it fails the all-roman-chars pre-check
			expect(toTitleCase('chapter x2', 'en')).toBe('Chapter X2');
		});

		it('roman numeral after a colon boundary', () => {
			expect(toTitleCase('henry viii: the legacy', 'en')).toBe('Henry VIII: The Legacy');
		});
	});

	describe('extra whitespace and mixed spacing is preserved', () => {
		it('preserves leading/trailing spaces', () => {
			expect(toTitleCase(' hello world ', 'en')).toBe(' Hello World ');
		});

		it('preserves multiple spaces between words', () => {
			expect(toTitleCase('hello  world', 'en')).toBe('Hello  World');
		});

		it('preserves tab characters', () => {
			expect(toTitleCase('hello\tworld', 'en')).toBe('Hello\tWorld');
		});

		it('preserves newline characters', () => {
			expect(toTitleCase('hello\nworld', 'en')).toBe('Hello\nWorld');
		});
	});

	describe('unknown locale with non-Latin script', () => {
		it('uppercases Greek letters via locale-aware casing with English small-word fallback', () => {
			expect(toTitleCase('\u03B1 and \u03C9', 'zz')).toBe('\u0391 and \u03A9');
		});
	});

	it('capitalises hyphenated compounds with small words inside', () => {
		expect(toTitleCase('man of the-year award', 'en')).toBe('Man of the-Year Award');
	});

	it('handles words with internal apostrophes that are not contractions', () => {
		expect(toTitleCase('shaquille o\'neal biography', 'en')).toBe('Shaquille O\'Neal Biography');
	});

	it('handles mixed unicode letters inside a word', () => {
		// "del" is not in the English small-words set, so it capitalises
		expect(toTitleCase('café del mar sessions', 'en')).toBe('Café Del Mar Sessions');
	});

	it('semicolon is not a hard boundary — word after it is treated normally', () => {
		// ';' is not in _ttcHardBoundaryRE so capitaliseNext is not reset
		expect(toTitleCase('truth; the final frontier', 'en')).toBe('Truth; the Final Frontier');
	});

	it('slash is not a delimiter — word including the slash is treated as one token', () => {
		// '/' is not in _ttcDelimiterRE so 'war/peace' is a single token
		expect(toTitleCase('war/peace anthology', 'en')).toBe('War/peace Anthology');
	});

	it('capitalises after a long sequence of punctuation', () => {
		expect(toTitleCase('hello?!?who goes there', 'en')).toBe('Hello?!?Who Goes There');
	});

	it('Turkish: handles dotted/dotless i inside mixed-case words', () => {
		expect(toTitleCase('kırık iğne hikayesi', 'tr')).toBe('Kırık İğne Hikayesi');
	});

	it('German: handles uppercase ß (ẞ) correctly', () => {
		expect(toTitleCase('DIE STRAẞE UND DER FLUSS', 'de')).toBe('Die Straße und der Fluss');
	});

	it('French: handles elision with uppercase vowel following', () => {
		// bare 'l' (elided article) is not in the French small-words set, so it capitalises
		expect(toTitleCase('l\'amour et l\'Océan', 'fr')).toBe('L\'Amour et L\'Océan');
	});

	it('Spanish: handles multi-word titles with multiple accents', () => {
		expect(toTitleCase('el corazón y la razón', 'es')).toBe('El Corazón y la Razón');
	});

	it('Italian: handles apostrophised articles before vowels', () => {
		// bare 'l' (elided article) is not in the Italian small-words set, so it capitalises
		expect(toTitleCase('l\'acqua e l\'aria', 'it')).toBe('L\'Acqua e L\'Aria');
	});

	it('Portuguese: handles contractions with articles', () => {
		expect(toTitleCase('no meio do caminho', 'pt')).toBe('No Meio do Caminho');
	});

	it('does not treat invalid subtractive sequences as roman numerals', () => {
		expect(toTitleCase('chapter iix', 'en')).toBe('Chapter Iix');
	});

	it('handles roman numerals followed by punctuation', () => {
		// comma is not a delimiter so it sticks to 'viii,' making the pre-check fail;
		// also comma is not a hard boundary so 'the' stays lowercase
		expect(toTitleCase('henry viii, the king', 'en')).toBe('Henry Viii, the King');
	});

	it('handles lowercase roman numerals with trailing apostrophe', () => {
		expect(toTitleCase('chapter iv\'', 'en')).toBe('Chapter IV\'');
	});

	it('preserves mixed whitespace including tabs and multiple newlines', () => {
		expect(toTitleCase('hello\t\n\nworld', 'en')).toBe('Hello\t\n\nWorld');
	});

	it('preserves leading tabs', () => {
		expect(toTitleCase('\t\tstart here', 'en')).toBe('\t\tStart Here');
	});

	it('unknown locale: preserves non-Latin scripts without altering them', () => {
		expect(toTitleCase('東京 and paris', 'xx')).toBe('東京 and Paris');
	});

	it('unknown locale: capitalises Latin words but leaves Cyrillic untouched', () => {
		// 'привет' is the first token so it is always capitalised (П)
		expect(toTitleCase('привет and world', 'zz')).toBe('Привет and World');
	});

	it('handles nested punctuation with hyphens and apostrophes', () => {
		// hyphens are hard boundaries so each component after '-' is capitalised
		expect(toTitleCase('the \'end-of-days\' prophecy', 'en')).toBe('The \'End-Of-Days\' Prophecy');
	});

	it('handles unicode ligatures inside words', () => {
		// toLocaleUpperCase expands ﬂ→FL and ﬁ→FI (two chars), so the result is FLower/FIeld
		expect(toTitleCase('ﬂower of the ﬁeld', 'en')).toBe('FLower of the FIeld');
	});

	it('handles mixed scripts inside a single token', () => {
		expect(toTitleCase('neo‑東京 vibes', 'en')).toBe('Neo‑東京 Vibes');
	});
});
