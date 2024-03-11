"use client";

import React, { useEffect } from "react";
import ModalLayoutV2 from "../layoutV2";
import {
  useGetSelectedGroupId,
  useMembershipRequestActions,
  useMembershipRequestIsOpen,
} from "@/stores/membership-request-store";
import { useRequestGroupMembership } from "@/lib/api/application-request/mutation";
import { TextareaWithControl } from "@/components/input/input-with-control";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { useConfirm } from "@/stores/confirm-store";
import { toast } from "react-toastify";
import { TypographyLarge } from "@/components/ui/typography";

const applicationRequestSchema = z.object({ comment: z.string().optional() });
type ApplicationRequestSchema = z.infer<typeof applicationRequestSchema>;

export default function MembershipRequestModal() {
  const gId = useGetSelectedGroupId();
  const { onClose } = useMembershipRequestActions();
  const { requestGroupMembershipAsync } = useRequestGroupMembership();
  const isOpen = useMembershipRequestIsOpen();
  const confirm = useConfirm();
  const onSubmit: SubmitHandler<ApplicationRequestSchema> = async (data) => {
    if (gId === null) return;
    await toast.promise(
      requestGroupMembershipAsync({
        body: { comment: data?.comment },
        params: { groupId: gId },
      }),
      {
        error: {
          render({ data }) {
            return (data as any)?.message ?? "Something went wrong!";
          },
        },
        pending: "Sending your membership request...",
        success: "Membership request has been sent successfully.",
      }
    );
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm<ApplicationRequestSchema>({
    resolver: zodResolver(applicationRequestSchema),
    defaultValues: { comment: undefined },
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful]);

  const handleCancel = async () => {
    await confirm({
      title: "Discard",
      body: "Are you sure discard the membership request?",
      confirmLabel: "Discard",
      confirmColor: "danger",
    });
    reset();
  };

  return (
    <ModalLayoutV2
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2 justify-between">
          <Button color="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="primary" type="submit" form="application_request_form">
            Send
          </Button>
        </div>
      }
    >
      <form
        id="application_request_form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TypographyLarge className="!text-base">
          Request to join
        </TypographyLarge>
        <TextareaWithControl
          control={control}
          name="comment"
          label="Reason (optional)"
          placeholder="Enter your reason for joining this group..."
        />
      </form>
    </ModalLayoutV2>
  );
}
