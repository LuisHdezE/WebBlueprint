import type { AppIconName } from '@/components/AppIcon';
import type { StatusBadgeTone } from '@/components/data-display/StatusBadge';

export type InventoryWorkflowStatus =
  | 'Pending Evaluation'
  | 'Donor'
  | 'Waiting'
  | 'In Progress'
  | 'Partially Dismantled'
  | 'Completed'
  | 'Refurbish'
  | 'Hold';

export interface InventoryMetricDto {
  id: string;
  label: string;
  value: number;
  note: string;
  tone: 'positive' | 'neutral' | 'warning';
  icon: AppIconName;
}

export interface InventoryQueueItemDto {
  id: string;
  deviceLabel: string;
  context: string;
  actionLabel: string;
  status: InventoryWorkflowStatus;
  statusTone: StatusBadgeTone;
  priority: 'High' | 'Normal';
}

export interface InventoryDashboardDto {
  title: string;
  description: string;
  breadcrumbs: readonly string[];
  attentionTitle: string;
  attentionDescription: string;
  metrics: readonly InventoryMetricDto[];
  queue: readonly InventoryQueueItemDto[];
}
