import { describe, expect, it } from 'vitest';
import { createDashboardMockState, mockDashboardDataProvider } from '@/dashboard/mockDashboardDataProvider';

describe('mock dashboard data provider', () => {
  it('returns deterministic success data with stable ids', async () => {
    const first = await mockDashboardDataProvider.load();
    const second = await mockDashboardDataProvider.load();

    expect(second).toEqual(first);
    expect(first.status).toBe('success');

    if (first.status === 'success') {
      expect(first.data.metrics.map((metric) => metric.id)).toEqual([
        'active-products',
        'pending-orders',
        'today-orders',
        'fulfillment',
      ]);
      expect(first.data.activity).toHaveLength(3);
      expect(first.data.series).toHaveLength(7);
    }
  });

  it('can represent loading, empty and error states explicitly', () => {
    expect(createDashboardMockState('loading').status).toBe('loading');
    expect(createDashboardMockState('empty').status).toBe('empty');
    expect(createDashboardMockState('error').status).toBe('error');
  });
});
