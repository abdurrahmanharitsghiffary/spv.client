import React from "react";
import CoverImage from "../image/cover-image";
import { Skeleton } from "@nextui-org/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="w-full pt-2 flex flex-col items-center justify-start gap-2 relative">
      <CoverImage src="" className="pt-2" />
      <Skeleton className="w-32 h-32 rounded-full z-10 absolute top-[120px] left-1/2 -translate-x-1/2 md:left-[20%]" />
      <div className="flex pt-20 md:pt-16 flex-col justify-start w-full px-4 md:items-start items-center md:px-6 md:pb-2">
        <div className="flex gap-2 flex-col items-center md:items-start justify-start w-full">
          <Skeleton className="h-5 rounded-xl w-[40%]" />
          <Skeleton className="h-5 rounded-xl w-[35%]" />
        </div>
        <div className="w-full flex my-8 justify-evenly mx-auto md:my-4">
          {[0, 1, 2].map((it) => (
            <div
              key={it}
              className="grid items-center text-center w-[33%] grid-cols-1"
            >
              <Skeleton className="rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex gap-4 items-center w-full">
          {[0, 1].map((it) => (
            <Skeleton key={it} className="flex-1 h-8 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
