"use client";

import { myAccount, myAccountImages } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { UpdateUserDataOptions } from "@/types";
import { useMutate } from "../hooks";

export const useUpdateMyAccountInfo = () => {
  const {
    mutate: updateAccount,
    mutateAsync: updateAccountAsync,
    ...rest
  } = useMutate<UpdateUserDataOptions>({
    method: "patch",
    baseUrl: myAccount,
    invalidateTags: (v) => [keys.meAccount(), keys.mePosts()],
  });

  return { updateAccount, updateAccountAsync, ...rest };
};

export const useUpdateMyAccountImage = () => {
  const {
    mutate: updateAccountImage,
    mutateAsync: updateAccountImageAsync,
    ...rest
  } = useMutate<{ image: File }>({
    baseUrl: myAccountImages,
    method: "patch",
    invalidateTags: (v) => [keys.meAccount()],
  });

  return { updateAccountImage, updateAccountImageAsync, ...rest };
};

export const useDeleteMyAccountImage = () => {
  const {
    mutate: deleteAccountImage,
    mutateAsync: deleteAccountImageAsync,
    ...rest
  } = useMutate({
    baseUrl: myAccountImages,
    method: "delete",
    invalidateTags: (v) => [keys.meAccount()],
  });

  return { deleteAccountImage, deleteAccountImageAsync, ...rest };
};

export const useDeleteMyAccount = () => {
  const {
    mutate: deleteMyAccount,
    mutateAsync: deleteMyAccountAsync,
    ...rest
  } = useMutate({
    baseUrl: myAccount,
    method: "delete",
    invalidateTags: (v) => [keys.meAccount()],
  });

  return { deleteMyAccount, deleteMyAccountAsync, ...rest };
};

export const useUpdateMyCoverImage = () => {
  const {
    mutate: updateCoverImage,
    mutateAsync: updateCoverImageAsync,
    ...rest
  } = useMutate<{ image: File }>({
    baseUrl: myAccountImages + "?type=cover",
    method: "patch",
    invalidateTags: (v) => [keys.meAccount()],
  });

  return { updateCoverImage, updateCoverImageAsync, ...rest };
};

export const useDeleteMyCoverImage = () => {
  const {
    mutate: deleteCoverImage,
    mutateAsync: deleteCoverImageAsync,
    ...rest
  } = useMutate<{ image: File }>({
    baseUrl: myAccountImages + "?type=cover",
    method: "delete",
    invalidateTags: (v) => [keys.meAccount()],
  });

  return { deleteCoverImage, deleteCoverImageAsync, ...rest };
};
