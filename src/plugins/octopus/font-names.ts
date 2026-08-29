// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/** SFNT `name` table IDs libass can be asked for by an ASS `Fontname`. */
const NAME_IDS = new Set([1, 4, 16]);

const TTC_TAG = 0x74746366; // 'ttcf'

function decodeNameRecord(bytes: Uint8Array, platformId: number): string {
	// Platform 3 (Windows) and platform 0 (Unicode) store UTF-16BE; platform 1
	// (Macintosh) stores single-byte Roman. Some releases mislabel a UTF-16BE
	// string as platform 1, which decodes to "P i x e l a d e" — the NUL-padded
	// form. Stripping NULs recovers the real family name either way.
	const decoder = new TextDecoder(platformId === 1 ? 'windows-1252' : 'utf-16be');
	return decoder.decode(bytes).replace(/\0/gu, '').trim();
}

function readTableDirectory(view: DataView, offset: number): number | null {
	const tableCount = view.getUint16(offset + 4);
	for (let i = 0; i < tableCount; i++) {
		const record = offset + 12 + i * 16;
		const tag = view.getUint32(record);
		if (tag === 0x6E616D65) // 'name'
			return view.getUint32(record + 8);
	}
	return null;
}

function collectFromNameTable(view: DataView, bytes: Uint8Array, nameOffset: number, out: Set<string>): void {
	const recordCount = view.getUint16(nameOffset + 2);
	const stringOffset = nameOffset + view.getUint16(nameOffset + 4);

	for (let i = 0; i < recordCount; i++) {
		const record = nameOffset + 6 + i * 12;
		const nameId = view.getUint16(record + 6);
		if (!NAME_IDS.has(nameId))
			continue;

		const platformId = view.getUint16(record);
		const length = view.getUint16(record + 8);
		const offset = stringOffset + view.getUint16(record + 10);
		if (offset + length > bytes.length)
			continue;

		const value = decodeNameRecord(bytes.subarray(offset, offset + length), platformId);
		if (value)
			out.add(value.toLowerCase());
	}
}

/**
 * Reads every family / full name a font declares, lowercased.
 *
 * libass resolves an ASS `Fontname` against the name the font declares
 * internally, never against its filename — `Gandhisans-Bold.otf` answers to
 * "Gandhi Sans". Keying the libass font map by basename means a release whose
 * attachments are named anything else resolves nothing, and every style falls
 * back to an arbitrary face.
 *
 * Returns an empty array for a buffer this cannot parse; the caller keeps its
 * basename key as the alias of last resort.
 */
export function readFontFamilyNames(buffer: ArrayBuffer): string[] {
	try {
		const view = new DataView(buffer);
		const bytes = new Uint8Array(buffer);
		const names = new Set<string>();

		if (view.getUint32(0) === TTC_TAG) {
			const fontCount = view.getUint32(8);
			for (let i = 0; i < fontCount; i++) {
				const nameOffset = readTableDirectory(view, view.getUint32(12 + i * 4));
				if (nameOffset !== null)
					collectFromNameTable(view, bytes, nameOffset, names);
			}
			return [...names];
		}

		const nameOffset = readTableDirectory(view, 0);
		if (nameOffset === null)
			return [];

		collectFromNameTable(view, bytes, nameOffset, names);
		return [...names];
	}
	catch {
		return [];
	}
}
