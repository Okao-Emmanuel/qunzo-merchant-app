"use client";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import NotificationDropdown from "../UserDropdown/NotificationDropdown";
import UserDropdown from "../UserDropdown/UserDropdown";

const DashboardHeader = ({ onMenuClick }) => {
  return (
    <header className="bg-merchant-bg-one border-b border-[rgba(26,32,44,0.08)] h-[80px] sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-[30px]">
        <div className="flex items-center gap-4">
          <button
            className="text-gray-700 hover:text-gray-900 block lg:hidden"
            onClick={onMenuClick}
          >
            <HiOutlineBars3CenterLeft className="text-2xl" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* <LanguageDropdown /> */}
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
