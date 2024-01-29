import { UserAccount, UserAccountPublic, UserSimplified } from "@/types/user";

export function getUserSimplified(
  user: UserAccountPublic | UserAccount
): UserSimplified {
  return {
    avatarImage: user.profile?.avatarImage,
    firstName: user?.firstName,
    fullName: user?.fullName,
    id: user?.id,
    isOnline: user?.isOnline,
    lastName: user?.lastName,
    username: user?.username,
  };
}
