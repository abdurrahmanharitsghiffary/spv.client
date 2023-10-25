import { Button } from "@nextui-org/button";
import { Card, CardBody, Divider } from "@nextui-org/react";
import React from "react";
import { BiX } from "react-icons/bi";
import ImageWithPreview from "../image/image-with-preview";
import { TypographyMuted } from "../ui/typography";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { MAX_FILE_SIZE } from "@/lib/createPostSchema";
import { formatBytes } from "@/lib/formatBytes";

function CommentFormImage({
  image,
  onDataSuccess,
  className,
  style,
  errors,
}: {
  errors?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  style?: any;
  className?: string;
  onDataSuccess: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null>
  >;
  image: File | null;
}) {
  if (!image) return null;

  const isError = errors !== null || errors !== undefined;

  const cl = `shadow-none rounded-none w-full ${className ?? ""}`;

  return (
    <Card isBlurred className={cl} style={style}>
      <Divider />
      <CardBody className="gap-2 pb-2">
        <ImageWithPreview
          radius="sm"
          src={URL.createObjectURL(image)}
          className="object-cover w-32 h-32"
          alt="Posted image"
        />

        {image.size > MAX_FILE_SIZE && (
          <TypographyMuted className="text-danger">
            File size is too large, max file size is{" "}
            {formatBytes(MAX_FILE_SIZE)}Kb
          </TypographyMuted>
        )}
        {isError && (
          <TypographyMuted className="text-danger">
            {errors?.toString()}
          </TypographyMuted>
        )}
      </CardBody>
      <Button
        isIconOnly
        variant="light"
        radius="full"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => {
          onDataSuccess(null);
        }}
      >
        <BiX size={18} />
      </Button>
    </Card>
  );
}

export default React.memo(CommentFormImage);
