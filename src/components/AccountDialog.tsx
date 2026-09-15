import type { Account } from "../types";
import { currency, formatDate } from "../format";
import { Badge } from "./Badge";
import { Modal } from "./Modal";
import { HealthBar } from "./HealthBar";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-semibold">{children}</dd>
    </div>
  );
}

export function AccountDialog({ account, onClose }: { account: Account; onClose: () => void }) {
  return (
    <Modal
      eyebrow="Account"
      title={account.name}
      onClose={onClose}
      testId="detail-drawer"
      closeTestId="drawer-close"
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
        <Field label="Plan">{account.plan}</Field>
        <Field label="Region">{account.region}</Field>
        <Field label="MRR">{currency(account.mrr)}</Field>
        <Field label="Seats">{account.seats}</Field>
        <Field label="Status">
          <Badge label={account.status} />
        </Field>
        <Field label="Health">
          <HealthBar score={account.health} width="w-20" />
        </Field>
        <Field label="Signed up">{formatDate(account.signedUpAt)}</Field>
        <Field label="Last active">{formatDate(account.lastActiveAt)}</Field>
      </dl>

      <div className="mt-7">
        <p className="text-sm text-muted">Owner</p>
        <p className="mt-1 text-lg font-semibold">{account.owner}</p>
        <a
          href={`mailto:${account.ownerEmail}`}
          className="text-lg text-brand-600 underline underline-offset-2"
        >
          {account.ownerEmail}
        </a>
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted">Notes</p>
        <p className="mt-1 text-lg leading-relaxed">{account.notes}</p>
      </div>
    </Modal>
  );
}
