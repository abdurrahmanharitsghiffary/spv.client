import clsx from "clsx";
import React from "react";
import { TypographyP } from "../ui/typography";
import Timestamp from "../timestamp";
import Gallery from "../image/gallery";

export default function ChatBubble({
  text,
  isRecipient,
  images = [],
  date,
}: {
  images?: { src: string }[];
  text: string;
  isRecipient?: boolean;
  date: Date;
}) {
  return (
    <div
      className={clsx(
        isRecipient
          ? "self-start before:content-[''] before:bg-default-200 before:p-2 before:pr-4 before:top-0 before:absolute before:-left-1 before:skew-x-[30deg] before:rounded-tl-md"
          : "self-end after:content-[''] after:bg-default-100 after:p-2 after:pl-4 after:top-0 after:absolute after:-right-1 after:skew-x-[-30deg] after:rounded-tr-md",
        "flex flex-col gap-1 relative"
      )}
    >
      <div
        className={clsx(
          "p-2 px-4 flex flex-col gap-2",
          isRecipient
            ? "bg-default-200 rounded-r-medium rounded-bl-medium self-start"
            : "bg-default-100 rounded-l-medium rounded-br-medium self-end",
          images.length > 0 ? "pb-4" : ""
        )}
      >
        <TypographyP className="!text-[1rem]">{text}</TypographyP>
        {images && images.length > 0 ? <Gallery images={images} /> : null}
      </div>
      <Timestamp
        className={clsx(
          isRecipient ? "self-start" : "self-end",
          "!text-[0.688rem]"
        )}
        customDate={date}
      />
    </div>
  );
}
