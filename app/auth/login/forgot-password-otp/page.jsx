"use client";
import dynamic from "next/dynamic";

const ForgetPasswordOtp = dynamic(
  () => import("@/components/auth/ForgetPasswordOtp"),
  { ssr: false }
);

const page = () => {
  return (
    <>
      <ForgetPasswordOtp />
    </>
  );
};

export default page;
