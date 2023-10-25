import React from "react";
import PhotoProfileMenuTrigger from "../menu/photo-profile-menu/trigger";
import AvatarWithPreview from "./avatar-with-preview";

export default function ProfileImage({
  src,
  isNotOwned,
}: {
  src: string;
  isNotOwned?: boolean;
}) {
  return (
    <div className="w-32 h-32 rounded-full z-10 absolute top-[25%] md:top-[26%] left-1/2 -translate-x-1/2 ">
      <AvatarWithPreview
        color="default"
        isBordered
        src={src}
        alt="Profile Image"
        showFallback
        className="object-cover text-default-800 dark:text-default-foreground min-h-[128px] max-h-[128px] rounded-full min-w-[128px] max-w-[128px] object-center"
      />
      {!isNotOwned && (
        <PhotoProfileMenuTrigger className="bottom-0 absolute right-0 z-[11]" />
      )}
    </div>
  );
}
