import ChangePasswordModal from "@/components/modal/change-password-modal";
import DeleteAccountModal from "@/components/modal/delete-account-modal";
import ChangePasswordProvider from "@/context/change-password-context";
import DeleteAccountProvider from "@/context/delete-account-modal-context";
import React from "react";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChangePasswordProvider>
      <DeleteAccountProvider>
        <div className="w-full pt-2 md:pb-0 relative">{children}</div>
        <DeleteAccountModal />
        <ChangePasswordModal />
      </DeleteAccountProvider>
    </ChangePasswordProvider>
  );
}
