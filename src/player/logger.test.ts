import { describe, expect, it, vi } from 'vitest';
import { Logger } from './logger';
import type { LogHandler } from './logger';

describe('logger', () => {
	describe('level filtering', () => {
		it('logs error at error level', () => {
			const handler = vi.fn();
			const logger = new Logger({ level: 'error', handler });
			logger.error('test');
			expect(handler).toHaveBeenCalledTimes(1);
		});

		it('suppresses warn at error level', () => {
			const handler = vi.fn();
			const logger = new Logger({ level: 'error', handler });
			logger.warn('test');
			expect(handler).not.toHaveBeenCalled();
		});

		it('suppresses debug at warn level', () => {
			const handler = vi.fn();
			const logger = new Logger({ level: 'warn', handler });
			logger.debug('test');
			expect(handler).not.toHaveBeenCalled();
		});

		it('allows warn at warn level', () => {
			const handler = vi.fn();
			const logger = new Logger({ level: 'warn', handler });
			logger.warn('test');
			expect(handler).toHaveBeenCalledTimes(1);
		});

		it('allows all levels at verbose', () => {
			const handler = vi.fn();
			const logger = new Logger({ level: 'verbose', handler });
			logger.error('e');
			logger.warn('w');
			logger.info('i');
			logger.debug('d');
			logger.verbose('v');
			expect(handler).toHaveBeenCalledTimes(5);
		});
	});

	describe('custom handler', () => {
		it('receives level, category, message, and context', () => {
			const handler: LogHandler = vi.fn();
			const logger = new Logger({ level: 'debug', category: 'Player', handler });
			logger.debug('test message', { key: 'value' });
			expect(handler).toHaveBeenCalledWith('debug', 'Player', 'test message', { key: 'value' });
		});
	});

	describe('default handler', () => {
		it('uses console.error for error level', () => {
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const logger = new Logger({ level: 'error' });
			logger.error('test error');
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});

		it('uses console.warn for warn level', () => {
			const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const logger = new Logger({ level: 'warn' });
			logger.warn('test warn');
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});

		it('uses console.log for info/debug/verbose', () => {
			const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
			const logger = new Logger({ level: 'verbose' });
			logger.info('test info');
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});
	});

	describe('defaults', () => {
		it('defaults to error level', () => {
			const handler = vi.fn();
			const logger = new Logger({ handler });
			logger.error('should log');
			logger.warn('should not');
			expect(handler).toHaveBeenCalledTimes(1);
		});

		it('defaults to empty category', () => {
			const handler = vi.fn();
			const logger = new Logger({ level: 'error', handler });
			logger.error('test');
			expect(handler).toHaveBeenCalledWith('error', '', 'test', undefined);
		});
	});
});
