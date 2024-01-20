"use client";
import { refreshTokenRoute } from "@/lib/endpoints";
import { useSetSession, useSession } from "@/stores/auth-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const instance = axios.create({ withCredentials: true });

export default function useAxiosInterceptor() {
  const session = useSession();
  const router = useRouter();
  const setSession = useSetSession();
  useEffect(() => {
    const reqInterceptors = instance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${
            session?.accessToken ?? ""
          }`;
        }

        return config;
      },
      (err) => {
        console.error(err);
        Promise.reject(err);
      }
    );

    const resInterceptors = instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error?.config;
        if (
          (error?.response?.status === 403 ||
            error?.response?.status === 401) &&
          !originalRequest?._retry
        ) {
          originalRequest._retry = true;
          try {
            const res = await axios.post(refreshTokenRoute, null, {
              withCredentials: true,
            });
            const accessToken = res?.data?.data?.access_token ?? "";
            setSession({
              ...JSON.parse(atob(accessToken?.split(".")?.[1] ?? "")),
              accessToken,
            });
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return instance(originalRequest);
          } catch (err) {
            console.error(err, "Interceptors errors");
            router.push("/login");
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(reqInterceptors);
      instance.interceptors.response.eject(resInterceptors);
    };
  }, [session]);

  return instance;
}
