import PasswordChangeForm from "@/components/form/passwordchange-form";
import React from "react";

export default function ResetPasswordTokenPage({
  params,
}: {
  params: { token: string };
}) {
  return <PasswordChangeForm token={params.token} />;
}
