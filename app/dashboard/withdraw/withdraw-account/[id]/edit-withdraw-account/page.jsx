"use client";
import EditWithdrawAccount from "@/components/dashboard/allDashboardComponent/Withdraw/EditWithdrawAccount";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const withdrawId = params.id;
  return (
    <>
      <EditWithdrawAccount withdrawId={withdrawId} />
    </>
  );
};

export default page;
