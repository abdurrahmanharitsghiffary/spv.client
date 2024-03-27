"use client";

import React, { useEffect } from "react";
import ModalLayoutV2 from "../layoutV2";
import {
  useReportModalActions,
  useReportModalIsOpen,
} from "@/stores/report-bug-modal-store";
import { TextareaWithControl } from "@/components/input/input-with-control";
import { z } from "zod";
import { zImages } from "@/lib/zod-schema/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypographyMuted } from "@/components/ui/typography";
import { Button } from "@nextui-org/button";
import CancelButton from "@/components/button/reset-button";
import { useReportBug } from "@/lib/api/bug/mutation";
import { toast } from "react-toastify";
import FileButtonWithControl from "@/components/input/file-button-with-control";

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
    formState: {
      isSubmitSuccessful,
      errors: { images: imagesErrors },
    },
  } = useForm<ReportBugValidation>({
    resolver: zodResolver(reportBugValidation),
  });

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
        className="flex flex-col gap-4 p-4 md:p-0 px-6"
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
        <FileButtonWithControl control={control} name="images">
          Add images
        </FileButtonWithControl>
      </form>
    </ModalLayoutV2>
  );
}
