

/**
 * Converts a given time in seconds or string format to a human-readable time format.
 * @param time - The time to convert, in seconds or string format.
 * @returns A string representing the time in the format "DD:HH:MM:SS".
 */
export const humanTime = (time: string | number) => {
	time = parseInt(time as string, 10);

	let days: any = parseInt(`${(time / (3600 * 24))}`, 10);
	let hours: any = pad(parseInt(`${(time % 86400) / 3600}`, 10), 2);
	let minutes: any = pad(parseInt(`${(time % 3600) / 60}`, 10), 2);
	let seconds: any = pad(parseInt(`${time % 60}`, 10), 2);

	if (`${minutes}`.length === 1) {
		minutes = `0${minutes}`;
	}
	if (`${seconds}`.length === 1) {
		seconds = `0${seconds}`;
	}
	if (days === 0) {
		days = '';
	} else {
		days = `${days}:`;
	}
	if (hours === 0) {
		hours = '00:';
	} else {
		hours = `${hours}:`;
	}
	if (minutes === 0) {
		minutes = '00:';
	} else {
		minutes = `${minutes}:`;
	}
	if (hours == '00:' && days == '') {
		hours = '';
	}
	const current = days + hours + minutes + seconds;
	return current.replace('NaN:NaN:NaN:NaN', '00:00');
};

/**
 * Converts a time string in the format "hh:mm:ss" to seconds.
 * @param hms The time string to convert.
 * @returns The number of seconds represented by the time string.
 */
export const convertToSeconds = (hms: string | null) => {
	if (!hms) {
		return 0;
	}
	const a: number[] = hms.split(':').map(n => parseInt(n, 10));
	if (a.length < 3) {
		a.unshift(0);
	}

	return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
};

/**
 * Pads a number with leading zeros until it reaches the specified number of places.
 * @param number - The number to pad.
 * @param places - The number of places to pad the number to. Defaults to 2.
 * @returns The padded number as a string.
 */
export const pad = (number: string | number, places = 2) => {
	if (typeof number !== 'undefined') {
		const zero = places - number.toString().length + 1;

		return Array(+(zero > 0 && zero)).join('0') + number;
	}
	return '';
};

/**
 * Returns an array of unique objects based on a specified key.
 * @param array The array to filter.
 * @param key The key to use for uniqueness comparison.
 * @returns An array of unique objects.
 */
export const unique = <T>(array: T[], key: string): T[] => {
	if (!array || !Array.isArray(array)) {
		return [];
	}

	return array.filter((obj: any, pos, arr) => arr
		.map((mapObj: any) => mapObj[key]).indexOf(obj[key]) === pos);
};

/**
 * Breaks a logo title string into two lines by inserting a newline character after a specified set of characters.
 * @param str The logo title string to break.
 * @param characters An optional array of characters to break the string on. Defaults to [':', '!', '?'].
 * @returns The broken logo title string.
 */
export const breakLogoTitle = (str: string, characters = [':', '!', '?']) => {
	if (!str) {
		return '';
	}

	if (str.split('').some((l: string) => characters.includes(l))) {
		const reg = new RegExp(characters.map(l => (l == '?' ? `\\${l}` : l)).join('|'), 'u');
		const reg2 = new RegExp(characters.map(l => (l == '?' ? `\\${l}\\s` : `${l}\\s`)).join('|'), 'u');
		if (reg && reg2 && str.match(reg2)) {
			return str.replace((str.match(reg2) as any)[0], `${(str.match(reg) as any)[0]}\n`);
		}
	}

	return str;
};

export const nearestValue = (arr: any[], val: number) => {
	return arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val;
};

/**
 * Limits a sentence to a specified number of characters by truncating it at the last period before the limit.
 * @param str - The sentence to limit.
 * @param characters - The maximum number of characters to allow in the sentence.
 * @returns The truncated sentence.
 */
export const limitSentenceByCharacters = (str: string, characters = 360) => {
	if (!str) {
		return '';
	}
	const arr: any = str.substring(0, characters).split('.');
	arr.pop(arr.length);
	return `${arr.join('.')}.`;
};

/**
 * Adds a line break before the episode title in a TV show string.
 * @param str - The TV show string to modify.
 * @param removeShow - Whether to remove the TV show name from the modified string.
 * @returns The modified TV show string.
 */
export const lineBreakShowTitle = (str: string, removeShow = false) =>{
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
};
