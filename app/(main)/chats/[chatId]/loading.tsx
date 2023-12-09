import { Spinner } from "@nextui-org/spinner";
import React from "react";

export default function ChatLoading() {
  return (
    <div className="flex justify-center items-center w-full h-screen absolute inset-0">
      <Spinner color="primary" />
    </div>
  );
}
