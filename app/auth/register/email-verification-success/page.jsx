"use client";
import dynamic from "next/dynamic";

const EmailVerificationSuccess = dynamic(
  () => import("@/components/auth/Register/EmailVerificationSuccess"),
  { ssr: false }
);

const page = () => {
  return <EmailVerificationSuccess />;
};

export default page;
