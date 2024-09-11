

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
