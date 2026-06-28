// -----------------------------------------------------------------------------
//  Copyright (c) NoMercy Entertainment
//
//  Licensed under the Apache License, Version 2.0. See LICENSE for details.
//
//  SPDX-License-Identifier: Apache-2.0
// -----------------------------------------------------------------------------

/**
 * buttons.ts — subtitleSettingActions factory function coverage.
 *
 * The factory (lines 443-505) was at 0% function coverage. It returns a flat
 * array of subtitle-setting actions keyed by property. Each action has a live
 * `action()` closure that calls `player.subtitleStyle?.()` with a patch.
 *
 * Strategy: call the factory with a mock player that records subtitleStyle
 * invocations, then invoke each action's closure and assert the patch reaches
 * the player.
 */

import { describe, expect, it, vi } from 'vitest';

import {
	defaultSubtitleStyles,
	fontFamilies,
	colors,
	edgeStyles,
	opacities,
	textSizes,
	subtitleSettingActions,
} from '../../plugins/desktop-ui/buttons';

function makePlayer(): Record<string, unknown> & { subtitleStyle: ReturnType<typeof vi.fn> } {
	return {
		subtitleStyle: vi.fn(),
	};
}

describe('subtitleSettingActions factory', () => {
	it('returns a non-empty array', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		expect(actions.length).toBeGreaterThan(0);
	});

	it('covers every fontFamily entry with property=fontFamily', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const fontActions = actions.filter(a => a.property === 'fontFamily');
		expect(fontActions.length).toBe(fontFamilies.length);
	});

	it('fontFamily action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const fontAction = actions.find(a => a.property === 'fontFamily');
		expect(fontAction).toBeDefined();

		fontAction!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(
			expect.objectContaining({ fontFamily: fontAction!.value }),
		);
	});

	it('covers every textSize entry with property=fontSize', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const sizeActions = actions.filter(a => a.property === 'fontSize');
		expect(sizeActions.length).toBe(textSizes.length);
	});

	it('fontSize action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const sizeAction = actions.find(a => a.property === 'fontSize' && a.value === 100);
		expect(sizeAction).toBeDefined();

		sizeAction!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith({ fontSize: 100 });
	});

	it('covers every color entry for textColor with property=textColor', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const textColorActions = actions.filter(a => a.property === 'textColor');
		expect(textColorActions.length).toBe(colors.length);
	});

	it('textColor action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const firstColor = actions.find(a => a.property === 'textColor');
		expect(firstColor).toBeDefined();

		firstColor!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(
			expect.objectContaining({ textColor: firstColor!.value }),
		);
	});

	it('covers every opacity entry for textOpacity with property=textOpacity', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const opacityActions = actions.filter(a => a.property === 'textOpacity');
		expect(opacityActions.length).toBe(opacities.length);
	});

	it('textOpacity action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const first = actions.find(a => a.property === 'textOpacity');
		expect(first).toBeDefined();

		first!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(
			expect.objectContaining({ textOpacity: first!.value }),
		);
	});

	it('covers every edgeStyle entry with property=edgeStyle', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const edgeActions = actions.filter(a => a.property === 'edgeStyle');
		expect(edgeActions.length).toBe(edgeStyles.length);
	});

	it('edgeStyle action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const first = actions.find(a => a.property === 'edgeStyle');
		expect(first).toBeDefined();

		first!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(
			expect.objectContaining({ edgeStyle: first!.value }),
		);
	});

	it('covers every color entry for backgroundColor with property=backgroundColor', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const bgActions = actions.filter(a => a.property === 'backgroundColor');
		expect(bgActions.length).toBe(colors.length);
	});

	it('backgroundColor action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const first = actions.find(a => a.property === 'backgroundColor');
		expect(first).toBeDefined();

		first!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(
			expect.objectContaining({ backgroundColor: first!.value }),
		);
	});

	it('covers every opacity entry for backgroundOpacity with property=backgroundOpacity', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const bgOpActions = actions.filter(a => a.property === 'backgroundOpacity');
		expect(bgOpActions.length).toBe(opacities.length);
	});

	it('backgroundOpacity action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const first = actions.find(a => a.property === 'backgroundOpacity');
		expect(first).toBeDefined();

		first!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(
			expect.objectContaining({ backgroundOpacity: first!.value }),
		);
	});

	it('covers every color entry for areaColor with property=areaColor', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const areaActions = actions.filter(a => a.property === 'areaColor');
		expect(areaActions.length).toBe(colors.length);
	});

	it('areaColor action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const first = actions.find(a => a.property === 'areaColor');
		expect(first).toBeDefined();

		first!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(
			expect.objectContaining({ areaColor: first!.value }),
		);
	});

	it('covers every opacity entry for windowOpacity with property=windowOpacity', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const winActions = actions.filter(a => a.property === 'windowOpacity');
		expect(winActions.length).toBe(opacities.length);
	});

	it('windowOpacity action calls player.subtitleStyle with correct patch', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const first = actions.find(a => a.property === 'windowOpacity');
		expect(first).toBeDefined();

		first!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(
			expect.objectContaining({ windowOpacity: first!.value }),
		);
	});

	it('includes a Reset entry with empty property', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const reset = actions.find(a => a.property === '');
		expect(reset).toBeDefined();
		expect(reset!.label).toBe('Reset');
	});

	it('Reset action calls player.subtitleStyle with defaultSubtitleStyles', () => {
		const player = makePlayer();
		const actions = subtitleSettingActions(player as never);
		const reset = actions.find(a => a.property === '' && a.label === 'Reset');
		expect(reset).toBeDefined();

		reset!.action?.();
		expect(player.subtitleStyle).toHaveBeenCalledWith(defaultSubtitleStyles);
	});

	it('is inert when player.subtitleStyle is absent (no-op)', () => {
		// Player without subtitleStyle — action() must not throw.
		const player = {} as never;
		const actions = subtitleSettingActions(player);
		const fontAction = actions.find(a => a.property === 'fontFamily');
		expect(() => fontAction!.action?.()).not.toThrow();
	});
});
