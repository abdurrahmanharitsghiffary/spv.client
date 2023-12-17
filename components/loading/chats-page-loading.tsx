import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import React from "react";
import { FiSearch } from "react-icons/fi";

export default function ChatsPageLoading() {
  return (
    <div className="w-full flex flex-col gap-1 pt-5 pb-16">
      <div className="flex flex-col gap-2"></div>
      <Input
        type="search"
        startContent={<FiSearch size={20} />}
        placeholder="Search users..."
        className="my-2 px-4"
        radius="full"
        fullWidth
      />
      <div className="flex flex-col w-full">
        <Spinner color="primary" />
      </div>
    </div>
  );
}
