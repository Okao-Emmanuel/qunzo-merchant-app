"use client";
import dynamic from "next/dynamic";

const DashboardLanding = dynamic(
  () => import("@/components/dashboard/DashboardLanding/DashboardLanding"),
  { ssr: false }
);

const page = () => {
  return (
    <>
      <DashboardLanding />
    </>
  );
};

export default page;
