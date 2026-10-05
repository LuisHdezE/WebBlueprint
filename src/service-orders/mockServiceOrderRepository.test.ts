import { describe, expect, it } from 'vitest';
import { mockServiceOrderRepository } from '@/service-orders/mockServiceOrderRepository';

describe('mockServiceOrderRepository', () => {
  it('returns a complete deterministic service order detail', async () => {
    const result = await mockServiceOrderRepository.getById('service-order-2402');

    expect(result.status).toBe('success');
    if (result.status !== 'success') {
      return;
    }

    expect(result.order.reference).toBe('OS-2402');
    expect(result.order.assignments).toHaveLength(2);
    expect(result.order.resources).toHaveLength(2);
    expect(result.order.evidence).toHaveLength(3);
    expect(result.order.activity).toHaveLength(5);
    expect(result.order.financial.totalLabel).toBe('$ 9.150');
  });

  it('returns an explicit empty state for an unknown order', async () => {
    const result = await mockServiceOrderRepository.getById('missing-order');
    expect(result.status).toBe('empty');
  });
});
