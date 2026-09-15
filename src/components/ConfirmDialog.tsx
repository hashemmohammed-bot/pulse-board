import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { colors } from "@/styles/tokens.stylex";

const styles = stylex.create({
  message: { marginTop: "8px", fontSize: "16px", color: colors.muted },
  footer: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" },
  header: { display: "block" },
});

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent data-testid="confirm-delete" aria-label={title} narrow>
        <DialogHeader>
          <div {...stylex.props(styles.header)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              <span {...stylex.props(styles.message)}>{message}</span>
            </DialogDescription>
          </div>
        </DialogHeader>
        <div {...stylex.props(styles.footer)}>
          <Button variant="outline" data-testid="confirm-no" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" data-testid="confirm-yes" onClick={onConfirm}>
            {t("common.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
