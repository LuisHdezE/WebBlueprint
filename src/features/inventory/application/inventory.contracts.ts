import type { InventoryDeviceIntakeViewDto, InventoryDevicesViewDto } from './devices.dto';
import type { InventoryDashboardDto } from './inventory.dto';

export interface InventoryDemoProvider {
  getDashboard(): InventoryDashboardDto;
  getDevicesView(): InventoryDevicesViewDto;
  getDeviceIntakeView(): InventoryDeviceIntakeViewDto;
}
