"use client";

import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { myAccount, myAccountImages } from "@/lib/endpoints";
import { keys } from "@/lib/queryKey";
import { UpdateUserDataOptions } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

export const useUpdateMyAccountInfo = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: updateAccount,
    mutateAsync: updateAccountAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      data: UpdateUserDataOptions;
      config?: AxiosRequestConfig;
    }) => {
      return request
        .patch(myAccount, v.data, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({
        queryKey: keys.meAccount(),
      });
      queryClient.invalidateQueries({
        queryKey: keys.mePosts(),
      });
    },
  });

  return { updateAccount, updateAccountAsync, ...rest };
};

export const useUpdateMyAccountImage = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: updateAccountImage,
    mutateAsync: updateAccountImageAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { image: File; config?: AxiosRequestConfig }) => {
      const formData = new FormData();
      formData.append("image", v.image);

      return request
        .patch(myAccountImages, formData, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({
        queryKey: keys.meAccount(),
      });
    },
  });

  return { updateAccountImage, updateAccountImageAsync, ...rest };
};

export const useDeleteMyAccountImage = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: deleteAccountImage,
    mutateAsync: deleteAccountImageAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { config?: AxiosRequestConfig }) => {
      return request
        .delete(myAccountImages, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });

  return { deleteAccountImage, deleteAccountImageAsync, ...rest };
};

export const useDeleteMyAccount = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: deleteMyAccount,
    mutateAsync: deleteMyAccountAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { config?: AxiosRequestConfig }) => {
      return request
        .delete(myAccount, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });

  return { deleteMyAccount, deleteMyAccountAsync, ...rest };
};

export const useUpdateMyCoverImage = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: updateCoverImage,
    mutateAsync: updateCoverImageAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { image: File; config?: AxiosRequestConfig }) => {
      const formData = new FormData();
      formData.append("image", v.image);
      const url = new URL(myAccountImages);
      url.searchParams.append("type", "cover");
      return request
        .patch(url.href, formData, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({
        queryKey: keys.meAccount(),
      });
    },
  });
  return { updateCoverImage, updateCoverImageAsync, ...rest };
};

export const useDeleteMyCoverImage = () => {
  const request = useAxiosInterceptor();
  const queryClient = useQueryClient();

  const {
    mutate: deleteCoverImage,
    mutateAsync: deleteCoverImageAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: { config?: AxiosRequestConfig }) => {
      const url = new URL(myAccountImages);
      url.searchParams.append("type", "cover");
      return request
        .delete(url.href, v?.config)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err?.response?.data));
    },
    onSuccess: (d, v) => {
      queryClient.invalidateQueries({
        queryKey: keys.meAccount(),
      });
    },
  });

  return { deleteCoverImage, deleteCoverImageAsync, ...rest };
};
