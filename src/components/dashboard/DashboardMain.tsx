import HTMLServerParser from "@/components/HTMLServerParser";
import { getDashboardMain } from "@/api/contents/getDashboardMain";

export async function DashboardMain() {
  const dashboardMain = await getDashboardMain();

  if (dashboardMain.error) {
    return <>Failed to fetch dashboard content: {dashboardMain.error}</>;
  }

  return <HTMLServerParser content={dashboardMain.data} />;
}
