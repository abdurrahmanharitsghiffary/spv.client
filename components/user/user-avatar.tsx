import { Badge } from "@nextui-org/badge";
import { Avatar } from "@nextui-org/avatar";

export default function UserAvatar({
  name,
  isOnline,
  src,
}: {
  name: string;
  isOnline?: boolean;
  src?: string;
}) {
  if (isOnline)
    return (
      <Badge content="" color="success" shape="circle" placement="bottom-right">
        <Avatar
          size="md"
          name={name ?? ""}
          src={src ?? ""}
          className="flex-shrink-0"
        />
      </Badge>
    );

  return (
    <Avatar
      size="md"
      name={name ?? ""}
      src={src ?? ""}
      className="flex-shrink-0"
    />
  );
}
