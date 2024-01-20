import { OmitCommonProps } from "@nextui-org/system";
import { ListboxItemProps } from "@nextui-org/listbox";
import { UserSimplified } from "@/types/user";
import { Avatar } from "@nextui-org/avatar";

export const listboxUserBaseProps: OmitCommonProps<ListboxItemProps, "key"> = {
  classNames: {
    wrapper: "truncate mr-auto flex-auto",
    title: "max-w-full",
    description: "max-w-full truncate",
  },
};

export const listboxUserProps: (
  user: UserSimplified
) => OmitCommonProps<ListboxItemProps, "key"> = (user) => ({
  ...listboxUserBaseProps,
  startContent: (
    <div className="flex-shrink-0">
      <Avatar
        showFallback
        src={user?.avatarImage?.src}
        name={user?.fullName ?? ""}
      />
    </div>
  ),
  description: user?.username,
  children: user?.fullName,
});
