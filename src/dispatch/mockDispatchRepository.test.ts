import { describe, expect, it } from 'vitest';
import { mockDispatchRepository } from '@/dispatch/mockDispatchRepository';

describe('mockDispatchRepository', () => {
  it('returns the complete operational day deterministically', async () => {
    const result = await mockDispatchRepository.load({ status: 'all' });

    expect(result.status).toBe('success');
    if (result.status !== 'success') {
      return;
    }

    expect(result.tasks).toHaveLength(5);
    expect(result.tasks.map((task) => task.scheduledTime)).toEqual(['08:00', '09:30', '11:00', '14:30', '16:00']);
  });

  it('filters tasks by operational status', async () => {
    const result = await mockDispatchRepository.load({ status: 'delayed' });

    expect(result.status).toBe('success');
    if (result.status !== 'success') {
      return;
    }

    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0]?.reference).toBe('OS-2404');
  });

  it('returns an explicit empty state when a status has no tasks', async () => {
    const result = await mockDispatchRepository.load({ status: 'completed' });
    expect(result.status).toBe('empty');
  });
});
