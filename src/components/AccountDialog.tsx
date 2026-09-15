import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Account } from "@/types";
import { currency, formatDate } from "@/format";
import { dateLocale } from "@/i18n";
import { StatusBadge } from "@/components/StatusBadge";
import { HealthBar } from "@/components/HealthBar";
import { Modal } from "@/components/Modal";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-semibold">{children}</dd>
    </div>
  );
}

export function AccountDialog({ account, onClose }: { account: Account; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const locale = dateLocale(i18n.resolvedLanguage ?? "en");

  return (
    <Modal
      eyebrow={t("account.eyebrow")}
      title={account.name}
      onClose={onClose}
      testId="detail-drawer"
      closeTestId="drawer-close"
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
        <Field label={t("accounts.columns.plan")}>{account.plan}</Field>
        <Field label={t("accounts.columns.region")}>{account.region}</Field>
        <Field label={t("accounts.columns.mrr")}>{currency(account.mrr)}</Field>
        <Field label={t("accounts.columns.seats")}>{account.seats}</Field>
        <Field label={t("accounts.columns.status")}>
          <StatusBadge label={account.status} />
        </Field>
        <Field label={t("accounts.columns.health")}>
          <HealthBar score={account.health} width="w-20" />
        </Field>
        <Field label={t("account.signedUp")}>{formatDate(account.signedUpAt, locale)}</Field>
        <Field label={t("account.lastActive")}>{formatDate(account.lastActiveAt, locale)}</Field>
      </dl>

      <div className="mt-7">
        <p className="text-sm text-muted">{t("account.owner")}</p>
        <p className="mt-1 text-lg font-semibold">{account.owner}</p>
        <a
          href={`mailto:${account.ownerEmail}`}
          className="text-lg text-brand-600 underline underline-offset-2"
        >
          {account.ownerEmail}
        </a>
      </div>

      <div className="mt-6">
        <p className="text-sm text-muted">{t("account.notes")}</p>
        <p className="mt-1 text-lg leading-relaxed">{account.notes}</p>
      </div>
    </Modal>
  );
}
