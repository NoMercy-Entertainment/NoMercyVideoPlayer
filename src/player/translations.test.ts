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
		it('loads built-in locale file', async () => {
			const player = createMockPlayer({
				getFileContents: vi.fn(({ callback }: any) => {
					callback(JSON.stringify({ eng: 'English' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(player.getFileContents).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining('/en.json'),
				}),
			);
			expect(player.translations.eng).toBe('English');
		});

		it('emits translations per file with source and data', async () => {
			const player = createMockPlayer({
				getFileContents: vi.fn(({ callback }: any) => {
					callback(JSON.stringify({ eng: 'English' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(player.emit).toHaveBeenCalledWith(
				'translations',
				expect.objectContaining({
					source: expect.stringContaining('/en.json'),
					data: { eng: 'English' },
				}),
			);
		});

		it('emits translationsLoaded with language and files', async () => {
			const player = createMockPlayer({
				getFileContents: vi.fn(({ callback }: any) => {
					callback(JSON.stringify({ eng: 'English' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(player.emit).toHaveBeenCalledWith(
				'translationsLoaded',
				expect.objectContaining({
					language: 'en',
					files: expect.arrayContaining([expect.stringContaining('/en.json')]),
				}),
			);
		});

		it('resolves regional locale to base file (no 404)', async () => {
			const urls: string[] = [];
			const player = createMockPlayer({
				options: { language: 'nl-NL' },
				getFileContents: vi.fn(({ url, callback }: any) => {
					urls.push(url);
					callback(JSON.stringify({ dut: 'Nederlands' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			// Should fetch nl.json directly, not nl-NL.json
			expect(urls[0]).toContain('/nl.json');
			expect(urls).toHaveLength(1);
			expect(player.translations.dut).toBe('Nederlands');
		});

		it('fetches pt-BR.json for Brazilian Portuguese', async () => {
			const urls: string[] = [];
			const player = createMockPlayer({
				options: { language: 'pt-BR' },
				getFileContents: vi.fn(({ url, callback }: any) => {
					urls.push(url);
					callback(JSON.stringify({ por: 'Português' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(urls[0]).toContain('/pt-BR.json');
		});

		it('fetches zh-TW.json for Traditional Chinese', async () => {
			const urls: string[] = [];
			const player = createMockPlayer({
				options: { language: 'zh-TW' },
				getFileContents: vi.fn(({ url, callback }: any) => {
					urls.push(url);
					callback(JSON.stringify({ chi: '中文' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(urls[0]).toContain('/zh-TW.json');
		});

		it('falls back to en for unknown locales', async () => {
			const player = createMockPlayer({
				options: { language: 'xx-YY' },
				getFileContents: vi.fn(({ _url, callback }: any) => {
					callback(JSON.stringify({ eng: 'English' }));
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(player.getFileContents).toHaveBeenCalledWith(
				expect.objectContaining({ url: expect.stringContaining('/en.json') }),
			);
			expect(player.translations.eng).toBe('English');
		});

		it('loads custom translation files from config', async () => {
			const player = createMockPlayer({
				options: {
					language: 'en',
					translations: ['/locales/{lang}/ui.json'],
				},
				getFileContents: vi.fn(({ url, callback }: any) => {
					if (url.includes('/ui.json')) {
						callback(JSON.stringify({ Play: 'Play', Pause: 'Pause' }));
					}
					else {
						callback(JSON.stringify({ eng: 'English' }));
					}
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(player.translations.Play).toBe('Play');
			expect(player.translations.eng).toBe('English');
		});

		it('custom translations override built-in translations', async () => {
			const player = createMockPlayer({
				options: {
					language: 'en',
					translations: ['/locales/{lang}/custom.json'],
				},
				getFileContents: vi.fn(({ url, callback }: any) => {
					if (url.includes('/custom.json')) {
						callback(JSON.stringify({ eng: 'Custom English' }));
					}
					else {
						callback(JSON.stringify({ eng: 'English' }));
					}
					return Promise.resolve();
				}),
			});
			await player.fetchTranslationsFile();
			expect(player.translations.eng).toBe('Custom English');
		});

		it('logs warning when no translations found', async () => {
			const player = createMockPlayer({
				getFileContents: vi.fn(() => Promise.reject(new Error('Network error'))),
			});
			await player.fetchTranslationsFile();
			expect(player.logger.warn).toHaveBeenCalledWith(
				'No translations file found, using key passthrough',
			);
		});
	});
});
