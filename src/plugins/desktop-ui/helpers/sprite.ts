// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Sprite thumbnail loader for the slider-pop preview.
 *
 * Parses a sprite VTT (cue body = `image.webp#xywh=x,y,w,h`), preloads
 * the sprite image, and exposes a `lookup(time)` that returns the cue
 * covering that time.
 */

import { parseVttSprite } from '@nomercy-entertainment/nomercy-player-core';

export interface SpriteCue {
	start: number;
	end: number;
	url: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface SpriteSet {
	cues: SpriteCue[];
	/** Sprite image URL — same for every cue in NoMercy's tooling. */
	spriteUrl: string;
}

/**
 * Parse a sprite VTT into cues. Delegates parsing to core's `parseVttSprite`,
 * then maps the `CueList<VTTSpritePayload>` output to the flat `SpriteCue[]`
 * shape the sprite renderer expects.
 *
 * `baseUrl` is the URL of the VTT file itself — used to resolve relative sprite
 * image paths.
 */
export function parseSpriteVtt(text: string, baseUrl: string): SpriteCue[] {
	const result = parseVttSprite(text, baseUrl);

	return result.cues.map(cue => ({
		start: cue.start,
		end: cue.end,
		url: cue.payload.url,
		x: cue.payload.x,
		y: cue.payload.y,
		w: cue.payload.w,
		h: cue.payload.h,
	}));
}

/**
 * Pluggable transports for sprite loading. Auth-protected backends route both
 * requests through the plugin's authenticated fetch — a bare `fetch` / `Image`
 * src can't carry an `Authorization` header.
 */
export interface SpriteFetchers {
	/** Fetch the VTT body. Return `null` on failure. */
	fetchText?: (url: string) => Promise<string | null>;
	/**
	 * Resolve the sprite image to a paintable URL (typically a `blob:` URL
	 * created from an authenticated download). Return `null` to fall back to
	 * the raw URL.
	 */
	fetchImageUrl?: (url: string) => Promise<string | null>;
}

async function defaultFetchText(url: string): Promise<string | null> {
	const response = await fetch(url);
	if (!response.ok)
		return null;
	return response.text();
}

/** Preload so the first hover paints instantly. Resolves on error too. */
function preloadImage(url: string): Promise<void> {
	return new Promise<void>((resolve) => {
		const img = new Image();
		img.onload = () => resolve();
		img.onerror = () => resolve();
		img.src = url;
	});
}

/** Load + parse a sprite VTT, then preload its sprite image. */
export async function loadSpriteSet(vttUrl: string, fetchers?: SpriteFetchers): Promise<SpriteSet | null> {
	try {
		const text = fetchers?.fetchText
			? await fetchers.fetchText(vttUrl)
			: await defaultFetchText(vttUrl);
		if (!text)
			return null;
		const cues = parseSpriteVtt(text, vttUrl);
		if (cues.length === 0)
			return null;
		const rawUrl = cues[0]!.url;
		const resolvedUrl = fetchers?.fetchImageUrl ? await fetchers.fetchImageUrl(rawUrl) : null;
		const spriteUrl = resolvedUrl ?? rawUrl;
		await preloadImage(spriteUrl);
		return { cues, spriteUrl };
	}
	catch {
		return null;
	}
}

/**
 * Find the cue whose [start, end) covers the given time, or the last
 *  cue if time falls past the end of the table.
 */
export function lookupCue(set: SpriteSet, time: number): SpriteCue | null {
	if (set.cues.length === 0)
		return null;
	const found = set.cues.find(c => time >= c.start && time < c.end);
	return found ?? set.cues.at(-1) ?? null;
}

// ── Slider-pop paint helpers ───────────────────────────────────────────────────

/**
 * Compute the scrub time from a pointer/touch event relative to a slider bar.
 * Returns both the bar-relative percentage (0–100) and the player time (seconds).
 */
export function getScrubTime(
	e: Event,
	sliderBar: HTMLDivElement,
	duration: number,
): { scrubTime: number; scrubTimePlayer: number } {
	const rect = sliderBar.getBoundingClientRect();
	const me = e as MouseEvent;
	const te = e as TouchEvent;
	const x = me.clientX ?? te.touches?.[0]?.clientX ?? te.changedTouches?.[0]?.clientX ?? 0;
	let offsetX = x - rect.left;
	if (offsetX <= 0)
		offsetX = 0;
	if (offsetX >= rect.width)
		offsetX = rect.width;
	return {
		scrubTime: rect.width > 0 ? (offsetX / rect.width) * 100 : 0,
		scrubTimePlayer: rect.width > 0 ? (offsetX / rect.width) * duration : 0,
	};
}

/**
 * Clamp a slider-pop horizontal offset (%) so the pop bubble stays fully
 * inside the slider-bar bounds.
 */
export function clampPopOffset(
	pct: number,
	sliderPop: HTMLDivElement,
	sliderBar: HTMLDivElement,
): number {
	const popWidthPct = (sliderPop.offsetWidth / Math.max(1, sliderBar.offsetWidth)) * 100;
	const half = popWidthPct / 2;
	return Math.max(half, Math.min(100 - half, pct));
}

/** Paint the sprite thumbnail cue into `sliderPopImage` for the given time. */
export function paintSpriteAt(
	time: number,
	spriteSet: SpriteSet | null,
	sliderPopImage: HTMLDivElement,
): void {
	if (!spriteSet)
		return;
	const cue = lookupCue(spriteSet, time);
	if (!cue)
		return;
	sliderPopImage.style.backgroundPosition = `-${cue.x}px -${cue.y}px`;
	sliderPopImage.style.width = `${cue.w}px`;
	sliderPopImage.style.height = `${cue.h}px`;
}

/**
 * Resolve the sprite VTT URL from a playlist item.
 * Checks the typed `previewSpriteUrl` field first, then falls back to a
 * legacy `tracks[].kind === 'thumbnails'` sidecar entry.
 */
export function resolveSpriteUrl(item: unknown): string | undefined {
	if (!item || typeof item !== 'object')
		return undefined;
	const rec = item as Record<string, unknown>;

	if (typeof rec.previewSpriteUrl === 'string' && rec.previewSpriteUrl)
		return rec.previewSpriteUrl;

	if (!Array.isArray(rec.tracks))
		return undefined;
	const tracks = rec.tracks as Array<Record<string, unknown>>;
	const thumbs = tracks.find(t => t?.kind === 'thumbnails' && typeof t.file === 'string');
	return typeof thumbs?.file === 'string' ? thumbs.file : undefined;
}
