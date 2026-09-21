import { describe, expect, it } from 'vitest';
import { mockProductsRepository } from '@/products/mockProductsRepository';

describe('mockProductsRepository', () => {
  it('returns deterministic products for the same filter', async () => {
    const filter = { search: '', stockState: 'all' as const };

    const first = await mockProductsRepository.list(filter);
    const second = await mockProductsRepository.list(filter);

    expect(second).toEqual(first);
    expect(first.status).toBe('success');
    if (first.status === 'success') {
      expect(first.total).toBe(8);
    }
  });

  it('filters by text across name, sku and category', async () => {
    const byName = await mockProductsRepository.list({ search: 'collar', stockState: 'all' });
    const bySku = await mockProductsRepository.list({ search: 'PET-HIG-014', stockState: 'all' });
    const byCategory = await mockProductsRepository.list({ search: 'higiene', stockState: 'all' });

    expect(byName.status).toBe('success');
    expect(bySku.status).toBe('success');
    expect(byCategory.status).toBe('success');

    if (byCategory.status === 'success') {
      expect(byCategory.total).toBe(2);
    }
  });

  it('combines search with stock state and exposes empty results', async () => {
    const lowStock = await mockProductsRepository.list({ search: '', stockState: 'low-stock' });
    const empty = await mockProductsRepository.list({ search: 'transportadora', stockState: 'in-stock' });

    expect(lowStock.status).toBe('success');
    if (lowStock.status === 'success') {
      expect(lowStock.products.every((product) => product.stockState === 'low-stock')).toBe(true);
    }

    expect(empty).toEqual({
      status: 'empty',
      message: 'No encontramos productos que coincidan con los filtros actuales.',
    });
  });
});
