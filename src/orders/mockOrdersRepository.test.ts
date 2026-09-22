import { describe, expect, it } from 'vitest';
import { mockOrdersRepository } from '@/orders/mockOrdersRepository';

describe('mockOrdersRepository', () => {
  it('returns deterministic orders for the same filter', async () => {
    const filter = { search: '', status: 'all' as const };

    const first = await mockOrdersRepository.list(filter);
    const second = await mockOrdersRepository.list(filter);

    expect(second).toEqual(first);
    expect(first.status).toBe('success');
    if (first.status === 'success') {
      expect(first.total).toBe(9);
    }
  });

  it('filters by order number or customer name', async () => {
    const byNumber = await mockOrdersRepository.list({ search: '1057', status: 'all' });
    const byCustomer = await mockOrdersRepository.list({ search: 'lucia', status: 'all' });

    expect(byNumber.status).toBe('success');
    expect(byCustomer.status).toBe('success');

    if (byNumber.status === 'success') {
      expect(byNumber.orders.map((order) => order.number)).toEqual(['#PS-1057']);
    }

    if (byCustomer.status === 'success') {
      expect(byCustomer.orders.map((order) => order.customerName)).toEqual(['Lucía Fernández']);
    }
  });

  it('filters by status and combines status with search', async () => {
    const ready = await mockOrdersRepository.list({ search: '', status: 'ready' });
    const combined = await mockOrdersRepository.list({ search: 'gomez', status: 'ready' });

    expect(ready.status).toBe('success');
    if (ready.status === 'success') {
      expect(ready.orders.every((order) => order.status === 'ready')).toBe(true);
      expect(ready.total).toBe(2);
    }

    expect(combined.status).toBe('success');
    if (combined.status === 'success') {
      expect(combined.orders.map((order) => order.id)).toEqual(['order-1052']);
    }
  });

  it('exposes an empty state when filters do not match', async () => {
    const result = await mockOrdersRepository.list({ search: 'camila', status: 'completed' });

    expect(result).toEqual({
      status: 'empty',
      message: 'No encontramos pedidos que coincidan con los filtros actuales.',
    });
  });
});
