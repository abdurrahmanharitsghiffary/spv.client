"use client";
import Recorder from "@/components/recorder";
import useNotification from "@/hooks/useNotification";
import { useGetMyInfo, useLogin, useLogout } from "@/lib/apiv2";
import { useSession } from "@/stores/auth-store";
import { useConfirm } from "@/stores/confirm-store";
import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from "react";

export default function TestPage() {
  const { login } = useLogin();
  const { logout } = useLogout();
  const notification = useNotification();
  const session = useSession();
  const confirm = useConfirm();

  const { myInfo } = useGetMyInfo();
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() =>
          notification(
            "lol",
            {},
            { onNotificationClick: () => console.log("Clicked!") }
          )
        }
      >
        FIRE!!
      </Button>
      <Button
        onClick={() =>
          login({
            email: "abdmanharits@gmail.com",
            password: "yahahawahyoee",
            confirmPassword: "yahahawahyoee",
          })
        }
      >
        Login
      </Button>
      <Button onClick={() => logout()}>Logout</Button>
      <Button
        onClick={async () => {
          const choice = await confirm({
            body: "lol",
            title: "KOntolodon",
            closeColor: "danger",
          });
        }}
      >
        Confirm!
      </Button>
      <Button
        onClick={async () => {
          const choice = await confirm({
            body: "lol",
            title: "KOntolodon",
          });
        }}
      >
        Confirm!
      </Button>
      {/* {JSON.stringify(data ?? "")} */}
      <Recorder color="primary" className="text-[20px] mt-20" />
    </div>
  );
}
