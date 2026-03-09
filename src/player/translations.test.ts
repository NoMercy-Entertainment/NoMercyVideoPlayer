import { describe, expect, it, vi } from 'vitest';
import { resolveLocale, translationMethods } from './translations';

function createMockPlayer(overrides: Record<string, any> = {}) {
	const player: any = {
		translations: null as any,
		defaultTranslations: {} as any,
		options: { language: 'en' },
		emit: vi.fn(),
		logger: { error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
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

describe('resolveLocale()', () => {
	it('returns exact match for base language', () => {
		expect(resolveLocale('nl')).toBe('nl');
	});

	it('resolves regional locale to base language', () => {
		expect(resolveLocale('nl-NL')).toBe('nl');
		expect(resolveLocale('nl-BE')).toBe('nl');
		expect(resolveLocale('fr-FR')).toBe('fr');
		expect(resolveLocale('de-AT')).toBe('de');
		expect(resolveLocale('en-US')).toBe('en');
		expect(resolveLocale('en-GB')).toBe('en');
	});

	it('returns exact match for locales with real differences', () => {
		expect(resolveLocale('pt-BR')).toBe('pt-BR');
		expect(resolveLocale('zh-TW')).toBe('zh-TW');
	});

	it('falls back to en for unknown locales', () => {
		expect(resolveLocale('xx')).toBe('en');
		expect(resolveLocale('xx-YY')).toBe('en');
	});
});

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

		it('uses Intl.DisplayNames for ISO 639-3 language codes', () => {
			const player = createMockPlayer({ options: { language: 'en' } });
			expect(player.localize('spa')).toBe('Spanish');
			expect(player.localize('eng')).toBe('English');
			expect(player.localize('jpn')).toBe('Japanese');
			expect(player.localize('xyz')).toBe('xyz'); // truly unknown → pass-through
		});

		it('uses Intl.DisplayNames in the correct display language', () => {
			const player = createMockPlayer({ options: { language: 'nl' } });
			expect(player.localize('eng')).toBe('Engels');
			expect(player.localize('deu')).toBe('Duits');
			expect(player.localize('spa')).toBe('Spaans');
		});

		it('loaded translations override Intl.DisplayNames for language codes', () => {
			const player = createMockPlayer({
				options: { language: 'en' },
				translations: { eng: 'English (custom)' },
			});
			expect(player.localize('eng')).toBe('English (custom)');
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
		it('adds multiple translations from array', () => {
			const player = createMockPlayer();
			player.addTranslations([
				{ key: 'Play', value: 'Afspelen' },
				{ key: 'Pause', value: 'Pauzeren' },
			]);
			expect(player.translations.Play).toBe('Afspelen');
			expect(player.translations.Pause).toBe('Pauzeren');
		});

		it('adds multiple translations from Record', () => {
			const player = createMockPlayer();
			player.addTranslations({
				Play: 'Afspelen',
				Pause: 'Pauzeren',
			});
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
		it('loads built-in locale from bundled data without network request', async () => {
			const player = createMockPlayer();
			await player.fetchTranslationsFile();
			// Bundled locale — getFileContents must NOT be called for built-in
			expect(player.getFileContents).not.toHaveBeenCalled();
			expect(player.translations.off).toBe('Off'); // key present in en.json
		});

		it('emits translations with builtin source', async () => {
			const player = createMockPlayer();
			await player.fetchTranslationsFile();
			expect(player.emit).toHaveBeenCalledWith(
				'translations',
				expect.objectContaining({
					source: 'builtin:en',
				}),
			);
		});

		it('emits translationsLoaded with language and files', async () => {
			const player = createMockPlayer();
			await player.fetchTranslationsFile();
			expect(player.emit).toHaveBeenCalledWith(
				'translationsLoaded',
				expect.objectContaining({
					language: 'en',
					files: ['builtin:en'],
				}),
			);
		});

		it('resolves regional locale to base bundled file (no 404)', async () => {
			const player = createMockPlayer({ options: { language: 'nl-NL' } });
			await player.fetchTranslationsFile();
			// nl.json is bundled — no network request, nl locale data applied
			expect(player.getFileContents).not.toHaveBeenCalled();
			expect(player.translations.off).toBe('Uit'); // key from nl.json
		});

		it('loads pt-BR bundled locale for Brazilian Portuguese', async () => {
			const player = createMockPlayer({ options: { language: 'pt-BR' } });
			await player.fetchTranslationsFile();
			expect(player.getFileContents).not.toHaveBeenCalled();
			expect(player.translations.off).toBe('Desligado'); // key from pt-BR.json
		});

		it('loads zh-TW bundled locale for Traditional Chinese', async () => {
			const player = createMockPlayer({ options: { language: 'zh-TW' } });
			await player.fetchTranslationsFile();
			expect(player.getFileContents).not.toHaveBeenCalled();
			expect(player.emit).toHaveBeenCalledWith(
				'translationsLoaded',
				expect.objectContaining({ language: 'zh-TW' }),
			);
		});

		it('falls back to en for unknown locales', async () => {
			const player = createMockPlayer({ options: { language: 'xx-YY' } });
			await player.fetchTranslationsFile();
			expect(player.getFileContents).not.toHaveBeenCalled();
			expect(player.translations.off).toBe('Off'); // en.json data
			expect(player.emit).toHaveBeenCalledWith(
				'translationsLoaded',
				expect.objectContaining({ language: 'en' }),
			);
		});

		it('loads custom translation files from config via getFileContents', async () => {
			const player = createMockPlayer({
				options: {
					language: 'en',
					translations: ['http://example.com/locales/{lang}/ui.json'],
				},
				getFileContents: vi.fn(({ callback }: any) => {
					callback(JSON.stringify({ Play: 'Play', Pause: 'Pause' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(player.translations.Play).toBe('Play');
			// Built-in bundled data also present
			expect(player.translations.off).toBe('Off');
		});

		it('custom translations override built-in translations', async () => {
			const player = createMockPlayer({
				options: {
					language: 'en',
					translations: ['http://example.com/locales/{lang}/custom.json'],
				},
				getFileContents: vi.fn(({ callback }: any) => {
					callback(JSON.stringify({ off: 'Custom Off' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(player.translations.off).toBe('Custom Off');
		});

		it('does not warn when built-in translations load successfully', async () => {
			const player = createMockPlayer();
			await player.fetchTranslationsFile();
			expect(player.logger.warn).not.toHaveBeenCalled();
		});
	});
});
