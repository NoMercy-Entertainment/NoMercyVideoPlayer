/**
 * IIFE entry point — produces a single callable `window.nmplayer` global
 * with named exports (Plugin, KeyHandlerPlugin, OctopusPlugin, etc.)
 * attached as properties.
 *
 * ES/CJS/UMD builds use index.ts instead.
 */
import nmplayer from './index';
import { Base } from './player/base';
import { Logger } from './player/logger';
import PlayerStorage from './player/playerStorage';
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
} from './player/utils';
import KeyHandlerPlugin from './plugins/keyHandlerPlugin';
import OctopusPlugin from './plugins/octopusPlugin';
import Plugin from './plugins/plugin';

Object.assign(nmplayer, {
	Base,
	KeyHandlerPlugin,
	Logger,
	OctopusPlugin,
	PlayerStorage,
	Plugin,
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
});

export default nmplayer;
