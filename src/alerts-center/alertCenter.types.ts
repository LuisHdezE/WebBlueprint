export type OperationalAlertSeverity = 'info' | 'warning' | 'critical';

export type OperationalAlertStatus = 'open' | 'acknowledged' | 'resolved';

export type OperationalAlertCategory =
  | 'schedule'
  | 'service'
  | 'asset'
  | 'maintenance'
  | 'document'
  | 'payment'
  | 'incident';

export type OperationalAlert = {
  id: string;
  title: string;
  description: string;
  severity: OperationalAlertSeverity;
  status: OperationalAlertStatus;
  category: OperationalAlertCategory;
  occurredAtLabel: string;
  contextLabel: string;
  actionLabel?: string;
};

export type OperationalAlertFilter = {
  severity: 'all' | OperationalAlertSeverity;
  status: 'all' | OperationalAlertStatus;
};

export type AlertCenterSummary = {
  open: number;
  critical: number;
  warning: number;
  acknowledged: number;
};

export type AlertCenterState =
  | { status: 'loading' }
  | {
      status: 'success';
      alerts: readonly OperationalAlert[];
      summary: AlertCenterSummary;
    }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string };

export type AlertCenterRepository = {
  list: (filter: OperationalAlertFilter) => Promise<AlertCenterState>;
};
