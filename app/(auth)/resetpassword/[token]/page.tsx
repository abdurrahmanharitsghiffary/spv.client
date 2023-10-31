import ChangePasswordForm from "@/components/form/change-password-form";
import React from "react";

export default function ResetPasswordTokenPage({
  params,
}: {
  params: { token: string };
}) {
  return <ChangePasswordForm token={params.token} />;
}
