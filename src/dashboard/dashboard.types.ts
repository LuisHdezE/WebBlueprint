import type { MetricCardTone } from '@/components/data-display/MetricCard';
import type { StatusBadgeTone } from '@/components/data-display/StatusBadge';

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  note: string;
  tone: MetricCardTone;
};

export type DashboardActivityItem = {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  statusLabel: string;
  statusTone: StatusBadgeTone;
};

export type DashboardSeriesPoint = {
  label: string;
  value: number;
};

export type DashboardSnapshot = {
  metrics: readonly DashboardMetric[];
  activity: readonly DashboardActivityItem[];
  series: readonly DashboardSeriesPoint[];
  updatedLabel: string;
};

export type DashboardDataState =
  | { status: 'loading' }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string }
  | { status: 'success'; data: DashboardSnapshot };

export type DashboardDataProvider = {
  load(): Promise<DashboardDataState>;
};
