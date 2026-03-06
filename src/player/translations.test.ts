import { describe, expect, it, vi } from 'vitest';
import { translationMethods } from './translations';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const player: any = {
		translations: null as any,
		defaultTranslations: {} as any,
		options: { language: 'en' },
		emit: vi.fn(),
		logger: { error: vi.fn() },
		getFileContents: vi.fn(() => Promise.resolve()),
		...overrides,
	};

	for (const [key, value] of Object.entries(translationMethods)) {
		if (typeof value === 'function') {
			player[key] = (value as Function).bind(player);
		}
	}

	return player;
}

describe('translationMethods', () => {
	describe('localize()', () => {
		it('returns translated value when found in translations', () => {
			const player = createMockPlayer({
				translations: { Play: 'Afspelen' },
			});
			expect(player.localize('Play')).toBe('Afspelen');
		});

		it('falls back to defaultTranslations', () => {
			const player = createMockPlayer({
				translations: null,
				defaultTranslations: { Play: 'Play Default' },
			});
			expect(player.localize('Play')).toBe('Play Default');
		});

		it('returns original value when no translation found', () => {
			const player = createMockPlayer();
			expect(player.localize('Unknown Key')).toBe('Unknown Key');
		});

		it('prefers translations over defaultTranslations', () => {
			const player = createMockPlayer({
				translations: { Play: 'Custom' },
				defaultTranslations: { Play: 'Default' },
			});
			expect(player.localize('Play')).toBe('Custom');
		});
	});

	describe('setTitle()', () => {
		it('sets document title', () => {
			const player = createMockPlayer();
			player.setTitle('My Video');
			expect(document.title).toBe('My Video');
		});
	});

	describe('addTranslation()', () => {
		it('adds a single translation', () => {
			const player = createMockPlayer();
			player.addTranslation('Pause', 'Pauzeren');
			expect(player.translations.Pause).toBe('Pauzeren');
		});

		it('creates translations object if null', () => {
			const player = createMockPlayer({ translations: null });
			player.addTranslation('Play', 'Afspelen');
			expect(player.translations).not.toBeNull();
			expect(player.translations.Play).toBe('Afspelen');
		});
	});

	describe('addTranslations()', () => {
		it('adds multiple translations', () => {
			const player = createMockPlayer();
			player.addTranslations([
				{ key: 'Play', value: 'Afspelen' },
				{ key: 'Pause', value: 'Pauzeren' },
			]);
			expect(player.translations.Play).toBe('Afspelen');
			expect(player.translations.Pause).toBe('Pauzeren');
		});

		it('creates translations object if null', () => {
			const player = createMockPlayer({ translations: null });
			player.addTranslations([{ key: 'Play', value: 'Afspelen' }]);
			expect(player.translations).not.toBeNull();
		});
	});

	describe('fetchTranslationsFile()', () => {
		it('calls getFileContents with language URL', async () => {
			const player = createMockPlayer();
			await player.fetchTranslationsFile();
			expect(player.getFileContents).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('en.json'),
				}),
			);
		});

		it('logs error on failure', async () => {
			const player = createMockPlayer({
				getFileContents: vi.fn(() => Promise.reject(new Error('Network error'))),
			});
			await player.fetchTranslationsFile();
			expect(player.logger.error).toHaveBeenCalledWith(
				'Failed to fetch translations file',
				expect.objectContaining({ error: expect.stringContaining('Network error') }),
			);
		});
	});
});
