import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useNotFoundRedirect(
  error: unknown,
  isError: boolean,
  customCondition?: boolean
) {
  const router = useRouter();
  const errorMessage = (error as any)?.data?.message ?? "";

  useEffect(() => {
    if (
      isError &&
      (errorMessage.includes("not found") ||
        (error as any)?.data?.name === "ZodError")
    )
      router.push("/");
  }, [errorMessage, isError, error]);

  useEffect(() => {
    if (customCondition) router.push("/");
  }, [customCondition]);
}
