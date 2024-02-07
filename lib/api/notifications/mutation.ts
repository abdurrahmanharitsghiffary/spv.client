"use client";

import { myNotifications } from "@/lib/endpoints";
import { useOptimistic } from "../hooks";
import { keys } from "@/lib/queryKey";
import { InfiniteData } from "@tanstack/react-query";
import { ApiPagingObjectResponse } from "@/types/response";
import { Notification } from "@/types/notification";
import { produce } from "immer";

const getTimeQuery = (time: string) => {
  let num: number = 0;

  const extractTime = (time: string, options: "y" | "h" | "d") => {
    return time.split(options)?.[0] ?? 0;
  };

  if (time.endsWith("y")) {
    num = Number(extractTime(time, "y")) * 60000 * 60 * 24 * 365;
  } else if (time.endsWith("d")) {
    num = Number(extractTime(time, "d")) * 60000 * 60 * 24;
  } else if (time.endsWith("h")) {
    num = Number(extractTime(time, "h")) * 60000 * 60;
  }

  if (!Number.isNaN(Number(time))) {
    num = Number(time);
  }

  return num;
};

export const useClearNotification = () => {
  const {
    optimistic: clearNotification,
    optimisticAsync: clearNotificationAsync,
    ...rest
  } = useOptimistic({
    method: "delete",
    invalidateTags: (v) => [keys.counts(["unread_notifications"])],
    baseUrl: myNotifications(),
    optimisticUpdater(v) {
      return [
        {
          queryKey: keys.meNotifications(),
          isInfiniteData: true,
          updater<
            T extends InfiniteData<ApiPagingObjectResponse<Notification[]>>
          >(oldData: T): T {
            return produce(oldData, (draft) => {
              if (draft.pages) {
                draft.pages.forEach((p, pi) => {
                  p.data.forEach((n, ni) => {
                    const timeStampOptions = v?.query?.before_timestamp;
                    const nDate = new Date(n.createdAt);
                    const optDate =
                      timeStampOptions === undefined
                        ? new Date(Date.now())
                        : new Date(
                            Date.now() -
                              getTimeQuery(timeStampOptions as string)
                          );
                    if (timeStampOptions === undefined) {
                      draft.pages[pi].data = [];
                      draft.pages[pi].pagination.result_count = 0;
                      draft.pages[pi].pagination.total_records = 0;
                    }
                    if (
                      timeStampOptions &&
                      nDate.getTime() > optDate.getTime()
                    ) {
                      draft.pages[pi].data = draft.pages[pi].data.filter(
                        (d) => d.id !== n.id
                      );
                      draft.pages[pi].pagination.result_count -= 1;
                      draft.pages[pi].pagination.total_records -= 1;
                    }
                  });
                });
              }
            });
          },
        },
      ];
    },
  });

  return { clearNotification, clearNotificationAsync, ...rest };
};
