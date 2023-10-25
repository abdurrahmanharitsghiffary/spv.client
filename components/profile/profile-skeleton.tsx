import React from "react";
import CoverImage from "../image/cover-image";
import { Skeleton } from "@nextui-org/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="w-full pt-2 flex flex-col items-center justify-start gap-2 relative">
      <CoverImage src="" className="mb-20 pt-2" />
      <Skeleton className="w-32 h-32 rounded-full z-10 absolute top-[25%] md:top-[26%] left-1/2 -translate-x-1/2" />
      <div className="flex flex-col justify-start items-center w-full px-4 gap-2">
        <Skeleton className="h-5 rounded-xl w-[40%]" />
        <Skeleton className="h-5 rounded-xl w-[35%]" />
        <div className="w-full flex my-8 justify-evenly mx-auto">
          {[0, 1, 2].map((it) => (
            <div
              key={it}
              className="grid items-center text-center w-[33%] grid-cols-1"
            >
              <Skeleton className="rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex gap-4 px-4 items-center w-full">
          {[0, 1].map((it) => (
            <Skeleton key={it} className="flex-1 h-8 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
