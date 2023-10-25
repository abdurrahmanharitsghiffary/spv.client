"use client";

import { constructUrl, urlBase } from "@/lib/endpoints";
import { Button } from "@nextui-org/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function VerifyButton({ token }: { token: string }) {
  const router = useRouter();

  const handleVerify = async () => {
    try {
      await toast.promise(
        axios
          .post(constructUrl([urlBase("/account/verify"), token]))
          .then((res) => res.data)
          .catch((err) => Promise.reject(err?.response?.data)),
        {
          success: {
            render(props) {
              return "Account successfully verified";
            },
          },
          error: {
            render({ data }) {
              return (data as any)?.data?.message ?? "Something went wrong";
            },
          },
          pending: "Verifying account...",
        }
      );

      router.push("/");
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <Button color="primary" className="w-fit" onClick={handleVerify}>
      Verify Account
    </Button>
  );
}
