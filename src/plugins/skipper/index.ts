import type { NMVideoPlayer } from '../../index';
import type { VideoPlaylistItem } from '../../types';
import { Plugin } from '@nomercy-entertainment/nomercy-player-core';

export const SKIPPER_KIND = {
	INTRO: 'intro',
	RECAP: 'recap',
	CREDITS: 'credits',
} as const;

/** Identifies which segment type the skipper acts on. */
export type SkipperKind = typeof SKIPPER_KIND[keyof typeof SKIPPER_KIND];

/** Start and end timestamps (in seconds) of a skippable segment. */
export interface SkipperRange {
	start: number;
	end: number;
}

/** A single skippable segment resolved from the playlist item. */
export interface SkipperEntry {
	kind: SkipperKind;
	range: SkipperRange;
}

/** Per-kind chapter-title pattern lists. Strings compile as `iu` regexes. */
export interface SkipperPatternSet {
	intro?: ReadonlyArray<string>;
	recap?: ReadonlyArray<string>;
	credits?: ReadonlyArray<string>;
}

/**
 * Chapter-title pattern configuration. The plugin ships defaults covering
 * common anime/TV naming (OP / Opening…, Recap, ED / Preview / Credits…);
 * `extend` merges additional patterns onto them, `replace` swaps a kind's
 * built-in list wholesale (extend still applies on top of a replace).
 */
export interface SkipperPatternOptions {
	extend?: SkipperPatternSet;
	replace?: SkipperPatternSet;
}

/** Options for {@link SkipperPlugin}. */
export interface SkipperOptions {
	/**
	 * Auto-skip default: `true` = every kind, or the specific kinds. The
	 * user-facing toggle is owned by the plugin — `autoSkip(value)` persists
	 * to plugin storage and the stored choice wins over this default on the
	 * next session.
	 */
	autoSkip?: boolean | ReadonlyArray<SkipperKind>;
	/** Show "Skip Intro" button N milliseconds after the range starts. Default 0. */
	revealAfterMs?: number;
	/** Chapter-title heuristic tuning. */
	patterns?: SkipperPatternOptions;
}

const DEFAULT_PATTERNS: Required<SkipperPatternSet> = {
	intro: [
		'^OP$',
		'^NCOP$',
		'^Opening',
		'^Opening Credits$',
		'^Opening Theme$',
		'^Opening Song$',
	],
	recap: [
		'^Recap',
		'^Previously',
	],
	credits: [
		'^ED$',
		'^PV$',
		'^NCED$',
		'^CM$',
		'^Preview$',
		'^Next Episode Preview$',
		'^Next Time Preview$',
		'^Outro$',
		'^Ending',
		'^ED\\+Cast$',
		'^Credits$',
		'^End Credits$',
		'^Closing$',
	],
};

const AUTO_SKIP_STORAGE_KEY = 'auto-skip';
/** v1 persisted the toggle under this raw localStorage key; honored as a fallback. */
const LEGACY_AUTO_SKIP_KEY = 'nmplayer-auto-skip';

/** Events emitted by {@link SkipperPlugin}. */
export interface SkipperEvents {
	'skipper:available': { kind: SkipperKind; range: SkipperRange };
	'skipper:hidden': { kind: SkipperKind };
	'skipper:skipped': { kind: SkipperKind; range: SkipperRange; auto: boolean };
}

const KINDS: ReadonlyArray<SkipperKind> = [SKIPPER_KIND.INTRO, SKIPPER_KIND.RECAP, SKIPPER_KIND.CREDITS];

/**
 * Skip-intro / skip-recap / skip-credits plugin.
 *
 * Range sources, in precedence order:
 *   1. `currentItem.skippers?: { intro?, recap?, credits? }` — consumer-
 *      supplied (server-authored segments, skip files).
 *   2. Chapter-title heuristic — derived internally from `player.chapters()`
 *      using the (configurable) pattern lists.
 *
 * Emits `skipper:available` so UI can render the "Skip" button and exposes
 * `skip(kind)` to jump past the range. Auto-skip is a persisted user toggle:
 * `autoSkip(value)` writes plugin storage; `options.autoSkip` is only the
 * default for users who never touched the toggle.
 */
export class SkipperPlugin extends Plugin<NMVideoPlayer<VideoPlaylistItem>, SkipperOptions, SkipperEvents> {
	static override readonly id: string = 'skipper';
	static override readonly version: string = '2.0.0';
	static override readonly description: string = 'Skip-intro / skip-recap / skip-credits with auto-skip + UI prompts';

	private active: SkipperKind | null = null;
	private _revealTimer: ReturnType<typeof setTimeout> | null = null;

	/** Persisted toggle state; `null` until restored / never set. */
	private _autoSkipState: boolean | ReadonlyArray<SkipperKind> | null = null;

	/** Heuristic ranges derived from the current item's chapters. */
	private _derived: SkipperEntry[] = [];

	/** Attaches `current`, `chapters` and `time` listeners. */
	override use(): void {
		this.on('current', () => {
			this.active = null;
			this._derived = [];
			this._cancelRevealTimer();
			this._deriveFromChapters();
		});

		this.on('chapters', () => {
			this._deriveFromChapters();
		});

		this.on('time', (data) => {
			this.onTimeUpdate(data?.time ?? 0);
		});

		this._deriveFromChapters();
		void this._restoreAutoSkip();
	}

	private _cancelRevealTimer(): void {
		if (this._revealTimer !== null) {
			clearTimeout(this._revealTimer);
			this._revealTimer = null;
		}
	}

	// ── Auto-skip toggle ────────────────────────────────────────────────────

	/**
	 * Read or write the auto-skip toggle.
	 *
	 * `autoSkip()` — effective kinds currently auto-skipped.
	 * `autoSkip(value)` — set + persist: `true` = every kind, `false` = off,
	 * or the specific kinds.
	 */
	autoSkip(): ReadonlyArray<SkipperKind>;
	autoSkip(value: boolean | ReadonlyArray<SkipperKind>): void;
	autoSkip(value?: boolean | ReadonlyArray<SkipperKind>): ReadonlyArray<SkipperKind> | void {
		if (value === undefined) {
			return this._effectiveAutoSkipKinds();
		}
		this._autoSkipState = value;
		void this.storage.setJSON(AUTO_SKIP_STORAGE_KEY, value);
	}

	private _effectiveAutoSkipKinds(): ReadonlyArray<SkipperKind> {
		const value = this._autoSkipState ?? this.opts?.autoSkip ?? false;
		if (value === true)
			return KINDS;
		if (value === false)
			return [];
		return value;
	}

	private async _restoreAutoSkip(): Promise<void> {
		const stored = await this.storage.getJSON<boolean | SkipperKind[]>(AUTO_SKIP_STORAGE_KEY);
		if (stored !== null && stored !== undefined) {
			this._autoSkipState = stored;
			return;
		}
		// v1 toggle migration — a raw 'true' under the legacy key.
		if (typeof localStorage !== 'undefined' && localStorage.getItem(LEGACY_AUTO_SKIP_KEY) === 'true') {
			this._autoSkipState = true;
		}
	}

	// ── Chapter-title heuristic ─────────────────────────────────────────────

	private _patternsFor(kind: SkipperKind): RegExp[] {
		const replaced = this.opts?.patterns?.replace?.[kind];
		const extended = this.opts?.patterns?.extend?.[kind] ?? [];
		const base = replaced ?? DEFAULT_PATTERNS[kind];
		return [...base, ...extended].map(pattern => new RegExp(pattern, 'iu'));
	}

	private _deriveFromChapters(): void {
		const chapters = this.player.chapters?.() ?? [];
		if (chapters.length === 0) {
			return;
		}

		const out: SkipperEntry[] = [];

		const introPatterns = this._patternsFor(SKIPPER_KIND.INTRO);
		const intro = chapters.find(chapter => introPatterns.some(pattern => pattern.test(chapter.title)));
		// An "intro" that is the final chapter has nothing to skip into.
		if (intro && chapters.indexOf(intro) < chapters.length - 1) {
			out.push({ kind: SKIPPER_KIND.INTRO, range: { start: intro.start, end: intro.end } });
		}

		const recapPatterns = this._patternsFor(SKIPPER_KIND.RECAP);
		const recap = chapters.find(chapter => recapPatterns.some(pattern => pattern.test(chapter.title)));
		if (recap) {
			out.push({ kind: SKIPPER_KIND.RECAP, range: { start: recap.start, end: recap.end } });
		}

		const creditsPatterns = this._patternsFor(SKIPPER_KIND.CREDITS);
		const credits = [...chapters].reverse().find(chapter => creditsPatterns.some(pattern => pattern.test(chapter.title)));
		if (credits) {
			out.push({ kind: SKIPPER_KIND.CREDITS, range: { start: credits.start, end: credits.end } });
		}

		this._derived = out;
	}

	/**
	 * Returns the current item's skipper list. Consumer-supplied
	 * `item.skippers` wins per kind; chapter-derived ranges fill the gaps.
	 */
	skippers(): SkipperEntry[] {
		const item = this.currentItem();
		const data = item?.skippers;
		const out: SkipperEntry[] = [];
		for (const kind of KINDS) {
			const range = data?.[kind];
			if (range && typeof range.start === 'number' && typeof range.end === 'number') {
				out.push({ kind, range: { start: range.start, end: range.end } });
				continue;
			}
			const derived = this._derived.find(entry => entry.kind === kind);
			if (derived) {
				out.push(derived);
			}
		}
		return out;
	}

	/** Jump the player past the named skipper range, or the active one if no kind given. */
	skip(kind?: SkipperKind): void {
		const target = kind ?? this.active;
		if (!target)
			return;
		const entry = this.skippers().find(e => e.kind === target);
		if (!entry)
			return;
		void this.player.time(entry.range.end);
		this.emit('skipper:skipped', { kind: entry.kind, range: entry.range, auto: false });
		if (this.active === target) {
			this.active = null;
			this.emit('skipper:hidden', { kind: target });
		}
	}

	/** Fetch a JSON skip file and parse into entries. */
	async fetchSkipFile(url: string): Promise<SkipperEntry[]> {
		const raw = await this.fetch<string>(url);
		const body: unknown = JSON.parse(raw);
		const entries = Array.isArray(body) ? (body as Array<{ type: SkipperKind; start: number; end: number }>) : [];
		return entries
			.filter(entry => entry && KINDS.includes(entry.type) && typeof entry.start === 'number' && typeof entry.end === 'number')
			.map(entry => ({ kind: entry.type, range: { start: entry.start, end: entry.end } }));
	}

	private currentItem(): VideoPlaylistItem | undefined {
		try {
			return this.player.item();
		}
		catch {
			return undefined;
		}
	}

	private onTimeUpdate(time: number): void {
		const list = this.skippers();
		const matching = list.find(entry => time >= entry.range.start && time <= entry.range.end);

		if (!matching) {
			if (this.active) {
				const prev = this.active;
				this.active = null;
				this._cancelRevealTimer();
				this.emit('skipper:hidden', { kind: prev });
			}
			return;
		}

		if (this.active === matching.kind)
			return;

		this.active = matching.kind;
		const auto = this._effectiveAutoSkipKinds().includes(matching.kind);

		if (auto) {
			void this.player.time(matching.range.end);
			this.emit('skipper:skipped', { kind: matching.kind, range: matching.range, auto: true });
			this.active = null;
			return;
		}

		const delayMs = this.opts?.revealAfterMs ?? 0;
		if (delayMs > 0) {
			this._cancelRevealTimer();
			const kind = matching.kind;
			const range = matching.range;
			this._revealTimer = setTimeout(() => {
				this._revealTimer = null;
				if (this.active === kind) {
					this.emit('skipper:available', { kind, range });
				}
			}, delayMs);
		}
		else {
			this.emit('skipper:available', { kind: matching.kind, range: matching.range });
		}
	}
}

/** Plugin alias for {@link SkipperPlugin}. Pass to `addPlugin(skipperPlugin)`. */
export const skipperPlugin = SkipperPlugin;
