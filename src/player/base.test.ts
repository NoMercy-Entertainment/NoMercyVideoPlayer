import { describe, expect, it, vi } from 'vitest';
import { Base } from './base';

describe('base (event emitter)', () => {
	function createBase() {
		return new Base();
	}

	describe('on + emit', () => {
		it('calls callback with correct payload', () => {
			const base = createBase();
			const cb = vi.fn();
			base.on('play', cb);
			base.emit('play');
			expect(cb).toHaveBeenCalledTimes(1);
		});

		it('passes data through CustomEvent.detail', () => {
			const base = createBase();
			const cb = vi.fn();
			base.on('time' as any, cb);
			base.emit('time' as any, { currentTime: 10 });
			expect(cb).toHaveBeenCalledWith({ currentTime: 10 });
		});

		it('supports multiple listeners on same event', () => {
			const base = createBase();
			const cb1 = vi.fn();
			const cb2 = vi.fn();
			base.on('play', cb1);
			base.on('play', cb2);
			base.emit('play');
			expect(cb1).toHaveBeenCalledTimes(1);
			expect(cb2).toHaveBeenCalledTimes(1);
		});
	});

	describe('off', () => {
		it('removes specific listener by callback', () => {
			const base = createBase();
			const cb = vi.fn();
			base.on('play', cb);
			base.off('play', cb);
			base.emit('play');
			expect(cb).not.toHaveBeenCalled();
		});

		it('removes all listeners for an event when no callback given', () => {
			const base = createBase();
			const cb1 = vi.fn();
			const cb2 = vi.fn();
			base.on('play', cb1);
			base.on('play', cb2);
			base.off('play');
			base.emit('play');
			expect(cb1).not.toHaveBeenCalled();
			expect(cb2).not.toHaveBeenCalled();
		});

		it('clears all events with off("all")', () => {
			const base = createBase();
			const cb1 = vi.fn();
			const cb2 = vi.fn();
			base.on('play', cb1);
			base.on('pause' as any, cb2);
			base.off('all');
			base.emit('play');
			base.emit('pause' as any);
			expect(cb1).not.toHaveBeenCalled();
			expect(cb2).not.toHaveBeenCalled();
			expect(base.events).toHaveLength(0);
		});

		it('does not remove other event types', () => {
			const base = createBase();
			const playCb = vi.fn();
			const pauseCb = vi.fn();
			base.on('play', playCb);
			base.on('pause' as any, pauseCb);
			base.off('play');
			base.emit('play');
			base.emit('pause' as any);
			expect(playCb).not.toHaveBeenCalled();
			expect(pauseCb).toHaveBeenCalledTimes(1);
		});
	});

	describe('once', () => {
		it('fires only once', () => {
			const base = createBase();
			const cb = vi.fn();
			base.once('play', cb);
			base.emit('play');
			base.emit('play');
			expect(cb).toHaveBeenCalledTimes(1);
		});
	});

	describe('emit with no listeners', () => {
		it('does not throw', () => {
			const base = createBase();
			expect(() => base.emit('play')).not.toThrow();
		});
	});

	describe('hasListeners', () => {
		it('returns false when no listeners registered', () => {
			const base = createBase();
			expect(base.hasListeners('pip')).toBe(false);
		});

		it('returns true after registering a listener', () => {
			const base = createBase();
			base.on('pip' as any, () => {});
			expect(base.hasListeners('pip')).toBe(true);
		});

		it('returns false after removing all listeners', () => {
			const base = createBase();
			const cb = () => {};
			base.on('pip' as any, cb);
			base.off('pip' as any, cb);
			expect(base.hasListeners('pip')).toBe(false);
		});

		it('works for any event name', () => {
			const base = createBase();
			base.on('back' as any, () => {});
			expect(base.hasListeners('back')).toBe(true);
			expect(base.hasListeners('close')).toBe(false);
		});
	});

	describe('events array tracking', () => {
		it('tracks registered events', () => {
			const base = createBase();
			const cb = vi.fn();
			base.on('play', cb);
			expect(base.events).toHaveLength(1);
			expect(base.events[0].type).toBe('play');
		});

		it('stores original callback reference', () => {
			const base = createBase();
			const cb = vi.fn();
			base.on('play', cb);
			expect(base.events[0].fn.original).toBe(cb);
		});

		it('removes from events array on off()', () => {
			const base = createBase();
			const cb = vi.fn();
			base.on('play', cb);
			base.off('play', cb);
			expect(base.events).toHaveLength(0);
		});
	});
});
