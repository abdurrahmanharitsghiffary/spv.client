import { ConfirmState } from "@/stores/confirm-store";

export const DISCARD_CHANGE_CONFIRM_PROPS: ConfirmState = {
  body: "Are you sure want to discard changes?",
  title: "Discard changes",
  confirmLabel: "Discard changes",
  confirmColor: "danger",
};

export const baseClientURL = process.env.BASE_WEB_URL;
export const url = (pathname: string) => new URL(pathname, baseClientURL).href;
export const saveChangesProps: (key?: string) => ConfirmState = (key) => ({
  body: "Save with this changes?",
  title: `Edit ${key}`,
  confirmLabel: "Save changes",
});
