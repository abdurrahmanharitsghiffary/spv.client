import VerifyButton from "@/components/button/verify-button";

export default function VerifyPage({ params }: { params: { token: string } }) {
  return <VerifyButton token={params.token} />;
}
