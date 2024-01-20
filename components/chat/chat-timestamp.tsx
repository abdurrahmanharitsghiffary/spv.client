import moment from "moment";
import React, { forwardRef } from "react";
import { TypographyMuted } from "../ui/typography";

export const ChatTimestamp = forwardRef<HTMLSpanElement, { date: Date }>(
  function ({ date }, ref) {
    return (
      <div className="w-full bg-blend-darken z-50 sticky top-20">
        <span
          ref={ref}
          className="block w-fit h-fit bg-default mx-auto text-center px-2 py-1 rounded-md border-divider border-1 min-w-[90px] max-w-[90px] max-h-[26px]"
        >
          <TypographyMuted className="!text-xs">
            {getChatTimestamp(date)}
          </TypographyMuted>
        </span>
      </div>
    );
  }
);

const getChatTimestamp = (date: Date) =>
  moment(date).calendar(null, {
    lastDay: "[Yesterday]",
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    lastWeek: "dddd",
    nextWeek: "dddd",
    sameElse: "ll",
  });

ChatTimestamp.displayName = "ChatTimestamp";

export default ChatTimestamp;
