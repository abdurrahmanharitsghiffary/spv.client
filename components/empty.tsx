import React from "react";
import { GoInbox } from "react-icons/go";

export default function Empty({ children }: { children?: React.ReactNode }) {
  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col gap-2 justify-center items-center w-fit h-fit text-center">
      <GoInbox size={30} />
      <p>{children ?? "No items."}</p>
    </div>
  );
}
