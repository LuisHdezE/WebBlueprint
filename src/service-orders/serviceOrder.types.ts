export type ServiceOrderStatus =
  | 'requested'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'delayed';

export type ServiceOrderAssignment = {
  id: string;
  roleLabel: string;
  assigneeLabel: string;
};

export type ServiceOrderResource = {
  id: string;
  typeLabel: string;
  resourceLabel: string;
};

export type ServiceOrderEvidence = {
  id: string;
  label: string;
  kind: 'photo' | 'document' | 'signature' | 'note';
};

export type ServiceOrderActivity = {
  id: string;
  timestampLabel: string;
  title: string;
  description?: string;
  status: 'done' | 'current' | 'pending';
};

export type ServiceOrderDetail = {
  id: string;
  reference: string;
  title: string;
  status: ServiceOrderStatus;
  customerName: string;
  contactLabel: string;
  locationName: string;
  locationAddress: string;
  scheduledWindowLabel: string;
  createdLabel: string;
  updatedLabel: string;
  assignments: readonly ServiceOrderAssignment[];
  resources: readonly ServiceOrderResource[];
  evidence: readonly ServiceOrderEvidence[];
  activity: readonly ServiceOrderActivity[];
  notes: readonly string[];
  financial: {
    subtotalLabel: string;
    adjustmentsLabel: string;
    totalLabel: string;
    paymentStatusLabel: string;
  };
};

export type ServiceOrderDetailState =
  | { status: 'loading' }
  | { status: 'success'; order: ServiceOrderDetail }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string };

export type ServiceOrderRepository = {
  getById: (id: string) => Promise<ServiceOrderDetailState>;
};
