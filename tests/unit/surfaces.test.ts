import { describe, it, expect } from 'vitest';
import { surfaces, community, getDocsRepositoryBase } from '../../lib/surfaces';

describe('surfaces', () => {
  it('has all required surface URLs', () => {
    expect(surfaces.api).toBeDefined();
    expect(surfaces.console).toBeDefined();
    expect(surfaces.app).toBeDefined();
    expect(surfaces.docs).toBeDefined();
    expect(surfaces.status).toBeDefined();
  });

  it('defaults to isa.io domains', () => {
    expect(surfaces.api).toContain('isa.io');
    expect(surfaces.console).toContain('isa.io');
  });
});

describe('community', () => {
  it('has GitHub, Discord, Twitter links', () => {
    expect(community.github).toContain('github.com');
    expect(community.discord).toContain('discord');
    expect(community.twitter).toContain('twitter');
  });
});

describe('getDocsRepositoryBase', () => {
  it('returns a valid GitHub URL with content path', () => {
    const base = getDocsRepositoryBase();
    expect(base).toContain('github.com');
    expect(base).toContain('tree/main/content');
  });
});
