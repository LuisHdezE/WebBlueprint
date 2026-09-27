import { describe, expect, it } from 'vitest';
import { mockInventoryRepository } from './mockInventoryRepository';
describe('mock inventory repository', () => {
  it('filters by health and search deterministically', async () => { const result = await mockInventoryRepository.list({ search: 'higiene', health: 'reorder' }); expect(result).toMatchObject({ status: 'success', total: 1 }); });
  it('returns an explicit empty state', async () => { expect(await mockInventoryRepository.list({ search: 'inexistente', health: 'all' })).toMatchObject({ status: 'empty' }); });
});
