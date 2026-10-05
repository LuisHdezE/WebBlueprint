import { describe, expect, it } from 'vitest';
import { mockAlertCenterRepository } from '@/alerts-center/mockAlertCenterRepository';

describe('mockAlertCenterRepository', () => {
  it('returns the full alert center summary deterministically', async () => {
    const result = await mockAlertCenterRepository.list({ severity: 'all', status: 'all' });

    expect(result.status).toBe('success');
    if (result.status !== 'success') {
      return;
    }

    expect(result.alerts).toHaveLength(6);
    expect(result.summary).toEqual({
      open: 4,
      critical: 2,
      warning: 3,
      acknowledged: 1,
    });
  });

  it('filters by severity and status', async () => {
    const result = await mockAlertCenterRepository.list({ severity: 'warning', status: 'open' });

    expect(result.status).toBe('success');
    if (result.status !== 'success') {
      return;
    }

    expect(result.alerts).toHaveLength(2);
    expect(result.alerts.every((alert) => alert.severity === 'warning' && alert.status === 'open')).toBe(true);
  });

  it('returns an explicit empty state when no alert matches', async () => {
    const result = await mockAlertCenterRepository.list({ severity: 'critical', status: 'resolved' });
    expect(result.status).toBe('empty');
  });
});
