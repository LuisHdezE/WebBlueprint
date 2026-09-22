import { describe, expect, it } from 'vitest';
import { mockCustomersRepository } from '@/customers/mockCustomersRepository';

describe('mockCustomersRepository', () => {
  it('returns deterministic customers for the same filter', async () => {
    const filter = { search: '', relationshipState: 'all' as const };

    const first = await mockCustomersRepository.list(filter);
    const second = await mockCustomersRepository.list(filter);

    expect(second).toEqual(first);
    expect(first.status).toBe('success');
    if (first.status === 'success') {
      expect(first.total).toBe(8);
    }
  });

  it('filters by name, email and phone', async () => {
    const byName = await mockCustomersRepository.list({ search: 'camila', relationshipState: 'all' });
    const byEmail = await mockCustomersRepository.list({ search: 'pablo.rodriguez', relationshipState: 'all' });
    const byPhone = await mockCustomersRepository.list({ search: '821 114', relationshipState: 'all' });

    expect(byName.status).toBe('success');
    expect(byEmail.status).toBe('success');
    expect(byPhone.status).toBe('success');
  });

  it('combines search and relationship filters and exposes empty results', async () => {
    const inactive = await mockCustomersRepository.list({ search: '', relationshipState: 'inactive' });
    const empty = await mockCustomersRepository.list({ search: 'camila', relationshipState: 'inactive' });

    expect(inactive.status).toBe('success');
    if (inactive.status === 'success') {
      expect(inactive.customers.every((customer) => customer.relationshipState === 'inactive')).toBe(true);
    }

    expect(empty).toEqual({
      status: 'empty',
      message: 'No encontramos clientes que coincidan con los filtros actuales.',
    });
  });
});
