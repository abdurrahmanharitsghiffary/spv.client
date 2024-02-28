import { UserSimplified } from "./user";

export type AppRequest = {
  id: number;
  comment: string | null;
  createdAt: Date;
  sender: UserSimplified;
  status: "PENDING" | "APPROVED" | "REJECTED";
  type: "group_chat" | "group_community";
  updatedAt: Date;
};

export type MembershipRequest = {
  groupId: number;
} & AppRequest;
