import { redirect } from "next/navigation";

const page = () => {
  redirect("/dashboard/withdraw/withdraw-money");
};

export default page;
