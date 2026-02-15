"use client";
import SupportChat from "@/components/dashboard/allDashboardComponent/support/SupportChat";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const ticketID = params.id;
  return (
    <>
      <SupportChat ticketID={ticketID} />
    </>
  );
};

export default page;
