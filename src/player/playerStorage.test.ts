import { describe, expect, it, vi } from 'vitest';
import { PlayerStorage } from './playerStorage';
import type { StorageInterface } from '../types';

function createMockStorage(): StorageInterface {
	const store = new Map<string, string>();
	return {
		get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
		set: vi.fn((key: string, value: string) => {
			store.set(key, value);
			return Promise.resolve();
		}),
		remove: vi.fn((key: string) => {
			store.delete(key);
			return Promise.resolve();
		}),
	};
}

describe('PlayerStorage', () => {
	describe('get', () => {
		it('returns default value when key not found', async () => {
			const storage = new PlayerStorage(createMockStorage());
			expect(await storage.get('missing', 42)).toBe(42);
		});

		it('parses number when default is number', async () => {
			const mock = createMockStorage();
			const storage = new PlayerStorage(mock);
			await storage.set('vol', 75);
			expect(await storage.get('vol', 0)).toBe(75);
		});

		it('returns default for NaN when default is number', async () => {
			const mock = createMockStorage();
			await mock.set('key', 'not-a-number');
			const storage = new PlayerStorage(mock);
			expect(await storage.get('key', 50)).toBe(50);
		});

		it('parses JSON objects', async () => {
			const mock = createMockStorage();
			const storage = new PlayerStorage(mock);
			await storage.set('obj', { foo: 'bar' });
			expect(await storage.get('obj', {})).toEqual({ foo: 'bar' });
		});

		it('returns raw string when JSON.parse fails', async () => {
			const mock = createMockStorage();
			await mock.set('key', 'plain-text');
			const storage = new PlayerStorage(mock);
			expect(await storage.get('key', '')).toBe('plain-text');
		});
	});

	describe('set', () => {
		it('rounds numbers', async () => {
			const mock = createMockStorage();
			const storage = new PlayerStorage(mock);
			await storage.set('vol', 75.7);
			expect(mock.set).toHaveBeenCalledWith('vol', '76');
		});

		it('stringifies objects', async () => {
			const mock = createMockStorage();
			const storage = new PlayerStorage(mock);
			await storage.set('data', { a: 1 });
			expect(mock.set).toHaveBeenCalledWith('data', '{"a":1}');
		});

		it('converts strings directly', async () => {
			const mock = createMockStorage();
			const storage = new PlayerStorage(mock);
			await storage.set('lang', 'eng');
			expect(mock.set).toHaveBeenCalledWith('lang', 'eng');
		});
	});

	describe('remove', () => {
		it('calls storage.remove', async () => {
			const mock = createMockStorage();
			const storage = new PlayerStorage(mock);
			await storage.remove('key');
			expect(mock.remove).toHaveBeenCalledWith('key');
		});
	});
});
