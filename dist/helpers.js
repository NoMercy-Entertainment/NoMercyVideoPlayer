"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeHex = exports.hslToHex = exports.rgbToHex = exports.parseColorToHex = exports.namedColors = exports.defaultSubtitleStyles = exports.fontFamilies = exports.edgeStyles = exports.getEdgeStyle = exports.lineBreakShowTitle = exports.limitSentenceByCharacters = exports.nearestValue = exports.breakEpisodeTitle = exports.breakLogoTitle = exports.unique = exports.pad = exports.convertToSeconds = exports.humanTime = void 0;
/**
 * Converts a given time in seconds or string format to a human-readable time format.
 * @param time - The time to convert, in seconds or string format.
 * @returns A string representing the time in the format "DD:HH:MM:SS".
 */
const humanTime = (time) => {
    time = parseInt(time, 10);
    let days = parseInt(`${(time / (3600 * 24))}`, 10);
    let hours = (0, exports.pad)(parseInt(`${(time % 86400) / 3600}`, 10), 2);
    let minutes = (0, exports.pad)(parseInt(`${(time % 3600) / 60}`, 10), 2);
    let seconds = (0, exports.pad)(parseInt(`${time % 60}`, 10), 2);
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
    if (hours == '00:' && days == '') {
        hours = '';
    }
    const current = days + hours + minutes + seconds;
    return current.replace('NaN:NaN:NaN:NaN', '00:00');
};
exports.humanTime = humanTime;
/**
 * Converts a time string in the format "hh:mm:ss" to seconds.
 * @param hms The time string to convert.
 * @returns The number of seconds represented by the time string.
 */
const convertToSeconds = (hms) => {
    if (!hms) {
        return 0;
    }
    const a = hms.split(':').map(n => parseInt(n, 10));
    if (a.length < 3) {
        a.unshift(0);
    }
    return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
};
exports.convertToSeconds = convertToSeconds;
/**
 * Pads a number with leading zeros until it reaches the specified number of places.
 * @param number - The number to pad.
 * @param places - The number of places to pad the number to. Defaults to 2.
 * @returns The padded number as a string.
 */
const pad = (number, places = 2) => {
    if (typeof number !== 'undefined') {
        const zero = places - number.toString().length + 1;
        return Array(+(zero > 0 && zero)).join('0') + number;
    }
    return '';
};
exports.pad = pad;
/**
 * Returns an array of unique objects based on a specified key.
 * @param array The array to filter.
 * @param key The key to use for uniqueness comparison.
 * @returns An array of unique objects.
 */
const unique = (array, key) => {
    if (!array || !Array.isArray(array)) {
        return [];
    }
    return array.filter((obj, pos, arr) => arr
        .map((mapObj) => mapObj[key]).indexOf(obj[key]) === pos);
};
exports.unique = unique;
/**
 * Breaks a logo title string into two lines by inserting a newline character after a specified set of characters.
 * @param str The logo title string to break.
 * @param characters An optional array of characters to break the string on. Defaults to [':', '!', '?'].
 * @returns The broken logo title string.
 */
const breakLogoTitle = (str, characters = [':', '!', '?']) => {
    if (!str) {
        return '';
    }
    if (str.split('').some((l) => characters.includes(l))) {
        const reg = new RegExp(characters.map(l => (l == '?' ? `\\${l}` : l)).join('|'), 'u');
        const reg2 = new RegExp(characters.map(l => (l == '?' ? `\\${l}\\s` : `${l}\\s`)).join('|'), 'u');
        if (reg && reg2 && str.match(reg2)) {
            return str.replace(str.match(reg2)[0], `${str.match(reg)[0]}\n`);
        }
    }
    return str;
};
exports.breakLogoTitle = breakLogoTitle;
const breakEpisodeTitle = (str) => {
    if (!str) {
        return '';
    }
    return str.split('/').join('\\\n');
};
exports.breakEpisodeTitle = breakEpisodeTitle;
const nearestValue = (arr, val) => {
    return arr.reduce((p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p), Infinity) + val;
};
exports.nearestValue = nearestValue;
/**
 * Limits a sentence to a specified number of characters by truncating it at the last period before the limit.
 * @param str - The sentence to limit.
 * @param characters - The maximum number of characters to allow in the sentence.
 * @returns The truncated sentence.
 */
const limitSentenceByCharacters = (str, characters = 360) => {
    if (!str) {
        return '';
    }
    const arr = str.substring(0, characters).split('.');
    arr.pop(arr.length);
    return `${arr.join('.')}.`;
};
exports.limitSentenceByCharacters = limitSentenceByCharacters;
/**
 * Adds a line break before the episode title in a TV show string.
 * @param str - The TV show string to modify.
 * @param removeShow - Whether to remove the TV show name from the modified string.
 * @returns The modified TV show string.
 */
const lineBreakShowTitle = (str, removeShow = false) => {
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
exports.lineBreakShowTitle = lineBreakShowTitle;
const getEdgeStyle = (edgeStyle, opacity) => {
    switch (edgeStyle) {
        case 'depressed':
            return `1px 1px 2px ${(0, exports.parseColorToHex)('black', opacity)}`;
        case 'dropShadow':
            return `2px 2px 4px ${(0, exports.parseColorToHex)('black', opacity)}`;
        case 'raised':
            return `-1px -1px 2px ${(0, exports.parseColorToHex)('black', opacity)}`;
        case 'uniform':
            return `0px 0px 4px ${(0, exports.parseColorToHex)('black', opacity)}`;
        case 'textShadow':
            return `${(0, exports.parseColorToHex)('black', opacity)} 0px 0px 4px, ${(0, exports.parseColorToHex)('black', opacity)} 0px 0px 4px, ${(0, exports.parseColorToHex)('black', opacity)} 0px 0px 4px, ${(0, exports.parseColorToHex)('black', opacity)} 0px 0px 4px, ${(0, exports.parseColorToHex)('black', opacity)} 0px 0px 4px, ${(0, exports.parseColorToHex)('black', opacity)} 0px 0px 4px, ${(0, exports.parseColorToHex)('black', opacity)} 0px 0px 4px`;
        default:
            return '';
    }
};
exports.getEdgeStyle = getEdgeStyle;
exports.edgeStyles = [
    { name: 'None', value: 'none' },
    { name: 'Depressed', value: 'depressed' },
    { name: 'Drop Shadow', value: 'dropShadow' },
    { name: 'Text Shadow', value: 'textShadow' },
    { name: 'Raised', value: 'raised' },
    { name: 'Uniform', value: 'uniform' }
];
exports.fontFamilies = [
    { name: 'ReithSans', value: 'ReithSans, sans-serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Georgia', value: 'Georgia, sans-serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
];
exports.defaultSubtitleStyles = {
    fontSize: 100,
    fontFamily: 'ReithSans, sans-serif',
    textColor: 'white',
    textOpacity: 100,
    backgroundColor: 'black',
    backgroundOpacity: 0,
    edgeStyle: 'textShadow',
    areaColor: 'black',
    windowOpacity: 0
};
exports.namedColors = {
    "aliceblue": "#F0F8FF",
    "antiquewhite": "#FAEBD7",
    "aquamarine": "#7FFFD4",
    "azure": "#F0FFFF",
    "beige": "#F5F5DC",
    "bisque": "#FFE4C4",
    "black": "#000000",
    "blanchedalmond": "#FFEBCD",
    "blue": "#0000FF",
    "blueviolet": "#8A2BE2",
    "brown": "#A52A2A",
    "burlywood": "#DEB887",
    "cadetblue": "#5F9EA0",
    "chartreuse": "#7FFF00",
    "chocolate": "#D2691E",
    "coral": "#FF7F50",
    "cornflowerblue": "#6495ED",
    "cornsilk": "#FFF8DC",
    "crimson": "#DC143C",
    "cyan": "#00FFFF",
    "darkblue": "#00008B",
    "darkcyan": "#008B8B",
    "darkgoldenrod": "#B8860B",
    "darkgray": "#A9A9A9",
    "darkgreen": "#006400",
    "darkkhaki": "#BDB76B",
    "darkmagenta": "#8B008B",
    "darkolivegreen": "#556B2F",
    "darkorange": "#FF8C00",
    "darkorchid": "#9932CC",
    "darkred": "#8B0000",
    "darksalmon": "#E9967A",
    "darkseagreen": "#8FBC8F",
    "darkslateblue": "#483D8B",
    "darkslategray": "#2F4F4F",
    "darkturquoise": "#00CED1",
    "darkviolet": "#9400D3",
    "deeppink": "#FF1493",
    "deepskyblue": "#00BFFF",
    "dimgray": "#696969",
    "dodgerblue": "#1E90FF",
    "firebrick": "#B22222",
    "floralwhite": "#FFFAF0",
    "forestgreen": "#228B22",
    "fuchsia": "#FF00FF",
    "gainsboro": "#DCDCDC",
    "ghostwhite": "#F8F8FF",
    "gold": "#FFD700",
    "goldenrod": "#DAA520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#ADFF2F",
    "honeydew": "#F0FFF0",
    "hotpink": "#FF69B4",
    "indianred": "#CD5C5C",
    "indigo": "#4B0082",
    "ivory": "#FFFFF0",
    "khaki": "#F0E68C",
    "lavender": "#E6E6FA",
    "lavenderblush": "#FFF0F5",
    "lawngreen": "#7CFC00",
    "lemonchiffon": "#FFFACD",
    "lightblue": "#ADD8E6",
    "lightcoral": "#F08080",
    "lightcyan": "#E0FFFF",
    "lightgoldenrodyellow": "#FAFAD2",
    "lightgray": "#D3D3D3",
    "lightgreen": "#90EE90",
    "lightpink": "#FFB6C1",
    "lightsalmon": "#FFA07A",
    "lightseagreen": "#20B2AA",
    "lightskyblue": "#87CEFA",
    "lightslategray": "#778899",
    "lightsteelblue": "#B0C4DE",
    "lightyellow": "#FFFFE0",
    "lime": "#00FF00",
    "limegreen": "#32CD32",
    "linen": "#FAF0E6",
    "magenta": "#FF00FF",
    "maroon": "#800000",
    "mediumaquamarine": "#66CDAA",
    "mediumblue": "#0000CD",
    "mediumorchid": "#BA55D3",
    "mediumpurple": "#9370DB",
    "mediumseagreen": "#3CB371",
    "mediumslateblue": "#7B68EE",
    "mediumspringgreen": "#00FA9A",
    "mediumturquoise": "#48D1CC",
    "mediumvioletred": "#C71585",
    "midnightblue": "#191970",
    "mintcream": "#F5FFFA",
    "mistyrose": "#FFE4E1",
    "moccasin": "#FFE4B5",
    "navajowhite": "#FFDEAD",
    "navy": "#000080",
    "oldlace": "#FDF5E6",
    "olive": "#808000",
    "olivedrab": "#6B8E23",
    "orange": "#FFA500",
    "orangered": "#FF4500",
    "orchid": "#DA70D6",
    "palegoldenrod": "#EEE8AA",
    "palegreen": "#98FB98",
    "paleturquoise": "#AFEEEE",
    "palevioletred": "#DB7093",
    "papayawhip": "#FFEFD5",
    "peachpuff": "#FFDAB9",
    "peru": "#CD853F",
    "pink": "#FFC0CB",
    "plum": "#DDA0DD",
    "powderblue": "#B0E0E6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#FF0000",
    "rosybrown": "#BC8F8F",
    "royalblue": "#4169E1",
    "saddlebrown": "#8B4513",
    "salmon": "#FA8072",
    "sandybrown": "#F4A460",
    "seagreen": "#2E8B57",
    "seashell": "#FFF5EE",
    "sienna": "#A0522D",
    "silver": "#C0C0C0",
    "skyblue": "#87CEEB",
    "slateblue": "#6A5ACD",
    "slategray": "#708090",
    "snow": "#FFFAFA",
    "springgreen": "#00FF7F",
    "steelblue": "#4682B4",
    "tan": "#D2B48C",
    "teal": "#008080",
    "thistle": "#D8BFD8",
    "tomato": "#FF6347",
    "turquoise": "#40E0D0",
    "violet": "#EE82EE",
    "wheat": "#F5DEB3",
    "white": "#FFFFFF",
    "whitesmoke": "#F5F5F5",
    "yellow": "#FFFF00",
    "yellowgreen": "#9ACD32"
};
const parseColorToHex = (color, opacity = 1) => {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx)
        return "#00000000";
    if (color.toLowerCase() === "transparent") {
        return "#00000000";
    }
    // Handle named colors
    if (exports.namedColors[color.toLowerCase()]) {
        return (0, exports.normalizeHex)(exports.namedColors[color.toLowerCase()], opacity);
    }
    // Handle other color formats
    ctx.fillStyle = color;
    const computedColor = ctx.fillStyle;
    // Convert RGB(A) to hex
    if (computedColor.startsWith("rgb")) {
        return (0, exports.rgbToHex)(computedColor, opacity);
    }
    // Convert HSL(A) to hex
    if (computedColor.startsWith("hsl")) {
        return (0, exports.hslToHex)(computedColor, opacity);
    }
    // Handle hex format
    if (/^#[0-9A-Fa-f]{3,8}$/.test(computedColor)) {
        return (0, exports.normalizeHex)(computedColor, opacity);
    }
    return computedColor;
};
exports.parseColorToHex = parseColorToHex;
const rgbToHex = (rgb, opacity) => {
    const match = rgb.match(/\d+/g);
    if (!match)
        return "#00000000";
    const [r, g, b] = match.map(Number);
    const a = Math.round(opacity * 255);
    return `#${r.toString(16).padStart(2, '0').toUpperCase()}` +
        `${g.toString(16).padStart(2, '0').toUpperCase()}` +
        `${b.toString(16).padStart(2, '0').toUpperCase()}` +
        `${a.toString(16).padStart(2, '0').toUpperCase()}`;
};
exports.rgbToHex = rgbToHex;
const hslToHex = (hsl, opacity) => {
    const match = hsl.match(/\d+/g);
    if (!match || match.length < 3)
        return "#00000000";
    let [h, s, l] = match.map(Number);
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255);
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
    return `#${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}${alpha}`;
};
exports.hslToHex = hslToHex;
const normalizeHex = (hex, opacity) => {
    if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase();
    }
    if (hex.length === 7) {
        const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
        return hex.toUpperCase() + alpha;
    }
    return hex.toUpperCase();
};
exports.normalizeHex = normalizeHex;
