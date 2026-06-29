// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Render official Fluent UI icons (from `./buttons.ts`) into SVG markup.
 *
 * Each icon is rendered as two stacked `<path>` elements (`icon-normal` +
 * `icon-hover`) toggled by CSS. Path data is pulled verbatim from the
 * `fluentIcons` table so nothing diverges from the canonical design system.
 */

import type { Icon } from './buttons';
import { fluentIcons } from './buttons';

export type IconName = keyof typeof fluentIcons;
export type IconEntry = Icon[string];

/**
 * Render a Fluent icon to an inline <svg> string with BOTH variants stacked
 *  as `<path class="icon-normal">` + `<path class="icon-hover">`. CSS
 *  toggles which path is visible on `:hover` and on `.btn-active` so every
 *  button inverts its fill state on hover. Honors the icon's declared `classes`
 *  for stroke-only glyphs (e.g. `chapterBack`/`chapterForward`).
 */
export function svgFromIcon(icon: IconEntry, size = 22): string {
	const isStroke = icon.classes?.includes('fill-none');
	const fillAttrs = isStroke
		? 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
		: 'fill="currentColor"';
	const hover = icon.hover ?? icon.normal;
	return `<svg viewBox="0 0 24 24" ${fillAttrs} width="${size}" height="${size}" aria-hidden="true"><path class="icon-normal" d="${icon.normal}"/><path class="icon-hover" d="${hover}"/></svg>`;
}

/** Convenience: render the icon at `name` from the official table. */
export function svgFromIconName(name: IconName, size = 22): string {
	return svgFromIcon(fluentIcons[name], size);
}

export { fluentIcons };
