import { describe, expect, it } from 'vitest';
import { mockAssetRepository } from '@/assets/mockAssetRepository';

describe('mockAssetRepository', () => {
  it('returns a deterministic asset with maintenance history', async () => {
    const result = await mockAssetRepository.getById('asset-018');

    expect(result.status).toBe('success');
    if (result.status !== 'success') {
      return;
    }

    expect(result.asset.code).toBe('AST-018');
    expect(result.asset.maintenance).toHaveLength(3);
    expect(result.asset.maintenance[0]?.status).toBe('scheduled');
    expect(result.asset.maintenance.some((record) => record.type === 'corrective')).toBe(true);
  });

  it('returns an explicit empty state for an unknown asset', async () => {
    const result = await mockAssetRepository.getById('missing-asset');
    expect(result.status).toBe('empty');
  });
});
