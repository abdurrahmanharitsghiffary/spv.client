"use client";

import React, { useEffect } from "react";
import ModalLayoutV2 from "../layoutV2";
import {
  useGetReportId,
  useGetReportType,
  useReportModalActions,
  useReportModalIsOpen,
} from "@/stores/report-modal-store";
import CancelButton from "@/components/button/reset-button";
import { Button } from "@nextui-org/button";
import { z } from "zod";
import { zText } from "@/lib/zod-schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextareaWithControl } from "@/components/input/input-with-control";
import { useReport } from "@/lib/api/report/mutation";
import { zImages } from "@/lib/zod-schema/image";
import FileButtonWithControl from "@/components/input/file-button-with-control";
import { useConfirm } from "@/stores/confirm-store";
import { toast } from "react-toastify";

const reportSchema = z.object({
  report: zText("Reason"),
  images: zImages.optional(),
});

type ReportSchema = z.infer<typeof reportSchema>;

export default function ReportModal() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitSuccessful },
  } = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues: { report: "", images: [] },
  });

  const { reportAsync } = useReport();
  const isOpen = useReportModalIsOpen();
  const { onClose } = useReportModalActions();
  const type = useGetReportType();
  const id = useGetReportId();
  const confirm = useConfirm();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<ReportSchema> = async (data) => {
    await confirm({
      body: "Submit report?",
      title: "Report",
      confirmLabel: "Submit",
    });

    await toast.promise(
      reportAsync({
        formData: true,
        body: {
          report: data.report,
          id: id as any,
          type: type as any,
          images: data?.images,
        },
      }),
      {
        pending: "Submitting...",
        success: "Submitted",
        error: {
          render({ data }) {
            return (data as any)?.message ?? "Something went wrong!";
          },
        },
      }
    );
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      handleClose();
    }
  }, [isSubmitSuccessful]);

  return (
    <ModalLayoutV2
      onClose={handleClose}
      isOpen={isOpen}
      footer={
        <div className="flex gap-2">
          <CancelButton onReset={reset} />
          <Button type="submit" form="report_form" color="primary">
            Submit
          </Button>
        </div>
      }
    >
      <form
        id="report_form"
        className="flex flex-col gap-4 p-4 md:p-0 px-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-base font-semibold">Report {type}</h2>

        <TextareaWithControl
          placeholder="Please provide the reason for report."
          control={control}
          minRows={4}
          maxRows={5}
          name="report"
        />
        <FileButtonWithControl control={control} name="images">
          Add images
        </FileButtonWithControl>
      </form>
    </ModalLayoutV2>
  );
}
