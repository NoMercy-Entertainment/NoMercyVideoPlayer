// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * render-parity-export.spec.ts
 *
 * Writes down what the web chrome actually renders, so the native ports can be
 * checked against it by a machine instead of by looking at two screenshots.
 *
 * A picture comparison answers "do these look similar", which is the question
 * nobody disagreed about. The question that has actually gone wrong here is
 * narrower and checkable: WHICH controls, in WHAT order, VISIBLE at what width.
 * That is a list, and a list can be diffed.
 *
 * This spec asserts nothing about the native side — it cannot see it. It
 * exports; `scripts/check-render-parity.py` does the comparing. Splitting it
 * that way is deliberate: the export has to run in a browser, and the check has
 * to run somewhere the Kotlin is, and a single thing that needed both would run
 * in neither CI job.
 *
 * The widths are the breakpoints the web's own responsive rules name, not
 * device sizes. A device list would go stale; the breakpoints are the contract.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { expect, test } from '@playwright/test';

// The web's own breakpoints, from responsive.ts. Sampled one pixel below each
// boundary and one above the last, because a rule that fires at "≤ 480" and a
// rule that fires at "< 480" render identically at 479 and differently at 480 —
// and off-by-one on a breakpoint is exactly the kind of divergence that never
// shows up in a screenshot taken at a round number.
const WIDTHS = [320, 321, 480, 481, 720, 721, 1024, 1025, 1440];

const OUTPUT = resolve(process.cwd(), 'reports/render-parity/web-controls.json');

interface ControlRow {
	id: string;
	visible: boolean;
	disabled: boolean;
	contentHidden: boolean;
	x: number;
}

test('export what the web chrome renders at each breakpoint', async ({ page }) => {
	await page.goto('/e2e/fixture-full.html');
	await page.waitForFunction(() => (window as any).__playerReady === true, { timeout: 10_000 });

	// __playerReady means "constructed", not "mounted". The fixture registers
	// plugins and stops; the chrome is built by setup(), so without this the
	// container has zero children and every control reads as absent. The first
	// run of this export found nothing at all and still passed.
	await page.evaluate(() => {
		(window as any).player.setup({
			playlist: [{ id: 'render-parity', file: '/e2e/media/sample.mp4' }],
			muted: true,
			autoPlay: false,
		});
	});
	await page.waitForSelector('.overlay', { timeout: 5_000 });
	await page.waitForTimeout(500);

	const byWidth: Record<string, ControlRow[]> = {};

	// Landscape at every width, and portrait sampled separately below.
	//
	// A fixed viewport height made every width at or under it PORTRAIT, and
	// PORTRAIT_HIDDEN contains previous and next — so the export showed those
	// two appearing at 721 and read as a width rule with a step in it. There is
	// no such step. Orientation was the variable being measured, and width was
	// along for the ride.
	for (const width of WIDTHS) {
		await page.setViewportSize({ width, height: Math.round((width * 9) / 16) });

		// The player is a fixed-size div in the fixture, so it has to be told to
		// fill the viewport or every width samples the same 640px layout — which
		// would produce nine identical rows and read as "responsive rules match".
		await page.evaluate((w) => {
			const el = document.getElementById('player');
			if (el) {
				el.style.width = `${w}px`;
				el.style.height = `${Math.round((w * 9) / 16)}px`;
			}
			window.dispatchEvent(new Event('resize'));
		}, width);

		// The bar composes on a ResizeObserver, which fires after layout. Reading
		// straight after the resize samples the previous width's DOM.
		await page.waitForTimeout(250);

		byWidth[String(width)] = await readControls(page);
	}

	async function readControls(page: import('@playwright/test').Page): Promise<ControlRow[]> {
		return page.evaluate(() => {
			// The priority list names an OPTION KEY; the DOM uses a different id
			// for most of them, and for one there is no element at all. Guessing
			// that the two agreed made seven of nineteen controls read as absent
			// and the export still passed, because an empty list compares equal to
			// every other empty list.
			//
			// The `mute`/`volume` pair is the trap. `initButtonMap` maps `mute`
			// to the volume ELEMENT and `volume` to nothing at all: the web
			// folds muting into the volume button, and the `volume` key is a
			// rank with no control behind it.
			//
			// So a native port drawing a separate mute control has invented
			// one, and `mute` is ranked SECOND — high enough to survive the
			// narrowest bar. Reading the pair the other way round, which is the
			// way the names suggest, mislabels both rows in this export.
			const names: Array<[string, string | null]> = [
				['play', 'playback'],
				['mute', 'volume'],
				['volume', null],
				['fullscreen', 'fullscreen'],
				['settings', 'settings'],
				['next', 'next'],
				['previous', 'previous'],
				['chapterPrev', 'chapter-back'],
				['chapterNext', 'chapter-forward'],
				['seekBack', 'seek-back'],
				['seekForward', 'seek-forward'],
				['theater', 'theater'],
				['pip', 'pip'],
				['speed', 'speed'],
				['quality', 'quality'],
				['subtitles', 'subtitles'],
				['audio', 'audio'],
				['aspectRatio', 'aspect-ratio'],
				['playlist', 'playlist'],
			];

			return names.flatMap(([name, domId]) => {
				const el = domId === null ? null : document.getElementById(domId);
				if (!el) return [{ id: name, visible: false, disabled: false, contentHidden: false, x: -1 }];

				const box = el.getBoundingClientRect();
				return [{
					id: name,
					// Geometry, not the class list. A control can carry every
					// "visible" class it owns and still be laid out at zero width
					// inside a collapsed container, and the viewer sees the
					// geometry.
					visible: box.width > 0 && box.height > 0 && !el.hasAttribute('hidden'),
					disabled: el.hasAttribute('disabled'),
					contentHidden: el.dataset.contentHidden === 'true',
					// Kept so ORDER is compared by where things actually are,
					// rather than by DOM sequence — the two disagree the moment
					// anything uses flex `order`.
					x: Math.round(box.x),
				}];
			});
		});
	}

	// One portrait sample, wide enough that nothing is dropped for want of room,
	// so the row records the orientation rule on its own rather than tangled
	// with the fit rule.
	await page.setViewportSize({ width: 900, height: 1600 });
	await page.evaluate(() => {
		const el = document.getElementById('player');
		if (el) {
			el.style.width = '900px';
			el.style.height = '1600px';
		}
		window.dispatchEvent(new Event('resize'));
	});
	await page.waitForTimeout(250);
	byWidth['900-portrait'] = await readControls(page);

	// An export that found nothing is not an export. Every list here would be
	// empty, every comparison against it would pass, and the gate downstream
	// would be decoration — which is exactly what happened when this selected on
	// a data attribute the chrome does not write.
	for (const [width, rows] of Object.entries(byWidth)) {
		expect(
			rows.length,
			`no controls found at ${width}px — the chrome did not mount, or its ids changed`,
		).toBeGreaterThan(0);
	}

	mkdirSync(dirname(OUTPUT), { recursive: true });
	writeFileSync(OUTPUT, `${JSON.stringify(byWidth, null, '\t')}\n`, 'utf8');
});
