Standalone utility functions and constants exported from the package. Useful when building UI plugins and you need formatting, colour, or string helpers without going through the player instance.

## Import

```typescript
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
	normalizeHex,
	pad,
	parseColorToHex,
	rgbToHex,
	toTitleCase,
	unique,
} from '@nomercy-entertainment/nomercy-video-player';
```

All of these are also attached to the IIFE `window.nmplayer.*` global when using the browser script build.

---

## Table of Contents

- [Time Formatting](#time-formatting)
- [String Helpers](#string-helpers)
- [Array Helpers](#array-helpers)
- [Colour Helpers](#colour-helpers)
- [Title Casing](#title-casing)
- [Constants](#constants)

---

## Time Formatting

### `humanTime(time: string | number): string`

Converts a duration in seconds to a human-readable `HH:MM:SS` / `MM:SS` string. Days are included when the value is ≥ 86400 s.

```typescript
humanTime(0);      // "00:00"
humanTime(90);     // "01:30"
humanTime(3661);   // "01:01:01"
humanTime(90061);  // "1:01:01:01"
humanTime(NaN);    // "00:00"
```

**Parameters:**

- `time` — Duration in seconds (number or numeric string)

**Returns:** Formatted time string

---

### `convertToSeconds(hms: string | null): number`

Converts a `MM:SS` or `HH:MM:SS` timestamp string to a total number of seconds.

```typescript
convertToSeconds('01:30');    // 90
convertToSeconds('1:02:03');  // 3723
convertToSeconds(null);       // 0
convertToSeconds('');         // 0
```

**Parameters:**

- `hms` — Time string in `MM:SS` or `HH:MM:SS` format

**Returns:** Total seconds as a number

---

### `pad(number: string | number, places?: number): string`

Left-pads a number with zeros to the specified width.

```typescript
pad(5);       // "05"
pad(5, 4);    // "0005"
pad(100, 2);  // "100"  (no truncation)
```

**Parameters:**

- `number` — Value to pad
- `places` — Minimum width (default `2`)

**Returns:** Zero-padded string

---

## String Helpers

### `breakLogoTitle(str: string, characters?: string[]): string`

Inserts a line break after the first matching punctuation character (`: ! ?`) followed by a space. Useful for wrapping long show/movie titles in a logo or header.

```typescript
breakLogoTitle('Star Wars: A New Hope');   // "Star Wars:\nA New Hope"
breakLogoTitle('What? Something Else');    // "What?\nSomething Else"
breakLogoTitle('No Break Here');           // "No Break Here"
```

**Parameters:**

- `str` — Input title
- `characters` — Punctuation characters to break on (default `[':', '!', '?']`)

**Returns:** String with `\n` inserted, or the original string if no match

---

### `breakEpisodeTitle(str: string): string`

Replaces `/` with `\\\n`, splitting compound episode titles across lines.

```typescript
breakEpisodeTitle('Part 1/Part 2');  // "Part 1\\\nPart 2"
```

**Parameters:**

- `str` — Input string

**Returns:** String with slashes replaced by `\\\n`

---

### `limitSentenceByCharacters(str: string, characters?: number): string`

Truncates a string to the last complete sentence that fits within the character limit.

```typescript
limitSentenceByCharacters(
	'First sentence. Second sentence. Third very long sentence here.',
	40
);
// "First sentence. Second sentence."
```

**Parameters:**

- `str` — Input text
- `characters` — Maximum character count (default `360`)

**Returns:** Truncated string ending on a sentence boundary

---

### `lineBreakShowTitle(str: string, removeShow?: boolean): string`

Splits a show title that contains an episode code (`S01E02`) into two lines. Optionally strips the show name and returns only the episode code + title.

```typescript
lineBreakShowTitle('Breaking Bad S05E14 Ozymandias');
// "Breaking Bad \nS05E14 Ozymandias"

lineBreakShowTitle('Breaking Bad S05E14 Ozymandias', true);
// "S05E14 Ozymandias"
```

**Parameters:**

- `str` — Show title containing an `SxxExx` code
- `removeShow` — Remove the show name prefix (default `false`)

**Returns:** Reformatted string, or the original if no episode code is found

---

## Array Helpers

### `unique<T>(array: T[], key: string): T[]`

Removes duplicate objects from an array, keeping the first occurrence of each unique value at `key`.

```typescript
unique([{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }], 'id');
// [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
```

**Parameters:**

- `array` — Input array of objects
- `key` — Property name to deduplicate on

**Returns:** Deduplicated array. Returns `[]` for `null` / non-array input.

---

## Colour Helpers

These are primarily used for building subtitle style UIs. All functions return an 8-digit hex string (`#RRGGBBAA`).

### `parseColorToHex(color: string, opacity?: number): string`

Converts any CSS colour value (named colour, hex, `rgb()`, `hsl()`) to an `#RRGGBBAA` hex string.

```typescript
parseColorToHex('red', 1);          // "#FF0000FF"
parseColorToHex('transparent', 1);  // "#00000000"
parseColorToHex('#fff', 0.5);       // "#FFFFFF80"
```

**Parameters:**

- `color` — Any CSS colour string
- `opacity` — Alpha multiplier 0–1 (default `1`)

**Returns:** `#RRGGBBAA` hex string

---

### `rgbToHex(rgb: string, opacity: number): string`

Converts an `rgb(r, g, b)` string to `#RRGGBBAA`.

```typescript
rgbToHex('rgb(255, 0, 0)', 1);    // "#FF0000FF"
rgbToHex('rgb(0, 128, 255)', 0.5); // "#0080FF80"
```

---

### `hslToHex(hsl: string, opacity: number): string`

Converts an `hsl(h, s%, l%)` string to `#RRGGBBAA`.

```typescript
hslToHex('hsl(0, 100%, 50%)', 1);  // "#ff0000FF"
```

---

### `normalizeHex(hex: string, opacity: number): string`

Normalises a 3-, 6-, or 8-digit hex colour to a full uppercase 8-digit `#RRGGBBAA` string.

```typescript
normalizeHex('#F00', 1);       // "#FF0000FF"
normalizeHex('#FF0000', 0.5);  // "#FF000080"
normalizeHex('#ff0000ff', 1);  // "#FF0000FF"
```

---

### `getEdgeStyle(edgeStyle: EdgeStyle, opacity: number): string`

Returns a CSS `text-shadow` value for a given subtitle edge style.

```typescript
getEdgeStyle('dropShadow', 1);   // "2px 2px 4px #000000FF"
getEdgeStyle('uniform', 1);      // "0px 0px 4px #000000FF"
getEdgeStyle('none', 1);         // ""
```

**Parameters:**

- `edgeStyle` — One of `'none' | 'depressed' | 'dropShadow' | 'textShadow' | 'raised' | 'uniform'`
- `opacity` — Shadow alpha 0–1

**Returns:** CSS `text-shadow` string (empty string for `'none'`)

---

## Title Casing

### `toTitleCase(str: string, locale?: string): string`

Converts a string to title case with locale-aware capitalisation rules.

- Uses `toLocaleUpperCase` / `toLocaleLowerCase`, so locale-specific rules apply (e.g. Turkish dotted-İ, German ß→SS).
- Keeps language-appropriate articles, conjunctions and prepositions lowercase mid-phrase (English, German, Dutch, French, Spanish, Italian, Portuguese, Swedish, Norwegian, Danish, Polish, Russian, Turkish).
- Always capitalises the first word, the last word, and any word following a hard boundary (`:` `—` `–` `!` `?`).
- Handles apostrophe elisions (`l'homme`, `O'Brien`) and contractions (`don't`, `it's`).
- Preserves Roman numerals in full uppercase (`VIII`, `XIV`).

```typescript
toTitleCase('the lord of the rings', 'en');
// "The Lord of the Rings"

toTitleCase('star wars: a new hope', 'en');
// "Star Wars: A New Hope"

toTitleCase('henry viii and the crown', 'en');
// "Henry VIII and the Crown"

toTitleCase('don\'t look up', 'en');
// "Don't Look Up"

toTitleCase('la belle et la bête', 'fr');
// "La Belle et la Bête"

toTitleCase('der herr der ringe', 'de');
// "Der Herr der Ringe"
```

**Parameters:**

- `str` — Input string
- `locale` — BCP-47 locale tag, e.g. `'en'`, `'de'`, `'fr'` (defaults to `navigator.language`)

**Returns:** Title-cased string

---

## Constants

### `defaultSubtitleStyles`

The default `SubtitleStyle` object used when no custom style is configured.

```typescript
import type { SubtitleStyle } from '@nomercy-entertainment/nomercy-video-player';

const defaultSubtitleStyles: SubtitleStyle = {
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
```

---

### `edgeStyles`

Pre-built array of `{ name, value }` objects for rendering an edge-style picker.

```typescript
// [
//   { name: 'None',        value: 'none'       },
//   { name: 'Depressed',   value: 'depressed'  },
//   { name: 'Drop Shadow', value: 'dropShadow' },
//   { name: 'Text Shadow', value: 'textShadow' },
//   { name: 'Raised',      value: 'raised'     },
//   { name: 'Uniform',     value: 'uniform'    },
// ]
edgeStyles.forEach(({ name, value }) => {
	const option = document.createElement('option');
	option.textContent = name;
	option.value = value;
	select.appendChild(option);
});
```

---

### `fontFamilies`

Pre-built array of `{ name, value }` objects for rendering a font-family picker.

```typescript
// [
//   { name: 'ReithSans',   value: 'ReithSans, sans-serif'    },
//   { name: 'Arial',       value: 'Arial, sans-serif'        },
//   { name: 'Courier New', value: 'Courier New, monospace'   },
//   { name: 'Georgia',     value: 'Georgia, sans-serif'      },
//   { name: 'Verdana',     value: 'Verdana, sans-serif'      },
// ]
```

---

### `namedColors`

A `Record<string, string>` mapping 148 CSS named colours (e.g. `'red'`, `'cornflowerblue'`) to their 6-digit hex values. Used internally by `parseColorToHex` and exposed for completeness.

```typescript
namedColors.red;            // "#FF0000"
namedColors.cornflowerblue; // "#6495ED"
```
