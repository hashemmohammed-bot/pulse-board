import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
import type { Account } from "@/types";
import { currency, formatDate } from "@/format";
import { dateLocale } from "@/i18n";
import { StatusBadge } from "@/components/StatusBadge";
import { HealthBar } from "@/components/HealthBar";
import { Modal } from "@/components/Modal";
import { colors } from "@/styles/tokens.stylex";

const styles = stylex.create({
  grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px", margin: 0 },
  term: { fontSize: "14px", color: colors.muted },
  detail: { margin: 0, marginTop: "4px", fontSize: "18px", fontWeight: 600 },
  block: { marginTop: "28px" },
  blockTight: { marginTop: "24px" },
  label: { margin: 0, fontSize: "14px", color: colors.muted },
  value: { margin: 0, marginTop: "4px", fontSize: "18px", fontWeight: 600 },
  link: { fontSize: "18px", color: colors.brand600, textUnderlineOffset: "2px" },
  notes: { margin: 0, marginTop: "4px", fontSize: "18px", lineHeight: 1.6 },
});

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt {...stylex.props(styles.term)}>{label}</dt>
      <dd {...stylex.props(styles.detail)}>{children}</dd>
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
      <dl {...stylex.props(styles.grid)}>
        <Field label={t("accounts.columns.plan")}>{account.plan}</Field>
        <Field label={t("accounts.columns.region")}>{account.region}</Field>
        <Field label={t("accounts.columns.mrr")}>{currency(account.mrr)}</Field>
        <Field label={t("accounts.columns.seats")}>{account.seats}</Field>
        <Field label={t("accounts.columns.status")}>
          <StatusBadge label={account.status} />
        </Field>
        <Field label={t("accounts.columns.health")}>
          <HealthBar score={account.health} width={80} />
        </Field>
        <Field label={t("account.signedUp")}>{formatDate(account.signedUpAt, locale)}</Field>
        <Field label={t("account.lastActive")}>{formatDate(account.lastActiveAt, locale)}</Field>
      </dl>

      <div {...stylex.props(styles.block)}>
        <p {...stylex.props(styles.label)}>{t("account.owner")}</p>
        <p {...stylex.props(styles.value)}>{account.owner}</p>
        <a href={`mailto:${account.ownerEmail}`} {...stylex.props(styles.link)}>
          {account.ownerEmail}
        </a>
      </div>

      <div {...stylex.props(styles.blockTight)}>
        <p {...stylex.props(styles.label)}>{t("account.notes")}</p>
        <p {...stylex.props(styles.notes)}>{account.notes}</p>
      </div>
    </Modal>
  );
}
