"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const layout = ({ children }) => {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  // Hide navigation for these routes
  const hideNavigation =
    pathname === "/dashboard/withdraw/withdraw-account" ||
    pathname.includes("/withdraw-account/add-withdraw-account") ||
    (pathname.includes("/withdraw-account/") &&
      pathname.includes("/edit-withdraw-account"));

  return (
    <div>
      {!hideNavigation && (
        <div className="flex flex-wrap gap-2 justify-between items-center mb-[35px]">
          <h4 className="text-[20px] font-bold text-merchant-text">
            Withdraw Money
          </h4>
          <Link
            href="/dashboard/withdraw/withdraw-account"
            className="primary-button-3"
          >
            Withdraw Account
          </Link>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default layout;
