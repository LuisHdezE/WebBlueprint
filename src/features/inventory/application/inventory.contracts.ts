import type { InventoryDashboardDto } from './inventory.dto';

export interface InventoryDemoProvider {
  getDashboard(): InventoryDashboardDto;
}
