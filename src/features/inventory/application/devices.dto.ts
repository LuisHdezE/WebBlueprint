import type { StatusBadgeTone } from '@/components/data-display/StatusBadge';

export type DeviceDestination = 'Pending Evaluation' | 'Donor' | 'Refurbish' | 'Hold' | 'Discard';
export type DevicePhysicalCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Damaged';
export type DevicePowerState = 'Yes' | 'No' | 'Unknown';
export type DeviceAccountLock = 'Clear' | 'Locked' | 'Unknown';

export interface InventoryDeviceListItemDto {
  id: string;
  manufacturer: string;
  model: string;
  serialOrImei: string;
  storage: string;
  color: string;
  powersOn: DevicePowerState;
  physicalCondition: DevicePhysicalCondition;
  accountLock: DeviceAccountLock;
  acquisitionSource: string;
  acquisitionCost: string;
  destination: DeviceDestination;
  destinationTone: StatusBadgeTone;
}

export interface InventoryFilterOptionDto {
  value: string;
  label: string;
}

export interface InventoryDevicesViewDto {
  title: string;
  description: string;
  breadcrumbs: readonly string[];
  newDeviceLabel: string;
  tableCaption: string;
  searchLabel: string;
  searchPlaceholder: string;
  emptyMessage: string;
  columns: {
    id: string;
    device: string;
    identity: string;
    condition: string;
    source: string;
    cost: string;
    destination: string;
  };
  filters: {
    destinationLabel: string;
    allDestinationsLabel: string;
    destinationOptions: readonly InventoryFilterOptionDto[];
    conditionLabel: string;
    allConditionsLabel: string;
    conditionOptions: readonly InventoryFilterOptionDto[];
  };
  devices: readonly InventoryDeviceListItemDto[];
}

export interface InventoryDeviceIntakeViewDto {
  title: string;
  description: string;
  breadcrumbs: readonly string[];
  introTitle: string;
  introDescription: string;
  identitySectionTitle: string;
  conditionSectionTitle: string;
  acquisitionSectionTitle: string;
  routingSectionTitle: string;
  fields: {
    manufacturer: string;
    model: string;
    serialOrImei: string;
    storage: string;
    color: string;
    powersOn: string;
    physicalCondition: string;
    accountLock: string;
    acquisitionSource: string;
    acquisitionCost: string;
    destination: string;
    notes: string;
  };
  placeholders: {
    manufacturer: string;
    model: string;
    serialOrImei: string;
    storage: string;
    color: string;
    acquisitionSource: string;
    acquisitionCost: string;
    notes: string;
  };
  defaults: {
    powersOn: DevicePowerState;
    physicalCondition: DevicePhysicalCondition;
    accountLock: DeviceAccountLock;
    destination: DeviceDestination;
  };
  options: {
    powersOn: readonly { value: DevicePowerState; label: string }[];
    physicalCondition: readonly { value: DevicePhysicalCondition; label: string }[];
    accountLock: readonly { value: DeviceAccountLock; label: string }[];
    destination: readonly { value: DeviceDestination; label: string }[];
  };
  submitLabel: string;
  cancelLabel: string;
  demoNotice: string;
  successTitle: string;
  successMessage: string;
}
