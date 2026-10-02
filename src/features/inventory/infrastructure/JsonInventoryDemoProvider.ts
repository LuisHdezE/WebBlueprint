import rawDashboard from './inventory.dashboard.json';
import type { InventoryDemoProvider } from '../application/inventory.contracts';
import type { InventoryDashboardDto } from '../application/inventory.dto';

export class JsonInventoryDemoProvider implements InventoryDemoProvider {
  getDashboard(): InventoryDashboardDto {
    const dashboard = rawDashboard as InventoryDashboardDto;
    if (!dashboard.title || !dashboard.breadcrumbs.length || !dashboard.metrics.length || !dashboard.queue.length) {
      throw new Error('Inventory dashboard demo data is incomplete.');
    }
    return dashboard;
  }
}
