import { getCurrentUser } from "@/lib/get-user";
import { PublicLanding } from "@/components/public-landing";
import DashboardLayout from "./(dashboard)/layout";
import MyPage from "./(dashboard)/page";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <PublicLanding />;
  }

  return (
    <DashboardLayout>
      <MyPage />
    </DashboardLayout>
  );
}
