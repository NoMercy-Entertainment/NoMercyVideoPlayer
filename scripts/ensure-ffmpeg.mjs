// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * Resolves a NoMercy FFmpeg binary for e2e fixture generation.
 *
 * Resolution order:
 *   1. NOMERCY_FFMPEG env var pointing at an existing binary.
 *   2. A binary already cached under .cache/ffmpeg from a previous run.
 *   3. The matching platform artifact from the nomercy-ffmpeg GitHub release,
 *      downloaded and extracted into .cache/ffmpeg.
 *
 * The NoMercy fork is preferred over any system ffmpeg because the fixtures must
 * be produced by the same encoder the product ships (custom muxers/filters).
 * Works locally and in CI: CI hits a cache miss once, downloads, then reuses.
 *
 * Usage: `const ffmpeg = await ensureFfmpeg()` then spawn `ffmpeg` with args.
 */
import { spawnSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, rmSync } from 'node:fs';
import { chmod } from 'node:fs/promises';
import { arch, platform } from 'node:os';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const FFMPEG_VERSION = 'v1.0.36';
const FFMPEG_FFVERSION = '8.1.1';
const REPO = 'NoMercy-Entertainment/nomercy-ffmpeg';

const here = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(here, '..', '.cache', 'ffmpeg', FFMPEG_VERSION);

/** Maps the current OS+arch to the release artifact slug the fork publishes. */
function resolvePlatformSlug() {
	const os = platform();
	const cpu = arch();
	if (os === 'win32' && cpu === 'x64')
		return { slug: 'windows-x86_64', ext: 'zip', exe: 'ffmpeg.exe' };
	if (os === 'linux' && cpu === 'x64')
		return { slug: 'linux-x86_64', ext: 'tar.gz', exe: 'ffmpeg' };
	if (os === 'linux' && cpu === 'arm64')
		return { slug: 'linux-aarch64', ext: 'tar.gz', exe: 'ffmpeg' };
	if (os === 'darwin' && cpu === 'arm64')
		return { slug: 'darwin-arm64', ext: 'tar.gz', exe: 'ffmpeg' };
	if (os === 'darwin' && cpu === 'x64')
		return { slug: 'darwin-x86_64', ext: 'tar.gz', exe: 'ffmpeg' };
	throw new Error(`No NoMercy ffmpeg artifact for ${os}/${cpu}. Set NOMERCY_FFMPEG to a binary path.`);
}

/** Confirms a path is an ffmpeg that actually runs. */
function isRunnable(binaryPath) {
	if (!existsSync(binaryPath))
		return false;
	const probe = spawnSync(binaryPath, ['-version'], { encoding: 'utf8' });
	return probe.status === 0 && /ffmpeg version/i.test(probe.stdout ?? '');
}

async function downloadArtifact(slug, ext, archivePath) {
	const assetName = `ffmpeg-${FFMPEG_FFVERSION}-${slug}-${FFMPEG_VERSION}.${ext}`;
	const url = `https://github.com/${REPO}/releases/download/${FFMPEG_VERSION}/${assetName}`;
	const response = await fetch(url);
	if (!response.ok)
		throw new Error(`Download failed (${response.status}) for ${url}`);
	await pipeline(response.body, createWriteStream(archivePath));
}

function extractArchive(archivePath, ext) {
	if (ext === 'zip') {
		// PowerShell Expand-Archive is present on every supported Windows runner.
		const result = spawnSync(
			'powershell',
			['-NoProfile', '-Command', `Expand-Archive -Path '${archivePath}' -DestinationPath '${cacheDir}' -Force`],
			{ encoding: 'utf8' },
		);
		if (result.status !== 0)
			throw new Error(`Expand-Archive failed: ${result.stderr}`);
		return;
	}
	const result = spawnSync('tar', ['-xzf', archivePath, '-C', cacheDir], { encoding: 'utf8' });
	if (result.status !== 0)
		throw new Error(`tar extraction failed: ${result.stderr}`);
}

/** Returns an absolute path to a runnable NoMercy ffmpeg, downloading it on first use. */
export async function ensureFfmpeg() {
	const fromEnv = process.env.NOMERCY_FFMPEG;
	if (fromEnv && isRunnable(fromEnv))
		return fromEnv;

	const { slug, ext, exe } = resolvePlatformSlug();
	const binaryPath = join(cacheDir, exe);
	if (isRunnable(binaryPath))
		return binaryPath;

	mkdirSync(cacheDir, { recursive: true });
	const archivePath = join(cacheDir, `ffmpeg.${ext}`);
	await downloadArtifact(slug, ext, archivePath);
	extractArchive(archivePath, ext);
	rmSync(archivePath, { force: true });
	if (exe !== 'ffmpeg.exe')
		await chmod(binaryPath, 0o755);

	if (!isRunnable(binaryPath))
		throw new Error(`Extracted ffmpeg at ${binaryPath} is not runnable.`);
	return binaryPath;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('ensure-ffmpeg.mjs')) {
	ensureFfmpeg()
		.then(path => console.log(path))
		.catch((error) => {
			console.error(error.message);
			process.exit(1);
		});
}
