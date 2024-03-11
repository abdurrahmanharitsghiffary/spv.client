"use client";

import React, { useCallback, useEffect } from "react";
import ModalLayoutV2 from "../layoutV2";
import {
  useReportModalActions,
  useReportModalIsOpen,
} from "@/stores/report-modal-store";
import { TextareaWithControl } from "@/components/input/input-with-control";
import { z } from "zod";
import { zImages } from "@/lib/zod-schema/image";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypographyMuted } from "@/components/ui/typography";
import CreatePostImageChip from "@/components/form/create-post-image-chip";
import { Button } from "@nextui-org/button";
import { BsCardImage } from "react-icons/bs";
import InputFile from "@/components/input/file";
import CancelButton from "@/components/button/reset-button";
import { useReportBug } from "@/lib/api/bug/mutation";
import { toast } from "react-toastify";

const reportBugValidation = z.object({
  problem: z.string({ required_error: "Must not be empty." }),
  images: zImages.optional(),
});

type ReportBugValidation = z.infer<typeof reportBugValidation>;

export default function ReportBugModal() {
  const isOpen = useReportModalIsOpen();
  const { onClose } = useReportModalActions();
  const { reportBugAsync } = useReportBug();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: {
      isSubmitSuccessful,
      errors: { images: imagesErrors },
    },
  } = useForm<ReportBugValidation>({
    resolver: zodResolver(reportBugValidation),
  });

  const { images } = useWatch({ control });

  const onSubmit: SubmitHandler<ReportBugValidation> = async (data) => {
    await toast.promise(
      reportBugAsync({
        body: { description: data.problem, images: data.images },
        formData: true,
      }),
      {
        error: {
          render({ data }) {
            return (data as any)?.message ?? "Something went wrong!";
          },
        },
        pending: "Submitting...",
        success: "Successfully sent your report.",
      }
    );
  };

  const handleCloseClick = useCallback(
    (image: File) => {
      if (!images) return null;
      const files = (images as File[]).filter(
        (img) =>
          !`${img.name}${img.size}${image.type}`.includes(
            `${image.name}${image.size}${image.type}`
          )
      );
      setValue("images", [...files]);
    },
    [images]
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful]);

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={onClose}
      classNames={{ body: "px-0" }}
      footer={
        <div className="flex gap-2">
          <CancelButton onReset={reset} />
          <Button type="submit" form="report-bug-form" color="primary">
            Submit
          </Button>
        </div>
      }
    >
      <form
        className="flex flex-col gap-4 p-4 md:p-0"
        id="report-bug-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-base font-semibold">Report bug</h2>
        <TextareaWithControl
          minRows={4}
          maxRows={5}
          placeholder="Please explain the bugs that you encounter..."
          control={control}
          name="problem"
        />
        {imagesErrors?.message && (
          <TypographyMuted className="text-danger !text-[0.75rem]">
            {imagesErrors?.message.toString()}
          </TypographyMuted>
        )}
        <CreatePostImageChip
          images={images}
          onCloseClick={handleCloseClick}
          className="!flex-wrap"
        />
        <Button
          color="secondary"
          startContent={<BsCardImage />}
          className="w-fit"
        >
          Add attachments
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange } }) => (
              <InputFile
                className="opacity-0 z-[10] absolute inset-0"
                id="edit_post_images"
                onChange={(e) => {
                  console.log(e.target.files, "FileList");
                  const files: File[] = [];
                  Array.from(e.target?.files ?? []).forEach((img) => {
                    files.push(img);
                  });
                  console.log(files, "Files");
                  onChange(files);
                }}
                multiple={true}
              />
            )}
          />
        </Button>
      </form>
    </ModalLayoutV2>
  );
}
