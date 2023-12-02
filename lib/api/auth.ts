"use client";
import useAxiosInterceptor from "@/hooks/use-axios-interceptor";
import { useSetSession } from "@/stores/auth-store";
import { ApiResponseT } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginRoute, logoutRoute, signUpRoute } from "../endpoints";
import { keys } from "../queryKey";
import { LoginData } from "@/types";
import axios from "axios";

// FORGET PASSWORD IMPLEMENT

export const useLogin = () => {
  const setSession = useSetSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: login,
    mutateAsync: loginAsync,
    ...rest
  } = useMutation({
    mutationFn: (data: LoginData) =>
      axios
        .post(loginRoute, data, { withCredentials: true })
        .then(
          (res) =>
            res.data as ApiResponseT<{
              access_token: string;
              token_type: string;
              expires_in: number;
            }>
        )
        .catch((err) => Promise.reject(err.response.data)),
    onSuccess: (data, v, ctx) => {
      const res = data?.data;
      if (res?.access_token) {
        setSession({
          ...JSON.parse(window.atob(res?.access_token.split(".")[1])),
          accessToken: res?.access_token,
        });
        router.push("/");
      }
      queryClient.invalidateQueries({ queryKey: keys.meAccount() });
    },
  });

  return { login, loginAsync, ...rest };
};

export const useLogout = () => {
  const setSession = useSetSession();
  const request = useAxiosInterceptor();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: logout,
    mutateAsync: logoutAsync,
    ...rest
  } = useMutation({
    mutationFn: () =>
      request
        .post(logoutRoute, {}, { withCredentials: true })
        .then((res) => res.data as ApiResponseT<null>)
        .catch((err) => Promise.reject(err.response.data)),
    onSuccess: (data, v, ctx) => {
      setSession(null);
      router.push("/login");
      queryClient.invalidateQueries({ queryKey: keys.meAccount() });
    },
  });

  return { logout, logoutAsync, ...rest };
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    mutate: register,
    mutateAsync: registerAsync,
    ...rest
  } = useMutation({
    mutationFn: (v: {
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      password: string;
    }) =>
      axios
        .post(signUpRoute, v, { withCredentials: true })
        .then((res) => res.data)
        .catch((err) => Promise.reject(err)),
    onSuccess: () => {
      router.push("/");
      queryClient.invalidateQueries({ queryKey: keys.meAccount() });
    },
  });
  return { register, registerAsync, ...rest };
};
