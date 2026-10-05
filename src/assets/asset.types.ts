export type AssetStatus = 'available' | 'assigned' | 'in_service' | 'maintenance' | 'inactive';

export type MaintenanceType = 'preventive' | 'corrective' | 'inspection';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type AssetMaintenanceRecord = {
  id: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  title: string;
  scheduledLabel: string;
  completedLabel?: string;
  providerLabel?: string;
  costLabel?: string;
  notes?: string;
};

export type AssetDetail = {
  id: string;
  code: string;
  name: string;
  categoryLabel: string;
  status: AssetStatus;
  conditionLabel: string;
  locationLabel: string;
  assignedToLabel?: string;
  lastServiceLabel: string;
  nextMaintenanceLabel?: string;
  acquisitionLabel?: string;
  valueLabel?: string;
  notes: readonly string[];
  maintenance: readonly AssetMaintenanceRecord[];
};

export type AssetDetailState =
  | { status: 'loading' }
  | { status: 'success'; asset: AssetDetail }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string };

export type AssetRepository = {
  getById: (id: string) => Promise<AssetDetailState>;
};
