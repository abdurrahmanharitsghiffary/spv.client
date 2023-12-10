"use client";

import {
  useCreateRoomActions,
  useCreateRoomModalIsOpen,
} from "@/stores/create-room-store";
import ModalLayout from "../layout";
import { useCreateChatRoom } from "@/lib/api/chats/mutation";
import { toast } from "react-toastify";
import UserAutocomplete from "@/components/user/user-autocomplete";
import { useCallback } from "react";
import { UserAccountPublic } from "@/types/user";

export default function CreateRoomModal() {
  const isOpen = useCreateRoomModalIsOpen();
  const { onClose } = useCreateRoomActions();
  const { createChatRoomAsync } = useCreateChatRoom();

  const handleOnItemClick = useCallback(async (item: UserAccountPublic) => {
    try {
      await toast.promise(
        createChatRoomAsync({
          body: {
            participantId: item.id,
          },
        })
          .then((res) => res)
          .catch((err) => Promise.reject(err)),
        {
          error: {
            render({ data }) {
              return (data as any)?.message ?? "Something went wrong!";
            },
          },
          pending: "Creating chat room...",
        }
      );
    } catch (err) {
    } finally {
      onClose();
    }
  }, []);

  return (
    <ModalLayout
      hideCloseButton
      bodyOnClick={onClose}
      onClose={onClose}
      placement="top-center"
      classNames={{
        wrapper: "bg-opacity-0 shadow-none",
      }}
      scrollBehavior="outside"
      wrapperClassNames={{ wrapper: "sm:items-start" }}
      backdrop="blur"
      isOpen={isOpen}
    >
      <div
        className="w-full overflow-visible"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <UserAutocomplete
          inputProps={{
            radius: "full",
            classNames: { label: "text-center" },
            label: "Search users",
            variant: "faded",
          }}
          onItemClick={handleOnItemClick}
        />
      </div>
    </ModalLayout>
  );
}
