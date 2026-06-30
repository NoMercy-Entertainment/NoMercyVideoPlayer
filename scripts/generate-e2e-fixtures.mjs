// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Generates the deterministic media fixtures the e2e suite drives through a real
 * browser. Produced by the NoMercy FFmpeg fork (resolved by ensure-ffmpeg.mjs),
 * never a system ffmpeg, so the fixtures match the encoder the product ships.
 *
 * Outputs into e2e/media/:
 *   sample.mp4   3s 320x180 H264 + AAC tone
 *   stream.m3u8  HLS playlist + seg_000.ts (from sample.mp4)
 *   sample.vtt   two WebVTT cues
 *   sample.ass   two ASS cues (drives the libass/octopus path)
 *
 * Run: `node scripts/generate-e2e-fixtures.mjs` (also exposed as `pretest:e2e`).
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureFfmpeg } from './ensure-ffmpeg.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const mediaDir = join(here, '..', 'e2e', 'media');

function run(ffmpeg, args) {
	const result = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', ...args], { encoding: 'utf8', cwd: mediaDir });
	if (result.status !== 0)
		throw new Error(`ffmpeg failed: ${args.join(' ')}\n${result.stderr}`);
}

const SAMPLE_VTT = `WEBVTT

00:00:00.000 --> 00:00:01.500
First cue line

00:00:01.500 --> 00:00:03.000
Second cue line
`;

const SAMPLE_ASS = `[Script Info]
ScriptType: v4.00+
PlayResX: 320
PlayResY: 180

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:00:01.50,Default,,0,0,0,,First ASS cue
Dialogue: 0,0:00:01.50,0:00:03.00,Default,,0,0,0,,Second ASS cue
`;

async function main() {
	const ffmpeg = await ensureFfmpeg();
	mkdirSync(mediaDir, { recursive: true });

	run(ffmpeg, [
		'-f',
		'lavfi',
		'-i',
		'testsrc=duration=3:size=320x180:rate=15',
		'-f',
		'lavfi',
		'-i',
		'sine=frequency=440:duration=3',
		'-c:v',
		'libx264',
		'-pix_fmt',
		'yuv420p',
		'-c:a',
		'aac',
		'-shortest',
		'sample.mp4',
	]);

	run(ffmpeg, [
		'-i',
		'sample.mp4',
		'-c:v',
		'libx264',
		'-c:a',
		'aac',
		'-f',
		'hls',
		'-hls_time',
		'1',
		'-hls_list_size',
		'0',
		'-hls_segment_filename',
		'seg_%03d.ts',
		'stream.m3u8',
	]);

	writeFileSync(join(mediaDir, 'sample.vtt'), SAMPLE_VTT);
	writeFileSync(join(mediaDir, 'sample.ass'), SAMPLE_ASS);

	console.log(`e2e fixtures generated in ${mediaDir} using ${ffmpeg}`);
}

main().catch((error) => {
	console.error(error.message);
	process.exit(1);
});
