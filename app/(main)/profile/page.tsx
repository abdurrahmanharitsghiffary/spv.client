import { Metadata } from "next";
import ProfilePage from "@/components/page/profile-page";

export const metadata: Metadata = {
  title: "Profile",
  description: "My profile page",
};

export default function Page() {
  return <ProfilePage />;
}
