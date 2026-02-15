"use client";
import dynamic from "next/dynamic";

const RegisterVerifyEmail = dynamic(
  () => import("@/components/auth/Register/RegisterVerifyEmail"),
  { ssr: false }
);

const page = () => {
  return (
    <>
      <RegisterVerifyEmail />
    </>
  );
};

export default page;
