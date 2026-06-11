/**
 * SkipperPlugin — chapter heuristic + persisted auto-skip toggle.
 *
 * Covers:
 *   - Built-in pattern derive from chapter titles (intro not-last guard, credits last-match)
 *   - patterns.extend / patterns.replace config
 *   - item.skippers precedence over derived ranges per kind
 *   - autoSkip(): config default, boolean expansion, persisted toggle round-trip
 */

import type { Chapter } from '@nomercy-entertainment/nomercy-player-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NMVideoPlayer } from '../../index';
import { SkipperPlugin, skipperPlugin } from '../../plugins/skipper';

type SkipperInternals = SkipperPlugin & { _deriveFromChapters: () => void };

function chapter(index: number, start: number, end: number, title: string): Chapter {
	return { index, start, end, title };
}

describe('SkipperPlugin — heuristic + auto-skip toggle', () => {
	beforeEach(() => {
		localStorage.clear();
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	});

	afterEach(() => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		localStorage.clear();
	});

	const setup = async (opts?: object, chapters: Chapter[] = []) => {
		const player = new NMVideoPlayer('test').setup({});
		player.chapters = () => chapters;
		player.addPlugin(skipperPlugin, opts);
		await player.ready();
		const plugin = player.getPlugin(SkipperPlugin)! as SkipperInternals;
		plugin._deriveFromChapters();
		return { player, plugin };
	};

	it('derives intro and credits from default patterns', async () => {
		const { plugin } = await setup(undefined, [
			chapter(0, 0, 90, 'Opening'),
			chapter(1, 90, 1300, 'Part A'),
			chapter(2, 1300, 1369, 'Preview'),
		]);

		const entries = plugin.skippers();
		expect(entries).toEqual([
			{ kind: 'intro', range: { start: 0, end: 90 } },
			{ kind: 'credits', range: { start: 1300, end: 1369 } },
		]);
	});

	it('does not derive an intro from the final chapter', async () => {
		const { plugin } = await setup(undefined, [
			chapter(0, 0, 1300, 'Part A'),
			chapter(1, 1300, 1369, 'Opening'),
		]);

		expect(plugin.skippers().find(entry => entry.kind === 'intro')).toBeUndefined();
	});

	it('patterns.extend adds to the built-in lists', async () => {
		const { plugin } = await setup(
			{ patterns: { extend: { intro: ['^Cold Open$'] } } },
			[
				chapter(0, 0, 45, 'Cold Open'),
				chapter(1, 45, 1300, 'Part A'),
			],
		);

		expect(plugin.skippers()).toEqual([
			{ kind: 'intro', range: { start: 0, end: 45 } },
		]);
	});

	it('patterns.replace swaps the built-in list wholesale', async () => {
		const { plugin } = await setup(
			{ patterns: { replace: { intro: ['^Theme$'] } } },
			[
				chapter(0, 0, 90, 'Opening'),
				chapter(1, 90, 1300, 'Part A'),
			],
		);

		// 'Opening' no longer matches — the replaced list only knows 'Theme'.
		expect(plugin.skippers().find(entry => entry.kind === 'intro')).toBeUndefined();
	});

	it('item.skippers wins over the derived range per kind', async () => {
		const { player, plugin } = await setup(undefined, [
			chapter(0, 0, 90, 'Opening'),
			chapter(1, 90, 1300, 'Part A'),
			chapter(2, 1300, 1369, 'Credits'),
		]);

		player.item = (() => ({
			id: 1,
			skippers: { intro: { start: 5, end: 88 } },
		})) as typeof player.item;

		const entries = plugin.skippers();
		expect(entries.find(entry => entry.kind === 'intro')!.range).toEqual({ start: 5, end: 88 });
		// Credits still come from the heuristic.
		expect(entries.find(entry => entry.kind === 'credits')!.range).toEqual({ start: 1300, end: 1369 });
	});

	const resetHarness = () => {
		(NMVideoPlayer as unknown as { _resetRegistry: () => void })._resetRegistry();
		document.body.innerHTML = '';
		const div = document.createElement('div');
		div.id = 'test';
		document.body.appendChild(div);
	};

	it('autoSkip(): defaults off, config default applies, boolean expands to all kinds', async () => {
		const { plugin } = await setup();
		expect(plugin.autoSkip()).toEqual([]);

		resetHarness();
		const { plugin: configured } = await setup({ autoSkip: ['intro'] });
		expect(configured.autoSkip()).toEqual(['intro']);

		configured.autoSkip(true);
		expect(configured.autoSkip()).toEqual(['intro', 'recap', 'credits']);
	});

	it('persisted toggle survives into a fresh plugin instance and beats the config default', async () => {
		const { plugin } = await setup({ autoSkip: false });
		plugin.autoSkip(['credits']);

		resetHarness();
		const { plugin: fresh } = await setup({ autoSkip: false });
		await new Promise(resolve => setTimeout(resolve, 0));
		expect(fresh.autoSkip()).toEqual(['credits']);
	});
});
