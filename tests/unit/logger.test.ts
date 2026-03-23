import { describe, it, expect, vi } from 'vitest';
import { logger } from '../../lib/logger';

describe('logger', () => {
  it('logs info messages', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('test message');
    expect(spy).toHaveBeenCalledWith('[INFO]', 'test message');
    spy.mockRestore();
  });

  it('logs errors with context', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('bad thing', { code: 500 });
    expect(spy).toHaveBeenCalledWith('[ERROR]', 'bad thing', { code: 500 });
    spy.mockRestore();
  });

  it('logs warnings', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('careful');
    expect(spy).toHaveBeenCalledWith('[WARN]', 'careful');
    spy.mockRestore();
  });
});
