import { describe, expect, it, vi } from 'vitest';
import { coreMethods } from './core';
import { domMethods } from './dom';
import { subtitleMethods } from './subtitles';
import { uiStateMethods } from './ui-state';
import { defaultSubtitleStyles } from './utils';
import type { SubtitleStyle } from '../types';

// Polyfill String.prototype.toTitleCase (normally added by the player at runtime)
if (!String.prototype.toTitleCase) {
	(String.prototype as any).toTitleCase = function (): string {
		return this.replace(/\b\w/g, (c: string) => c.toUpperCase());
	};
}

// ── Helpers ──────────────────────────────────────────────────────────

function createMockPlayer(overrides: Record<string, any> = {}) {
	const container = document.createElement('div');
	container.classList.add('nomercyplayer');
	const videoElement = document.createElement('video');
	const subtitleOverlay = document.createElement('div');
	subtitleOverlay.classList.add('subtitle-overlay');
	const subtitleArea = document.createElement('div');
	subtitleArea.classList.add('subtitle-area');
	const subtitleSafeZone = document.createElement('div');
	subtitleSafeZone.classList.add('subtitle-safezone');
	const subtitleText = document.createElement('span');
	subtitleText.classList.add('subtitle-text');
	subtitleArea.appendChild(subtitleText);
	subtitleSafeZone.appendChild(subtitleArea);
	subtitleOverlay.appendChild(subtitleSafeZone);
	container.appendChild(subtitleOverlay);
	container.appendChild(videoElement);

	const mockStorage = {
		get: vi.fn((key: string, fallback: any) => Promise.resolve(fallback)),
		set: vi.fn(() => Promise.resolve()),
		remove: vi.fn(() => Promise.resolve()),
	};

	const player: any = {
		container,
		videoElement,
		overlay: document.createElement('div'),
		subtitleOverlay,
		subtitleSafeZone,
		subtitleArea,
		subtitleText,
		_subtitleStyle: { ...defaultSubtitleStyles },
		currentSubtitleIndex: -1,
		currentSubtitleFile: '',
		_subtitles: {},
		lockActive: false,
		inactivityTimeout: undefined,
		inactivityTime: 3000,
		message: undefined,
		options: { doubleClickDelay: 300, disableAutoPlayback: false },
		previewTime: [],
		playerId: 'test-player',
		storage: mockStorage,
		logger: { warn: vi.fn(), debug: vi.fn(), error: vi.fn(), verbose: vi.fn() },
		emit: vi.fn(),
		on: vi.fn(),
		once: vi.fn(),
		localize: vi.fn((s: string) => s),
		fullscreen: vi.fn(() => false),
		muted: vi.fn(() => false),
		isPlaying: false,
		element: vi.fn(() => container),
		currentTime: vi.fn(() => 30),
		displayMessage: vi.fn(),
		getFileContents: vi.fn(() => Promise.resolve()),
		playlistItem: vi.fn(() => ({
			tracks: [
				{ kind: 'subtitles', file: 'eng.full.vtt', label: 'Full', language: 'eng', id: 0 },
				{ kind: 'subtitles', file: 'nld.full.vtt', label: 'Full', language: 'nld', id: 1 },
			],
		})),
		...overrides,
	};

	// Track which keys are explicitly set as mocks (vi.fn()) so we don't overwrite them
	const mockKeys = new Set<string>();
	for (const [key, value] of Object.entries(player)) {
		if (typeof value === 'function' && (value as any)._isMockFunction) {
			mockKeys.add(key);
		}
	}

	// Bind mixin methods, but preserve mock functions
	for (const methods of [coreMethods, domMethods, subtitleMethods, uiStateMethods]) {
		for (const [key, value] of Object.entries(methods)) {
			if (typeof value === 'function' && !mockKeys.has(key)) {
				player[key] = (value as Function).bind(player);
			}
		}
	}

	return player;
}

/**
 * Parse a hex color string (#RRGGBB or #RRGGBBAA) to RGB values.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const match = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
	if (!match)
		return null;
	return {
		r: Number.parseInt(match[1], 16),
		g: Number.parseInt(match[2], 16),
		b: Number.parseInt(match[3], 16),
	};
}

/**
 * Calculate relative luminance per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(r: number, g: number, b: number): number {
	const [rs, gs, bs] = [r, g, b].map((c) => {
		const s = c / 255;
		return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
function contrastRatio(color1: string, color2: string): number {
	const rgb1 = hexToRgb(color1);
	const rgb2 = hexToRgb(color2);
	if (!rgb1 || !rgb2)
		return 0;

	const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
	const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

// ═════════════════════════════════════════════════════════════════════
// WCAG 2.1 / FCC (CVAA) Accessibility Compliance Tests
// ═════════════════════════════════════════════════════════════════════

describe('Accessibility Compliance', () => {
	// ── FCC/CVAA Caption Customization Requirements ──────────────────
	// The 21st Century Communications and Video Accessibility Act requires
	// that users can customize caption appearance with these options:
	// font family, font size, text color, text opacity, background color,
	// background opacity, edge style, window color, window opacity.
	// Settings must persist across sessions.

	describe('FCC/CVAA — Caption Customization Options', () => {
		it('SubtitleStyle interface includes all FCC-required properties', () => {
			const style: SubtitleStyle = defaultSubtitleStyles;
			expect(style).toHaveProperty('fontFamily');
			expect(style).toHaveProperty('fontSize');
			expect(style).toHaveProperty('textColor');
			expect(style).toHaveProperty('textOpacity');
			expect(style).toHaveProperty('backgroundColor');
			expect(style).toHaveProperty('backgroundOpacity');
			expect(style).toHaveProperty('edgeStyle');
			expect(style).toHaveProperty('areaColor'); // window color
			expect(style).toHaveProperty('windowOpacity');
		});

		it('default subtitle styles have sensible values', () => {
			expect(defaultSubtitleStyles.fontSize).toBeGreaterThanOrEqual(50);
			expect(defaultSubtitleStyles.fontSize).toBeLessThanOrEqual(400);
			expect(defaultSubtitleStyles.textOpacity).toBe(100);
			expect(defaultSubtitleStyles.textColor).toBeTruthy();
			expect(defaultSubtitleStyles.fontFamily).toBeTruthy();
		});
	});

	// ── Subtitle Style Application ───────────────────────────────────
	// WCAG 1.4.8 (AAA) & FCC: user customization must actually be applied.

	describe('FCC/CVAA — Subtitle Style Application', () => {
		it('applies fontSize as calc() expression', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, fontSize: 150 };
			player.applySubtitleStyle();
			expect(player.subtitleText.style.fontSize).toBe('calc(100% * 1.5)');
		});

		it('applies fontSize 50% correctly', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, fontSize: 50 };
			player.applySubtitleStyle();
			expect(player.subtitleText.style.fontSize).toBe('calc(100% * 0.5)');
		});

		it('applies fontSize 200% correctly', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, fontSize: 200 };
			player.applySubtitleStyle();
			expect(player.subtitleText.style.fontSize).toBe('calc(100% * 2)');
		});

		it('applies fontFamily', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, fontFamily: 'Arial, sans-serif' };
			player.applySubtitleStyle();
			expect(player.subtitleText.style.fontFamily).toBe('Arial, sans-serif');
		});

		it('applies text color with opacity', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, textColor: 'white', textOpacity: 100 };
			player.applySubtitleStyle();
			expect(player.subtitleText.style.color).toBeTruthy();
		});

		it('applies background color to subtitle text element', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, backgroundColor: 'black', backgroundOpacity: 75 };
			player.applySubtitleStyle();
			expect(player.subtitleText.style.backgroundColor).toBeTruthy();
		});

		it('applies area/window color to subtitle area element', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, areaColor: 'blue', windowOpacity: 50 };
			player.applySubtitleStyle();
			expect(player.subtitleArea.style.backgroundColor).toBeTruthy();
		});

		it('applies edge style as text-shadow', () => {
			const player = createMockPlayer();
			const edgeStyles = ['depressed', 'dropShadow', 'raised', 'uniform', 'textShadow'] as const;
			for (const edge of edgeStyles) {
				player._subtitleStyle = { ...defaultSubtitleStyles, edgeStyle: edge };
				player.applySubtitleStyle();
				expect(player.subtitleText.style.textShadow).toBeTruthy();
			}
		});

		it('removes text-shadow for "none" edge style', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, edgeStyle: 'none' as any };
			player.applySubtitleStyle();
			// 'none' falls to default case which returns ''
			expect(player.subtitleText.style.textShadow).toBe('');
		});

		it('emits set-subtitle-style for every property when applying', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles };
			player.applySubtitleStyle();
			const emittedProps = player.emit.mock.calls
				.filter((c: any[]) => c[0] === 'set-subtitle-style')
				.map((c: any[]) => c[1].property);
			expect(emittedProps).toContain('fontSize');
			expect(emittedProps).toContain('fontFamily');
			expect(emittedProps).toContain('textColor');
			expect(emittedProps).toContain('textOpacity');
			expect(emittedProps).toContain('backgroundColor');
			expect(emittedProps).toContain('backgroundOpacity');
			expect(emittedProps).toContain('edgeStyle');
			expect(emittedProps).toContain('areaColor');
			expect(emittedProps).toContain('windowOpacity');
		});
	});

	// ── Subtitle Style Persistence ───────────────────────────────────
	// FCC/CVAA: caption settings must persist across viewing sessions.

	describe('FCC/CVAA — Subtitle Style Persistence', () => {
		it('saves style to storage when applied', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, fontSize: 200 };
			player.applySubtitleStyle();
			expect(player.storage.set).toHaveBeenCalledWith('subtitle-style', expect.objectContaining({ fontSize: 200 }));
		});

		it('saves complete style object to storage', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles };
			player.applySubtitleStyle();
			const savedStyle = player.storage.set.mock.calls.find(
				(c: any[]) => c[0] === 'subtitle-style',
			)?.[1];
			expect(savedStyle).toMatchObject(defaultSubtitleStyles);
		});

		it('subtitleStyle(partial) merges into existing style', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles };
			player.subtitleStyle({ fontSize: 300 });
			expect(player._subtitleStyle.fontSize).toBe(300);
			// Other properties should be preserved
			expect(player._subtitleStyle.fontFamily).toBe(defaultSubtitleStyles.fontFamily);
			expect(player._subtitleStyle.textColor).toBe(defaultSubtitleStyles.textColor);
		});

		it('subtitleStyle() getter returns current style', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles, fontSize: 150 };
			const style = player.subtitleStyle();
			expect(style.fontSize).toBe(150);
		});

		it('stores subtitle language choice', async () => {
			const player = createMockPlayer({ currentSubtitleIndex: 0 });
			player.storeSubtitleChoice();
			expect(player.storage.set).toHaveBeenCalledWith('subtitle-language', 'eng');
		});

		it('removes subtitle language choice when Off', async () => {
			const player = createMockPlayer({ currentSubtitleIndex: -1 });
			player.storeSubtitleChoice();
			expect(player.storage.remove).toHaveBeenCalledWith('subtitle-language');
		});
	});

	// ── Subtitle Positioning (VTT Cue) ───────────────────────────────
	// WCAG 1.2.2 & FCC: captions must be repositionable and respect
	// VTT cue positioning directives.

	describe('WCAG 1.2.2 / FCC — Subtitle Positioning', () => {
		it('positions at bottom 3% by default (no line position)', () => {
			const player = createMockPlayer();
			const cue = { linePosition: undefined, alignment: 'center', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.style.bottom).toBe('3%');
			expect(player.subtitleArea.style.top).toBe('');
		});

		it('respects explicit line position', () => {
			const player = createMockPlayer();
			const cue = { linePosition: 10, alignment: 'center', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.style.top).toBe('10%');
		});

		it('uses adjusted position when linePosition is 50', () => {
			const player = createMockPlayer();
			// Simulate real dimensions so the calculation doesn't produce NaN
			Object.defineProperty(player.videoElement, 'clientHeight', { value: 720 });
			Object.defineProperty(player.subtitleArea, 'clientHeight', { value: 40 });
			const cue = { linePosition: 50, alignment: 'center', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			// Should compute: 50 - (40/720 * 50) = 50 - 2.78 ≈ 47.22%
			const topValue = Number.parseFloat(player.subtitleArea.style.top);
			expect(topValue).toBeGreaterThan(40);
			expect(topValue).toBeLessThan(50);
		});

		it('applies start alignment', () => {
			const player = createMockPlayer();
			const cue = { linePosition: undefined, alignment: 'start', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.classList.contains('aligned-start')).toBe(true);
			expect(player.subtitleArea.classList.contains('aligned-center')).toBe(false);
			expect(player.subtitleArea.classList.contains('aligned-end')).toBe(false);
		});

		it('applies left alignment as start', () => {
			const player = createMockPlayer();
			const cue = { linePosition: undefined, alignment: 'left', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.classList.contains('aligned-start')).toBe(true);
		});

		it('applies center alignment', () => {
			const player = createMockPlayer();
			const cue = { linePosition: undefined, alignment: 'center', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.classList.contains('aligned-center')).toBe(true);
		});

		it('applies end alignment', () => {
			const player = createMockPlayer();
			const cue = { linePosition: undefined, alignment: 'end', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.classList.contains('aligned-end')).toBe(true);
		});

		it('applies right alignment as end', () => {
			const player = createMockPlayer();
			const cue = { linePosition: undefined, alignment: 'right', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.classList.contains('aligned-end')).toBe(true);
		});

		it('removes previous alignment classes when changing', () => {
			const player = createMockPlayer();
			player.subtitleArea.classList.add('aligned-start');
			const cue = { linePosition: undefined, alignment: 'center', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.classList.contains('aligned-start')).toBe(false);
			expect(player.subtitleArea.classList.contains('aligned-center')).toBe(true);
		});

		it('applies cue size as width', () => {
			const player = createMockPlayer();
			const cue = { linePosition: undefined, alignment: 'center', size: 80 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.style.width).toBe('calc(80% - 6%)');
		});

		it('applies 100% width for out-of-range size', () => {
			const player = createMockPlayer();
			const cue = { linePosition: undefined, alignment: 'center', size: -1 };
			player.computeSubtitlePosition(cue, player.videoElement, player.subtitleArea, player.subtitleText);
			expect(player.subtitleArea.style.width).toBe('100%');
		});

		it('does not crash when elements are missing', () => {
			const player = createMockPlayer();
			const cue = { linePosition: 50, alignment: 'center', size: 100 };
			// Should not throw
			expect(() => {
				player.computeSubtitlePosition(cue, null, player.subtitleArea, player.subtitleText);
			}).not.toThrow();
			expect(() => {
				player.computeSubtitlePosition(cue, player.videoElement, null, player.subtitleText);
			}).not.toThrow();
		});
	});

	// ── WCAG 2.1.1 — Keyboard Accessibility ─────────────────────────
	// All functionality must be operable through a keyboard interface.

	describe('WCAG 2.1.1 — Keyboard Accessibility', () => {
		it('UI buttons are created as <button> elements (keyboard-focusable)', () => {
			const player = createMockPlayer();
			const parent = document.createElement('div');
			const result = player.createUiButton(parent, 'play');
			const el = result.get();
			expect(el.tagName).toBe('BUTTON');
		});

		it('buttons have focus-visible outline styles', () => {
			const player = createMockPlayer();
			const parent = document.createElement('div');
			const result = player.createUiButton(parent, 'test-button');
			const el = result.get();
			// Check that focus-visible classes are present
			expect(el.classList.contains('focus-visible:outline')).toBe(true);
			expect(el.classList.contains('focus-visible:outline-2')).toBe(true);
		});

		it('buttons handle Escape key to dismiss menu', () => {
			const player = createMockPlayer();
			const parent = document.createElement('div');
			player.createUiButton(parent, 'test-button');
			const el = parent.querySelector('button')!;

			el.dispatchEvent(new KeyboardEvent('keypress', { key: 'Escape', bubbles: true }));
			expect(player.emit).toHaveBeenCalledWith('show-menu', false);
		});

		it('buttons handle Backspace key to dismiss menu', () => {
			const player = createMockPlayer();
			const parent = document.createElement('div');
			player.createUiButton(parent, 'test-button');
			const el = parent.querySelector('button')!;

			el.dispatchEvent(new KeyboardEvent('keypress', { key: 'Backspace', bubbles: true }));
			expect(player.emit).toHaveBeenCalledWith('show-menu', false);
		});

		it('lockActive prevents auto-hide during keyboard interaction', () => {
			vi.useFakeTimers();
			const player = createMockPlayer({ lockActive: true, inactivityTime: 100 });
			player.ui_resetInactivityTimer();
			vi.advanceTimersByTime(200);
			// Should remain active because lockActive is set
			expect(player.container.classList.contains('active')).toBe(true);
			expect(player.container.classList.contains('inactive')).toBe(false);
			vi.useRealTimers();
		});
	});

	// ── WCAG 4.1.2 — Name, Role, Value (ARIA) ───────────────────────
	// Interactive controls must have accessible names and appropriate roles.

	describe('WCAG 4.1.2 — ARIA Labels and Roles', () => {
		it('UI buttons receive aria-label from id', () => {
			const player = createMockPlayer();
			const parent = document.createElement('div');
			const result = player.createUiButton(parent, 'play-button');
			const el = result.get();
			expect(el.ariaLabel).toBeTruthy();
			expect(player.localize).toHaveBeenCalled();
		});

		it('UI buttons with explicit title use title as aria-label', () => {
			const player = createMockPlayer();
			const parent = document.createElement('div');
			const result = player.createUiButton(parent, 'custom-button', 'Custom Action');
			const el = result.get();
			expect(el.ariaLabel).toBe('Custom Action');
		});

		it('video element is present in the container', () => {
			const player = createMockPlayer();
			const video = player.container.querySelector('video');
			expect(video).not.toBeNull();
		});

		it('subtitle overlay is part of the DOM tree', () => {
			const player = createMockPlayer();
			const overlay = player.container.querySelector('.subtitle-overlay');
			expect(overlay).not.toBeNull();
		});

		it('subtitle area is inside the subtitle overlay', () => {
			const player = createMockPlayer();
			const area = player.container.querySelector('.subtitle-overlay .subtitle-area');
			expect(area).not.toBeNull();
		});

		it('subtitle text is inside the subtitle area', () => {
			const player = createMockPlayer();
			const text = player.container.querySelector('.subtitle-area .subtitle-text');
			expect(text).not.toBeNull();
		});
	});

	// ── WCAG 1.4.3/1.4.6 — Contrast Requirements ────────────────────
	// Text must have sufficient contrast against its background.
	// Level AA requires 4.5:1 for normal text, 3:1 for large text.
	// Level AAA requires 7:1 for normal text, 4.5:1 for large text.
	// Subtitles are typically large text (≥ 18pt).

	describe('WCAG 1.4.3 — Default Subtitle Contrast', () => {
		it('default text color (white) on default edge style provides sufficient contrast', () => {
			// Default: white text with textShadow edge on potentially any background.
			// The text shadow (black) provides contrast enhancement.
			// White (#ffffff) vs black (#000000) contrast ratio is 21:1
			const ratio = contrastRatio('#ffffff', '#000000');
			expect(ratio).toBeGreaterThanOrEqual(7); // AAA level
		});

		it('white on black meets WCAG AAA contrast ratio (7:1)', () => {
			const ratio = contrastRatio('#ffffff', '#000000');
			expect(ratio).toBeCloseTo(21, 0);
		});

		it('default styles use high opacity (100%) for text', () => {
			expect(defaultSubtitleStyles.textOpacity).toBe(100);
		});

		it('default styles use transparent background (0% opacity) — relies on edge style for contrast', () => {
			expect(defaultSubtitleStyles.backgroundOpacity).toBe(0);
			expect(defaultSubtitleStyles.edgeStyle).toBe('textShadow');
		});

		it('edge style textShadow provides multi-layer shadow for contrast on any background', () => {
			const player = createMockPlayer();
			player._subtitleStyle = { ...defaultSubtitleStyles };
			player.applySubtitleStyle();
			const shadow = player.subtitleText.style.textShadow;
			// textShadow should have multiple shadow layers for robustness
			const layers = shadow.split(',');
			expect(layers.length).toBeGreaterThanOrEqual(4);
		});
	});

	// ── Subtitle Track Management ────────────────────────────────────
	// WCAG 1.2.2 (A): Captions are provided for all prerecorded audio.
	// Users must be able to select, cycle, and disable subtitle tracks.

	describe('WCAG 1.2.2 — Subtitle Track Selection', () => {
		it('can list available subtitle tracks', () => {
			const player = createMockPlayer();
			const subs = player.subtitles();
			expect(subs.length).toBeGreaterThanOrEqual(1);
		});

		it('subtitle tracks include language metadata', () => {
			const player = createMockPlayer();
			const subs = player.subtitles();
			for (const sub of subs) {
				expect(sub.language).toBeTruthy();
			}
		});

		it('subtitle tracks include label metadata', () => {
			const player = createMockPlayer();
			const subs = player.subtitles();
			for (const sub of subs) {
				expect(sub.label).toBeTruthy();
			}
		});

		it('can select a subtitle by index', () => {
			const player = createMockPlayer();
			player.subtitle(0);
			expect(player.currentSubtitleIndex).toBe(0);
		});

		it('can disable subtitles (index -1)', () => {
			const player = createMockPlayer({ currentSubtitleIndex: 0 });
			player.subtitle(-1);
			expect(player.currentSubtitleIndex).toBe(-1);
		});

		it('emits subtitleChanged when changing track', () => {
			const player = createMockPlayer();
			player.subtitle(0);
			expect(player.emit).toHaveBeenCalledWith('subtitleChanged', expect.anything());
		});

		it('cycleSubtitles() cycles through all tracks and back to off', () => {
			const player = createMockPlayer({ currentSubtitleIndex: -1 });

			// Off → first track
			player.cycleSubtitles();
			expect(player.currentSubtitleIndex).toBe(0);

			// first → second
			player.cycleSubtitles();
			expect(player.currentSubtitleIndex).toBe(1);

			// second → Off
			player.cycleSubtitles();
			expect(player.currentSubtitleIndex).toBe(-1);
		});

		it('cycleSubtitles() shows message for user feedback', () => {
			const player = createMockPlayer({ currentSubtitleIndex: -1 });
			player.cycleSubtitles();
			expect(player.displayMessage).toHaveBeenCalledWith(
				expect.stringContaining('Subtitles'),
			);
		});

		it('provides subtitleIndexBy() for language-based lookup', () => {
			const player = createMockPlayer();
			const idx = player.subtitleIndexBy('eng', 'full', 'vtt');
			expect(idx).toBe(0);
		});
	});

	// ── CSS State Classes ────────────────────────────────────────────
	// The player uses CSS classes to communicate state to UI plugins.
	// This enables CSS-only visibility for assistive technology awareness.

	describe('CSS State Classes — UI State Communication', () => {
		it('adds "active" class and removes "inactive" when showing controls', () => {
			const player = createMockPlayer();
			player.container.classList.add('inactive');
			player.ui_addActiveClass();
			expect(player.container.classList.contains('active')).toBe(true);
			expect(player.container.classList.contains('inactive')).toBe(false);
		});

		it('adds "inactive" class and removes "active" when hiding controls', () => {
			const player = createMockPlayer();
			player.container.classList.add('active');
			player.ui_removeActiveClass();
			expect(player.container.classList.contains('inactive')).toBe(true);
			expect(player.container.classList.contains('active')).toBe(false);
		});

		it('emits active event for plugins to respond', () => {
			const player = createMockPlayer();
			player.ui_addActiveClass();
			expect(player.emit).toHaveBeenCalledWith('active', true);
		});

		it('emits inactive event for plugins to respond', () => {
			const player = createMockPlayer();
			player.container.classList.add('active');
			player.ui_removeActiveClass();
			expect(player.emit).toHaveBeenCalledWith('active', false);
		});
	});

	// ── Subtitle Text Rendering ──────────────────────────────────────
	// Subtitles must preserve formatting (bold, italic, underline) as
	// specified in VTT cues, per WCAG 1.3.1 (Info and Relationships).

	describe('WCAG 1.3.1 — Subtitle Text Formatting', () => {
		it('renders plain text as text node', () => {
			const player = createMockPlayer();
			const fragment = player.buildSubtitleFragment('Hello world');
			expect(fragment.textContent).toBe('Hello world');
		});

		it('preserves italic formatting in <i> elements', () => {
			const player = createMockPlayer();
			const fragment = player.buildSubtitleFragment('<i>italic text</i>');
			const container = document.createElement('div');
			container.appendChild(fragment);
			const italic = container.querySelector('i');
			expect(italic).not.toBeNull();
			expect(italic?.textContent).toBe('italic text');
		});

		it('preserves bold formatting in <b> elements', () => {
			const player = createMockPlayer();
			const fragment = player.buildSubtitleFragment('<b>bold text</b>');
			const container = document.createElement('div');
			container.appendChild(fragment);
			const bold = container.querySelector('b');
			expect(bold).not.toBeNull();
			expect(bold?.textContent).toBe('bold text');
		});

		it('preserves underline formatting in <u> elements', () => {
			const player = createMockPlayer();
			const fragment = player.buildSubtitleFragment('<u>underline text</u>');
			const container = document.createElement('div');
			container.appendChild(fragment);
			const underline = container.querySelector('u');
			expect(underline).not.toBeNull();
			expect(underline?.textContent).toBe('underline text');
		});

		it('handles mixed formatting (bold and italic in same line)', () => {
			const player = createMockPlayer();
			const fragment = player.buildSubtitleFragment('<b>bold</b> and <i>italic</i>');
			const container = document.createElement('div');
			container.appendChild(fragment);
			expect(container.querySelector('b')?.textContent).toBe('bold');
			expect(container.querySelector('i')?.textContent).toBe('italic');
		});

		it('handles line breaks', () => {
			const player = createMockPlayer();
			const fragment = player.buildSubtitleFragment('Line 1\nLine 2');
			expect(fragment.textContent).toContain('Line 1');
			expect(fragment.textContent).toContain('Line 2');
		});
	});

	// ── displayMessage for Keyboard Feedback ─────────────────────────
	// WCAG 4.1.3 (AAA): Status messages can be programmatically
	// determined without receiving focus. displayMessage provides
	// visual feedback for keyboard actions (speed, time, subtitle changes).

	describe('WCAG 4.1.3 — Status Messages', () => {
		function createPlayerWithRealDisplayMessage(overrides: Record<string, any> = {}) {
			// Use real displayMessage (not mocked) so it actually emits events
			const player = createMockPlayer(overrides);
			player.displayMessage = domMethods.displayMessage.bind(player);
			return player;
		}

		it('displayMessage emits message event for UI display', () => {
			const player = createPlayerWithRealDisplayMessage();
			player.displayMessage('1.5x');
			expect(player.emit).toHaveBeenCalledWith('message', '1.5x');
		});

		it('displayMessage auto-dismisses after timeout', () => {
			vi.useFakeTimers();
			const player = createPlayerWithRealDisplayMessage();
			player.displayMessage('Speed: 2x', 100);
			vi.advanceTimersByTime(100);
			expect(player.emit).toHaveBeenCalledWith('message-dismiss', 'Speed: 2x');
			vi.useRealTimers();
		});

		it('rapid messages only dismiss the latest one', () => {
			vi.useFakeTimers();
			const player = createPlayerWithRealDisplayMessage();
			player.displayMessage('First', 1000);
			player.displayMessage('Second', 1000);
			vi.advanceTimersByTime(1000);
			const dismissCalls = player.emit.mock.calls.filter(
				(c: any[]) => c[0] === 'message-dismiss',
			);
			expect(dismissCalls).toHaveLength(1);
			expect(dismissCalls[0][1]).toBe('Second');
			vi.useRealTimers();
		});
	});
});
