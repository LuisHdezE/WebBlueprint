export type DispatchTaskType = 'delivery' | 'pickup' | 'transfer' | 'service';

export type DispatchStatus =
  | 'scheduled'
  | 'assigned'
  | 'en_route'
  | 'on_site'
  | 'completed'
  | 'delayed'
  | 'incident';

export type DispatchStatusFilter = 'all' | DispatchStatus;

export type DispatchTask = {
  id: string;
  reference: string;
  scheduledTime: string;
  type: DispatchTaskType;
  status: DispatchStatus;
  customerName: string;
  locationLabel: string;
  resourceLabel: string;
  assigneeName: string;
  note?: string;
};

export type DispatchFilter = {
  status: DispatchStatusFilter;
};

export type DispatchBoardState =
  | { status: 'loading' }
  | { status: 'success'; dateLabel: string; tasks: readonly DispatchTask[] }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string };

export type DispatchRepository = {
  load: (filter: DispatchFilter) => Promise<DispatchBoardState>;
};
