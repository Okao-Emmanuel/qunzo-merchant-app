"use client";
import dynamic from "next/dynamic";

const IdVerificationChoose = dynamic(
  () => import("@/components/auth/Register/IdVerificationChoose"),
  { ssr: false }
);

const page = () => {
  return (
    <>
      <IdVerificationChoose />
    </>
  );
};

export default page;
