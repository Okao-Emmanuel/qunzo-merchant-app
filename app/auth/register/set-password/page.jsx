"use client";
import dynamic from "next/dynamic";

const RegisterPassword = dynamic(
  () => import("@/components/auth/Register/RegisterPassword"),
  { ssr: false }
);

const page = () => {
  return <RegisterPassword />;
};

export default page;
