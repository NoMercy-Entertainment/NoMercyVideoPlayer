import type { EdgeStyle, SubtitleStyle } from '../types';

// ── Constants ────────────────────────────────────────────────────────

export const defaultSubtitleStyles: SubtitleStyle = {
	fontSize: 100,
	fontFamily: 'ReithSans, sans-serif',
	textColor: 'white',
	textOpacity: 100,
	backgroundColor: 'black',
	backgroundOpacity: 0,
	edgeStyle: 'textShadow',
	areaColor: 'black',
	windowOpacity: 0,
};

export const edgeStyles: readonly { name: string; value: EdgeStyle }[] = [
	{ name: 'None', value: 'none' },
	{ name: 'Depressed', value: 'depressed' },
	{ name: 'Drop Shadow', value: 'dropShadow' },
	{ name: 'Text Shadow', value: 'textShadow' },
	{ name: 'Raised', value: 'raised' },
	{ name: 'Uniform', value: 'uniform' },
];

export const fontFamilies: readonly { name: string; value: string }[] = [
	{ name: 'ReithSans', value: 'ReithSans, sans-serif' },
	{ name: 'Arial', value: 'Arial, sans-serif' },
	{ name: 'Courier New', value: 'Courier New, monospace' },
	{ name: 'Georgia', value: 'Georgia, sans-serif' },
	{ name: 'Verdana', value: 'Verdana, sans-serif' },
];

export const namedColors: Record<string, string> = {
	aliceblue: '#F0F8FF',
	antiquewhite: '#FAEBD7',
	aquamarine: '#7FFFD4',
	azure: '#F0FFFF',
	beige: '#F5F5DC',
	bisque: '#FFE4C4',
	black: '#000000',
	blanchedalmond: '#FFEBCD',
	blue: '#0000FF',
	blueviolet: '#8A2BE2',
	brown: '#A52A2A',
	burlywood: '#DEB887',
	cadetblue: '#5F9EA0',
	chartreuse: '#7FFF00',
	chocolate: '#D2691E',
	coral: '#FF7F50',
	cornflowerblue: '#6495ED',
	cornsilk: '#FFF8DC',
	crimson: '#DC143C',
	cyan: '#00FFFF',
	darkblue: '#00008B',
	darkcyan: '#008B8B',
	darkgoldenrod: '#B8860B',
	darkgray: '#A9A9A9',
	darkgreen: '#006400',
	darkkhaki: '#BDB76B',
	darkmagenta: '#8B008B',
	darkolivegreen: '#556B2F',
	darkorange: '#FF8C00',
	darkorchid: '#9932CC',
	darkred: '#8B0000',
	darksalmon: '#E9967A',
	darkseagreen: '#8FBC8F',
	darkslateblue: '#483D8B',
	darkslategray: '#2F4F4F',
	darkturquoise: '#00CED1',
	darkviolet: '#9400D3',
	deeppink: '#FF1493',
	deepskyblue: '#00BFFF',
	dimgray: '#696969',
	dodgerblue: '#1E90FF',
	firebrick: '#B22222',
	floralwhite: '#FFFAF0',
	forestgreen: '#228B22',
	fuchsia: '#FF00FF',
	gainsboro: '#DCDCDC',
	ghostwhite: '#F8F8FF',
	gold: '#FFD700',
	goldenrod: '#DAA520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#ADFF2F',
	honeydew: '#F0FFF0',
	hotpink: '#FF69B4',
	indianred: '#CD5C5C',
	indigo: '#4B0082',
	ivory: '#FFFFF0',
	khaki: '#F0E68C',
	lavender: '#E6E6FA',
	lavenderblush: '#FFF0F5',
	lawngreen: '#7CFC00',
	lemonchiffon: '#FFFACD',
	lightblue: '#ADD8E6',
	lightcoral: '#F08080',
	lightcyan: '#E0FFFF',
	lightgoldenrodyellow: '#FAFAD2',
	lightgray: '#D3D3D3',
	lightgreen: '#90EE90',
	lightpink: '#FFB6C1',
	lightsalmon: '#FFA07A',
	lightseagreen: '#20B2AA',
	lightskyblue: '#87CEFA',
	lightslategray: '#778899',
	lightsteelblue: '#B0C4DE',
	lightyellow: '#FFFFE0',
	lime: '#00FF00',
	limegreen: '#32CD32',
	linen: '#FAF0E6',
	magenta: '#FF00FF',
	maroon: '#800000',
	mediumaquamarine: '#66CDAA',
	mediumblue: '#0000CD',
	mediumorchid: '#BA55D3',
	mediumpurple: '#9370DB',
	mediumseagreen: '#3CB371',
	mediumslateblue: '#7B68EE',
	mediumspringgreen: '#00FA9A',
	mediumturquoise: '#48D1CC',
	mediumvioletred: '#C71585',
	midnightblue: '#191970',
	mintcream: '#F5FFFA',
	mistyrose: '#FFE4E1',
	moccasin: '#FFE4B5',
	navajowhite: '#FFDEAD',
	navy: '#000080',
	oldlace: '#FDF5E6',
	olive: '#808000',
	olivedrab: '#6B8E23',
	orange: '#FFA500',
	orangered: '#FF4500',
	orchid: '#DA70D6',
	palegoldenrod: '#EEE8AA',
	palegreen: '#98FB98',
	paleturquoise: '#AFEEEE',
	palevioletred: '#DB7093',
	papayawhip: '#FFEFD5',
	peachpuff: '#FFDAB9',
	peru: '#CD853F',
	pink: '#FFC0CB',
	plum: '#DDA0DD',
	powderblue: '#B0E0E6',
	purple: '#800080',
	rebeccapurple: '#663399',
	red: '#FF0000',
	rosybrown: '#BC8F8F',
	royalblue: '#4169E1',
	saddlebrown: '#8B4513',
	salmon: '#FA8072',
	sandybrown: '#F4A460',
	seagreen: '#2E8B57',
	seashell: '#FFF5EE',
	sienna: '#A0522D',
	silver: '#C0C0C0',
	skyblue: '#87CEEB',
	slateblue: '#6A5ACD',
	slategray: '#708090',
	snow: '#FFFAFA',
	springgreen: '#00FF7F',
	steelblue: '#4682B4',
	tan: '#D2B48C',
	teal: '#008080',
	thistle: '#D8BFD8',
	tomato: '#FF6347',
	turquoise: '#40E0D0',
	violet: '#EE82EE',
	wheat: '#F5DEB3',
	white: '#FFFFFF',
	whitesmoke: '#F5F5F5',
	yellow: '#FFFF00',
	yellowgreen: '#9ACD32',
};

// ── Utility Functions ────────────────────────────────────────────────

export function humanTime(time: string | number): string {
	time = Number.parseInt(time as string, 10);

	let days: any = Number.parseInt(`${(time / (3600 * 24))}`, 10);
	let hours: any = pad(Number.parseInt(`${(time % 86400) / 3600}`, 10), 2);
	let minutes: any = pad(Number.parseInt(`${(time % 3600) / 60}`, 10), 2);
	let seconds: any = pad(Number.parseInt(`${time % 60}`, 10), 2);

	if (`${minutes}`.length === 1) {
		minutes = `0${minutes}`;
	}
	if (`${seconds}`.length === 1) {
		seconds = `0${seconds}`;
	}
	if (days === 0) {
		days = '';
	}
	else {
		days = `${days}:`;
	}
	if (hours === 0) {
		hours = '00:';
	}
	else {
		hours = `${hours}:`;
	}
	if (minutes === 0) {
		minutes = '00:';
	}
	else {
		minutes = `${minutes}:`;
	}
	if (hours === '00:' && days === '') {
		hours = '';
	}
	const current = days + hours + minutes + seconds;
	return current.replace('NaN:NaN:NaN:NaN', '00:00');
}

export function convertToSeconds(hms: string | null) {
	if (!hms) {
		return 0;
	}
	const a: number[] = hms.split(':').map(n => Number.parseInt(n, 10));
	if (a.length < 3) {
		a.unshift(0);
	}

	return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
}

export function pad(number: string | number, places = 2) {
	if (typeof number !== 'undefined') {
		const zero = places - number.toString().length + 1;

		return Array.from({ length: +(zero > 0 && zero) }).join('0') + number;
	}
	return '';
}

export function unique<T>(array: T[], key: string): T[] {
	if (!array || !Array.isArray(array)) {
		return [];
	}

	return array.filter((obj: any, pos, arr) => arr
		.map((mapObj: any) => mapObj[key])
		.indexOf(obj[key]) === pos);
}

export function breakLogoTitle(str: string, characters = [':', '!', '?']) {
	if (!str) {
		return '';
	}

	if (str.split('').some((l: string) => characters.includes(l))) {
		const reg = new RegExp(characters.map(l => (l === '?' ? `\\${l}` : l)).join('|'), 'u');
		const reg2 = new RegExp(characters.map(l => (l === '?' ? `\\${l}\\s` : `${l}\\s`)).join('|'), 'u');
		if (reg && reg2 && str.match(reg2)) {
			return str.replace((str.match(reg2) as any)[0], `${(str.match(reg) as any)[0]}\n`);
		}
	}

	return str;
}

export function breakEpisodeTitle(str: string) {
	if (!str) {
		return '';
	}

	return str.split('/').join('\\\n');
}

export function nearestValue(arr: number[], val: number): number {
	return arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val;
}

export function limitSentenceByCharacters(str: string, characters = 360) {
	if (!str) {
		return '';
	}
	const arr: any = str.substring(0, characters).split('.');
	arr.pop(arr.length);
	return `${arr.join('.')}.`;
}

export function lineBreakShowTitle(str: string, removeShow = false) {
	if (!str) {
		return '';
	}
	const ep = str.match(/S\d{2}E\d{2}/u);

	if (ep) {
		const arr = str.split(/\sS\d{2}E\d{2}\s/u);
		if (removeShow) {
			return `${ep[0]} ${arr[1]}`;
		}
		return `${arr[0]} \n${ep[0]} ${arr[1]}`;
	}

	return str;
}

export function getEdgeStyle(edgeStyle: EdgeStyle, opacity: number): string {
	switch (edgeStyle) {
		case 'depressed':
			return `1px 1px 2px ${parseColorToHex('black', opacity)}`;
		case 'dropShadow':
			return `2px 2px 4px ${parseColorToHex('black', opacity)}`;
		case 'raised':
			return `-1px -1px 2px ${parseColorToHex('black', opacity)}`;
		case 'uniform':
			return `0px 0px 4px ${parseColorToHex('black', opacity)}`;
		case 'textShadow':
			return `${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px, ${parseColorToHex('black', opacity)} 0px 0px 4px`;
		default:
			return '';
	}
}

export function parseColorToHex(color: string, opacity: number = 1): string {
	const ctx = document.createElement('canvas').getContext('2d');
	if (!ctx)
		return '#00000000';

	if (color.toLowerCase() === 'transparent') {
		return '#00000000';
	}

	// Handle named colors
	if (namedColors[color.toLowerCase()]) {
		return normalizeHex(namedColors[color.toLowerCase()], opacity);
	}

	// Handle other color formats
	ctx.fillStyle = color;
	const computedColor = ctx.fillStyle;

	// Convert RGB(A) to hex
	if (computedColor.startsWith('rgb')) {
		return rgbToHex(computedColor, opacity);
	}

	// Convert HSL(A) to hex
	if (computedColor.startsWith('hsl')) {
		return hslToHex(computedColor, opacity);
	}

	// Handle hex format
	if (/^#[0-9A-F]{3,8}$/i.test(computedColor)) {
		return normalizeHex(computedColor, opacity);
	}

	return computedColor;
}

export function rgbToHex(rgb: string, opacity: number): string {
	const match = rgb.match(/\d+/g);
	if (!match)
		return '#00000000';

	const [r, g, b] = match.map(Number);
	const a = Math.round(opacity * 255);
	return `#${r.toString(16).padStart(2, '0').toUpperCase()}`
		+ `${g.toString(16).padStart(2, '0').toUpperCase()}`
		+ `${b.toString(16).padStart(2, '0').toUpperCase()}`
		+ `${a.toString(16).padStart(2, '0').toUpperCase()}`;
}

export function hslToHex(hsl: string, opacity: number): string {
	const match = hsl.match(/\d+/g);
	if (!match || match.length < 3)
		return '#00000000';

	let [h, s, l] = match.map(Number);
	s /= 100;
	l /= 100;

	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255);

	const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
	return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}${alpha}`;
}

export function normalizeHex(hex: string, opacity: number): string {
	if (hex.length === 4) {
		hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase();
	}
	if (hex.length === 7) {
		const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
		return hex.toUpperCase() + alpha;
	}
	return hex.toUpperCase();
}

// Pre-compiled regexes and data for toTitleCase — module-level so they are
// created once and reused across all calls.
const _ttcWhitespaceRE = /^\s+$/u;
const _ttcHardBoundaryRE = /^[-\u2013\u2014:!?]$/u;
const _ttcApostropheRE = /^['\u2018\u2019]$/u;

const _ttcDelimiterRE = /(\s+|[\-\u2013\u2014:!?'\u2018\u2019])/u;
const _ttcDelimiterTestRE = /^(?:\s+|[-\u2013\u2014:!?'\u2018\u2019])$/u;
const _ttcContractionRE = /^(?:[stmd]|re|ve|ll|nt|em|[ny])$/iu;
// Matches roman numerals (I–MMMM) so they are preserved in full uppercase.
const _ttcRomanNumeralRE = /^(?=[MDCLXVI])M{0,4}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})$/iu;

// Articles, conjunctions and prepositions that stay lowercase per language.
// Stored as Sets for O(1) lookup. Unknown languages fall back to English.
const _ttcSmallWords: Readonly<Record<string, ReadonlySet<string>>> = {
	en: new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'as', 'at', 'by', 'from', 'in', 'into', 'near', 'of', 'on', 'onto', 'to', 'up', 'via', 'vs', 'with']),
	de: new Set(['der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'aber', 'f\u00FCr', 'von', 'zu', 'mit', 'an', 'auf', 'in', 'bei', 'nach', '\u00FCber', 'um', 'vor']),
	nl: new Set(['de', 'het', 'een', 'en', 'van', 'naar', 'op', 'door', 'voor', 'in', 'als', 'maar', 'of', 'bij', 'aan', 'om', 'uit', 'tot', 'met']),
	fr: new Set(['un', 'une', 'le', 'la', 'les', 'du', 'de', 'des', '\u00E0', 'au', 'aux', 'par', 'pour', 'dans', 'sur', 'et', 'ou', 'ni', 'comme', 'mais', 'car']),
	es: new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'y', 'e', 'o', 'u', 'para', 'por', 'en', 'con', 'sin', 'sobre', 'desde', 'hasta']),
	it: new Set(['il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'una', 'di', 'da', 'in', 'con', 'su', 'per', 'e', 'o', 'tra', 'fra', 'del', 'della', 'dello', 'degli', 'delle', 'al', 'alla', 'allo', 'agli', 'alle', 'dal', 'dalla', 'dallo', 'dagli', 'dalle', 'nel', 'nella', 'nello', 'negli', 'nelle', 'sul', 'sulla', 'sullo', 'sugli', 'sulle']),
	pt: new Set(['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'em', 'no', 'na', 'com', 'por', 'para', 'e', 'ou']),
	sv: new Set(['en', 'ett', 'och', 'men', 'eller', 'f\u00F6r', 'om', 'p\u00E5', 'i', 'av', 'till', 'fr\u00E5n', 'med', 'vid']),
	no: new Set(['en', 'et', 'og', 'men', 'eller', 'for', 'om', 'p\u00E5', 'i', 'av', 'til', 'fra', 'med', 'ved']),
	da: new Set(['en', 'et', 'og', 'men', 'eller', 'for', 'om', 'p\u00E5', 'i', 'af', 'til', 'fra', 'med', 'ved']),
	pl: new Set(['i', 'a', 'lub', 'albo', 'ale', 'lecz', 'oraz', '\u017Ce', 'do', 'od', 'na', 'po', 'przy', 'przez', 'za', 'ze', 'z', 'w', 'we']),
	ru: new Set(['\u0438', '\u0430', '\u043D\u043E', '\u0438\u043B\u0438', '\u0447\u0442\u043E', '\u0432', '\u043D\u0430', '\u0437\u0430', '\u043A', '\u043E\u0442', '\u0438\u0437', '\u043F\u043E', '\u0434\u043B\u044F', '\u043E', '\u043E\u0431']),
	tr: new Set(['ve', 'veya', 'ile', 'ama', 'fakat', 'gibi', 'i\u00E7in', 'bir']),
};

/**
 * Converts a string to title case with proper locale-aware casing.
 *
 * - Uses `toLocaleUpperCase` / `toLocaleLowerCase` so locale-specific rules
 *   (e.g. Turkish dotted-I, German ß→SS) are respected.
 * - Keeps language-appropriate articles, conjunctions and prepositions lowercase
 *   when they appear mid-phrase (O(1) Set lookup per language).
 * - Always capitalises the first and last token and any token that follows a
 *   hard boundary (colon, em-dash, en-dash, exclamation mark, question mark).
 * - Handles apostrophe elisions (l'homme, O'Brien) and contractions (don't, it's).
 *
 * @param str    - Input string.
 * @param locale - BCP-47 locale tag (defaults to `navigator.language`).
 */
export function toTitleCase(str: string, locale?: string): string {
	const resolvedLocale = locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en');
	const lang = resolvedLocale.split('-')[0].toLowerCase();
	// _ttcSmallWords is keyed by base language only; full-locale keys (e.g. "pt-BR") are
	// intentionally not stored because pt-BR and pt share the same article/preposition set.
	const smallWords = _ttcSmallWords[lang] ?? _ttcSmallWords.en;

	const tokens = str.split(_ttcDelimiterRE);

	// Scan backwards for the last word token (excludes whitespace and punctuation).
	let lastWordIndex = -1;
	for (let i = tokens.length - 1; i >= 0; i--) {
		if (tokens[i].length > 0 && !_ttcDelimiterTestRE.test(tokens[i])) {
			lastWordIndex = i;
			break;
		}
	}

	let capitaliseNext = true;
	let prevDelimiter: string | null = null;

	return tokens.map((token, i) => {
		// Empty token produced by adjacent delimiters — skip without side-effects.
		if (token.length === 0) {
			return token;
		}

		// Whitespace — pass through unchanged, clear delimiter context.
		if (_ttcWhitespaceRE.test(token)) {
			prevDelimiter = null;
			return token;
		}

		// Apostrophe — record but do NOT set capitaliseNext (keeps contractions lowercase).
		if (_ttcApostropheRE.test(token)) {
			prevDelimiter = token;
			return token;
		}

		// Hard sentence boundary — next real word must be capitalised.
		if (_ttcHardBoundaryRE.test(token)) {
			capitaliseNext = true;
			prevDelimiter = token;
			return token;
		}

		const lower = token.toLocaleLowerCase(resolvedLocale);
		const isFirst = capitaliseNext;
		const isLast = i === lastWordIndex;
		const afterApostrophe = prevDelimiter !== null && _ttcApostropheRE.test(prevDelimiter);

		capitaliseNext = false;
		prevDelimiter = null;

		// Contraction suffix after apostrophe (don't → Don't, it's → It's).
		if (afterApostrophe && _ttcContractionRE.test(lower)) {
			return lower;
		}

		if (!isFirst && !isLast && smallWords.has(lower)) {
			return lower;
		}

		// Roman numerals stay fully uppercase (VIII, XIV, etc.).
		// Checked after small-words so language articles (Italian "i") are kept lowercase.
		// length > 1 prevents false positives for single letters (e.g. "vitamin i").
		// The fast pre-check limits chars to [MDCLXVI] before running the full structural regex.
		if (lower.length > 1 && /^[mdclxvi]+$/iu.test(lower) && _ttcRomanNumeralRE.test(lower)) {
			return lower.toLocaleUpperCase(resolvedLocale);
		}

		// Capitalise the first grapheme (spread is Unicode-safe for multi-code-unit chars).
		const chars = [...lower];
		return chars[0].toLocaleUpperCase(resolvedLocale) + chars.slice(1).join('');
	}).join('');
}
