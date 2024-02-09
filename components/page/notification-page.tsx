"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { TypographyH3 } from "../ui/typography";
import { Button } from "@nextui-org/button";
import { BiFilter } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useGetNotifications } from "@/lib/api/notifications/query";
import NotificationLists from "../notification";
import useFetchNextPageObserver from "@/hooks/use-fetch-next-page";
import { Spinner } from "@nextui-org/react";
import UserListboxLoading from "../loading/user-listbox-loading";
import { useSocketOn } from "@/hooks/use-socket-on";
import { Socket_Event } from "@/lib/socket-event";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { keys } from "@/lib/queryKey";
import { ApiPagingObjectResponse } from "@/types/response";
import { produce } from "immer";
import { Notification } from "@/types/notification";
import { useSession } from "@/stores/auth-store";
import { useMemo, useState } from "react";
import {
  useClearNotification,
  useReadNotification,
} from "@/lib/api/notifications/mutation";

const filterItems = [
  { key: "latest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
];

const deletingItems = [
  {
    key: "1h-delete",
    label: "Delete all notifications from 1 hour ago",
  },
  {
    key: "1d-delete",
    label: "Delete all notifications from 1 day ago",
  },
  { key: "all-delete", label: "Delete all notifications" },
];

export default function NotificationPage() {
  const [t, setT] = useState(new Set(["latest"]));
  const type = (Array.from(t)?.[0] ?? "latest") as "latest" | "oldest";
  const { clearNotificationAsync } = useClearNotification();
  console.log(type, "Type");
  const {
    resp,
    isLoading,
    isSuccess,
    isFetchNextNotAvailable,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetNotifications({ order_by: type });
  const queryClient = useQueryClient();
  const notifications = useMemo(() => resp?.data ?? [], [resp]);

  const { ref } = useFetchNextPageObserver({
    isDisabled: isFetchNextNotAvailable,
    isFetching,
    fetchNextPage,
  });
  const session = useSession();
  const { readNotificationAsync } = useReadNotification();
  const handleReadAllClick = async () => {
    await readNotificationAsync({ body: { ids: "all" } });
  };

  useSocketOn<Notification>(Socket_Event.NOTIFY, (data) => {
    if (data.receiverId !== session?.id) return null;
    queryClient.setQueriesData<
      InfiniteData<ApiPagingObjectResponse<Notification[]>>
    >(
      keys.meNotifications(),
      produce((draft) => {
        if (draft?.pages) {
          draft.pages = draft.pages.filter((p) => p !== undefined);
          console.log(draft.pages, "Draft Pages");
          draft.pages[0].data.unshift(data);

          draft.pages[0].pagination.total_records += 1;
          draft.pages[0].pagination.limit += 1;
          draft.pages[0].pagination.result_count += 1;
          console.log(draft.pages, "Draft Pages new");
        }
      })
    );
  });

  const handleDeleteAction = async (key: React.Key) => {
    try {
      switch (key) {
        case "1h-delete": {
          await clearNotificationAsync({ query: { before_timestamp: "1h" } });
          return;
        }
        case "1d-delete": {
          await clearNotificationAsync({ query: { before_timestamp: "1d" } });
          return;
        }
        case "all-delete": {
          await clearNotificationAsync({});
          return;
        }
      }
    } catch (err) {
    } finally {
    }
  };

  return (
    <div className="w-full">
      <div className="pt-4 flex flex-col gap-2 w-full px-2">
        <TypographyH3 className="my-2 !text-lg">Notifications</TypographyH3>
        <div className="w-full flex gap-2">
          <Button
            className="flex-1"
            color="primary"
            endContent={<IoCheckmarkDoneSharp size={20} />}
            onClick={handleReadAllClick}
          >
            Mark all as read
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly color="secondary">
                <BiFilter size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              items={filterItems}
              // onAction={handleFilterAction}
              selectedKeys={t}
              disallowEmptySelection
              selectionMode="single"
              // @ts-ignore
              onSelectionChange={setT}
            >
              {(item) => (
                <DropdownItem key={item.key}>{item.label}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly color="danger">
                <AiOutlineDelete size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu items={deletingItems} onAction={handleDeleteAction}>
              {(item) => (
                <DropdownItem color="danger" key={item.key}>
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      {isLoading ? (
        <UserListboxLoading
          itemProps={{ className: "bg-content1" }}
          listProps={{ className: "p-2", classNames: { list: "gap-2" } }}
        />
      ) : (
        isSuccess && <NotificationLists notifications={notifications} />
      )}
      <div ref={ref}></div>
      {isFetchingNextPage && <Spinner className="my-4 mx-auto w-full" />}
    </div>
  );
}
