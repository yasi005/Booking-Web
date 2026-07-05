import { AdminDashboardPage } from "@/components/admin/admin-dashboard-page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminDashboardPage />
    </Suspense>
  );
}
