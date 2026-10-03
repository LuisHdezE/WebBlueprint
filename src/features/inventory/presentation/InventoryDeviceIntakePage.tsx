import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { SelectField } from '@/components/forms/SelectField';
import { TextAreaField } from '@/components/forms/TextAreaField';
import { TextField } from '@/components/forms/TextField';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { InventoryDemoProvider } from '../application/inventory.contracts';
import type { DeviceAccountLock, DeviceDestination, DevicePhysicalCondition, DevicePowerState } from '../application/devices.dto';

type IntakeFormState = {
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
  notes: string;
};

export function InventoryDeviceIntakePage({ provider }: { provider: InventoryDemoProvider }) {
  const view = provider.getDeviceIntakeView();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<IntakeFormState>(() => ({
    manufacturer: '',
    model: '',
    serialOrImei: '',
    storage: '',
    color: '',
    powersOn: view.defaults.powersOn,
    physicalCondition: view.defaults.physicalCondition,
    accountLock: view.defaults.accountLock,
    acquisitionSource: '',
    acquisitionCost: '',
    destination: view.defaults.destination,
    notes: '',
  }));

  function setField<Key extends keyof IntakeFormState>(key: Key, value: IntakeFormState[Key]) {
    setSubmitted(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const canSubmit = Boolean(form.manufacturer.trim() && form.model.trim() && form.serialOrImei.trim());

  return <PageShell breadcrumbs={view.breadcrumbs.map((label) => ({ label }))} description={view.description} title={view.title}>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]" data-device-intake>
      <form className="grid gap-4" onSubmit={submit}>
        <SurfaceCard>
          <h2 className="text-base font-semibold text-slate-950">{view.identitySectionTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField id="device-manufacturer" label={view.fields.manufacturer} onChange={(value) => setField('manufacturer', value)} placeholder={view.placeholders.manufacturer} value={form.manufacturer} />
            <TextField id="device-model" label={view.fields.model} onChange={(value) => setField('model', value)} placeholder={view.placeholders.model} value={form.model} />
            <TextField id="device-identity" label={view.fields.serialOrImei} onChange={(value) => setField('serialOrImei', value)} placeholder={view.placeholders.serialOrImei} value={form.serialOrImei} />
            <TextField id="device-storage" label={view.fields.storage} onChange={(value) => setField('storage', value)} placeholder={view.placeholders.storage} value={form.storage} />
            <TextField id="device-color" label={view.fields.color} onChange={(value) => setField('color', value)} placeholder={view.placeholders.color} value={form.color} />
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <h2 className="text-base font-semibold text-slate-950">{view.conditionSectionTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <SelectField id="device-powers-on" label={view.fields.powersOn} onChange={(value) => setField('powersOn', value)} options={view.options.powersOn} value={form.powersOn} />
            <SelectField id="device-condition" label={view.fields.physicalCondition} onChange={(value) => setField('physicalCondition', value)} options={view.options.physicalCondition} value={form.physicalCondition} />
            <SelectField id="device-lock" label={view.fields.accountLock} onChange={(value) => setField('accountLock', value)} options={view.options.accountLock} value={form.accountLock} />
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <h2 className="text-base font-semibold text-slate-950">{view.acquisitionSectionTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField id="device-source" label={view.fields.acquisitionSource} onChange={(value) => setField('acquisitionSource', value)} placeholder={view.placeholders.acquisitionSource} value={form.acquisitionSource} />
            <TextField id="device-cost" label={view.fields.acquisitionCost} onChange={(value) => setField('acquisitionCost', value)} placeholder={view.placeholders.acquisitionCost} value={form.acquisitionCost} />
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <h2 className="text-base font-semibold text-slate-950">{view.routingSectionTitle}</h2>
          <div className="mt-4 grid gap-4">
            <SelectField id="device-destination" label={view.fields.destination} onChange={(value) => setField('destination', value)} options={view.options.destination} value={form.destination} />
            <TextAreaField id="device-notes" label={view.fields.notes} onChange={(value) => setField('notes', value)} placeholder={view.placeholders.notes} value={form.notes} />
          </div>
        </SurfaceCard>

        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!canSubmit} type="submit">{view.submitLabel}</button>
          <Link className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900" to="/apps/inventory/devices">{view.cancelLabel}</Link>
        </div>
      </form>

      <aside className="grid content-start gap-4">
        <SurfaceCard>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">{view.introTitle}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{view.introDescription}</p>
        </SurfaceCard>
        <SurfaceCard>
          <p className="text-sm leading-6 text-slate-500">{view.demoNotice}</p>
        </SurfaceCard>
        {submitted ? <SurfaceCard>
          <div role="status" data-device-intake-success>
            <p className="text-sm font-semibold text-emerald-700">{view.successTitle}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{view.successMessage}</p>
          </div>
        </SurfaceCard> : null}
      </aside>
    </div>
  </PageShell>;
}
