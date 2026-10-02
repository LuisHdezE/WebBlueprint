import { describe, expect, it } from 'vitest';
import { JsonInventoryDemoProvider } from './JsonInventoryDemoProvider';

describe('inventory demo adapter', () => {
  it('exposes the deterministic inventory dashboard story', () => {
    const dashboard = new JsonInventoryDemoProvider().getDashboard();
    expect(dashboard.title).toBe('Inventario');
    expect(dashboard.breadcrumbs).toEqual(['Aplicaciones', 'Inventario', 'Dashboard']);
    expect(dashboard.metrics).toHaveLength(8);
    expect(dashboard.queue).toHaveLength(8);
    expect(dashboard.metrics.map((metric) => metric.id)).toContain('pending-evaluation');
    expect(dashboard.metrics.map((metric) => metric.id)).toContain('sale-ready-parts');
    expect(dashboard.metrics.every((metric) => Boolean(metric.icon))).toBe(true);
    expect(dashboard.analytics.trend.series).toHaveLength(3);
    expect(dashboard.analytics.distribution.segments).toHaveLength(5);
    expect(dashboard.analytics.funnel.stages).toHaveLength(5);
  });

  it('keeps operational queue identities stable and unique', () => {
    const queue = new JsonInventoryDemoProvider().getDashboard().queue;
    expect(new Set(queue.map((item) => item.id)).size).toBe(queue.length);
    expect(queue.some((item) => item.actionLabel === 'Iniciar desarme')).toBe(true);
    expect(queue.some((item) => item.actionLabel === 'Evaluar dispositivo')).toBe(true);
  });
});
