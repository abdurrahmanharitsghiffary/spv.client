import React from "react";
import EditProfileTrigger from "../modal/edit-profile-modal/trigger";
import ProfileMenuTrigger from "../menu/profile-menu/trigger";

export default function ProfileActionButton() {
  return (
    <div className="flex gap-4 px-4 items-center w-full">
      <EditProfileTrigger />
      <ProfileMenuTrigger />
    </div>
  );
}
