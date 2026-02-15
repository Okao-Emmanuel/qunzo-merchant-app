"use client";
import KycDetails from "@/components/dashboard/allDashboardComponent/Settings/KycDetails";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const kycID = params.id;
  return (
    <>
      <KycDetails kycID={kycID} />
    </>
  );
};

export default page;
