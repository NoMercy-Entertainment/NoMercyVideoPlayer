/**
 * Converts a given time in seconds or string format to a human-readable time format.
 * @param time - The time to convert, in seconds or string format.
 * @returns A string representing the time in the format "DD:HH:MM:SS".
 */
export declare const humanTime: (time: string | number) => string;
/**
 * Converts a time string in the format "hh:mm:ss" to seconds.
 * @param hms The time string to convert.
 * @returns The number of seconds represented by the time string.
 */
export declare const convertToSeconds: (hms: string | null) => number;
/**
 * Pads a number with leading zeros until it reaches the specified number of places.
 * @param number - The number to pad.
 * @param places - The number of places to pad the number to. Defaults to 2.
 * @returns The padded number as a string.
 */
export declare const pad: (number: string | number, places?: number) => string;
/**
 * Returns an array of unique objects based on a specified key.
 * @param array The array to filter.
 * @param key The key to use for uniqueness comparison.
 * @returns An array of unique objects.
 */
export declare const unique: <T>(array: T[], key: string) => T[];
/**
 * Breaks a logo title string into two lines by inserting a newline character after a specified set of characters.
 * @param str The logo title string to break.
 * @param characters An optional array of characters to break the string on. Defaults to [':', '!', '?'].
 * @returns The broken logo title string.
 */
export declare const breakLogoTitle: (str: string, characters?: string[]) => string;
export declare const breakEpisodeTitle: (str: string) => string;
export declare const nearestValue: (arr: any[], val: number) => any;
/**
 * Limits a sentence to a specified number of characters by truncating it at the last period before the limit.
 * @param str - The sentence to limit.
 * @param characters - The maximum number of characters to allow in the sentence.
 * @returns The truncated sentence.
 */
export declare const limitSentenceByCharacters: (str: string, characters?: number) => string;
/**
 * Adds a line break before the episode title in a TV show string.
 * @param str - The TV show string to modify.
 * @param removeShow - Whether to remove the TV show name from the modified string.
 * @returns The modified TV show string.
 */
export declare const lineBreakShowTitle: (str: string, removeShow?: boolean) => string;
