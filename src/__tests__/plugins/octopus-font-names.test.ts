// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { readFontFamilyNames } from '../../plugins/octopus/font-names';

interface NameRecord {
	platformId: number;
	nameId: number;
	value: string;
}

/** Builds the smallest SFNT that carries a real `name` table. */
function buildFont(records: NameRecord[]): ArrayBuffer {
	const encoded = records.map((record) => {
		const bytes = record.platformId === 1
			? Uint8Array.from(record.value, char => char.charCodeAt(0) & 0xFF)
			: Uint8Array.from(
					record.value.split('').flatMap(char => [char.charCodeAt(0) >> 8, char.charCodeAt(0) & 0xFF]),
				);
		return { ...record, bytes };
	});

	const storage = encoded.reduce((total, record) => total + record.bytes.length, 0);
	const nameTableLength = 6 + encoded.length * 12 + storage;
	const nameOffset = 12 + 16;
	const buffer = new ArrayBuffer(nameOffset + nameTableLength);
	const view = new DataView(buffer);
	const bytes = new Uint8Array(buffer);

	view.setUint32(0, 0x00010000); // sfnt version
	view.setUint16(4, 1); // one table
	view.setUint32(12, 0x6E616D65); // 'name'
	view.setUint32(12 + 8, nameOffset);
	view.setUint32(12 + 12, nameTableLength);

	view.setUint16(nameOffset, 0);
	view.setUint16(nameOffset + 2, encoded.length);
	view.setUint16(nameOffset + 4, 6 + encoded.length * 12);

	let stringCursor = 0;
	encoded.forEach((record, index) => {
		const at = nameOffset + 6 + index * 12;
		view.setUint16(at, record.platformId);
		view.setUint16(at + 2, record.platformId === 1 ? 0 : 1);
		view.setUint16(at + 4, 0);
		view.setUint16(at + 6, record.nameId);
		view.setUint16(at + 8, record.bytes.length);
		view.setUint16(at + 10, stringCursor);
		bytes.set(record.bytes, nameOffset + 6 + encoded.length * 12 + stringCursor);
		stringCursor += record.bytes.length;
	});

	return buffer;
}

describe('readFontFamilyNames', () => {
	it('reads the declared family, not the filename — the wrong-subtitle-font bug', () => {
		// Slime S01E01 ships Gandhisans-Bold.otf, and its styles ask for
		// "Gandhi Sans". Keying the libass map by basename resolved nothing, so
		// every line rendered in an arbitrary attached face.
		const font = buildFont([
			{ platformId: 3, nameId: 1, value: 'Gandhi Sans' },
			{ platformId: 3, nameId: 4, value: 'Gandhi Sans Bold' },
		]);

		expect(readFontFamilyNames(font)).toContain('gandhi sans');
	});

	it('registers the typographic family so a weight-split family still resolves', () => {
		const font = buildFont([
			{ platformId: 3, nameId: 1, value: 'PT Sans Narrow Bold' },
			{ platformId: 3, nameId: 16, value: 'PT Sans Narrow' },
		]);

		expect(readFontFamilyNames(font)).toEqual(
			expect.arrayContaining(['pt sans narrow bold', 'pt sans narrow']),
		);
	});

	it('recovers a UTF-16 name mislabelled as a Macintosh record', () => {
		// Pixelade.ttf declares its name as UTF-16BE under platform 1, which a
		// byte-wise decode turns into "P i x e l a d e".
		const font = buildFont([
			{ platformId: 1, nameId: 1, value: '\0P\0i\0x\0e\0l\0a\0d\0e' },
		]);

		expect(readFontFamilyNames(font)).toContain('pixelade');
	});

	it('returns nothing for a buffer that is not a font', () => {
		expect(readFontFamilyNames(new Uint8Array([1, 2, 3, 4]).buffer)).toEqual([]);
	});
});
