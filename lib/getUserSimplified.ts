import { UserAccount, UserAccountPublic, UserSimplifiedWF } from "@/types/user";

export function getUserSimplified(
  user: UserAccountPublic | UserAccount
): UserSimplifiedWF {
  return {
    avatarImage: user.profile?.avatarImage,
    firstName: user?.firstName,
    fullName: user?.fullName,
    id: user?.id,
    isFollowed: user?.isFollowed,
    isOnline: user?.isOnline,
    lastName: user?.lastName,
    username: user?.username,
  };
}
