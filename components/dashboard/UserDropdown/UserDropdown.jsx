"use client";
import logoutIcon2 from "@/assets/dashboard/icon/logout-icon.svg";
import changePasswordIcon from "@/assets/dashboard/sidebar-icon/change-password.svg";
import logoutIcon from "@/assets/dashboard/sidebar-icon/logout.svg";
import notificationIcon from "@/assets/dashboard/sidebar-icon/notification.svg";
import profileSettingsIcon from "@/assets/dashboard/sidebar-icon/profile-settings.svg";
import supportTicketIcon from "@/assets/dashboard/sidebar-icon/support.svg";
import userLine from "@/assets/dashboard/user/user-line.png";
import CommonLogoutModal from "@/components/common/CommonLogoutModal";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const UserDropdown = () => {
  const [userDropdown, setUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout, logoutLoading, setLogoutLoading } = useUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close on route change
  useEffect(() => {
    setUserDropdown(false);
  }, [pathname]);

  const menuItems = [
    {
      label: "Profile Settings",
      href: "/dashboard/settings/profile-settings",
      icon: profileSettingsIcon,
    },
    {
      label: "Change Password",
      href: "/dashboard/settings/change-password",
      icon: changePasswordIcon,
    },
    {
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: notificationIcon,
    },
    {
      label: "Support Tickets",
      href: "/dashboard/support-tickets",
      icon: supportTicketIcon,
    },
  ];

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          className="w-[40px] h-[40px] flex-shrink-0 rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => setUserDropdown((prev) => !prev)}
        >
          {user?.user?.avatar ? (
            <Image
              src={user?.user?.avatar}
              width={50}
              height={50}
              alt="User"
              unoptimized
              className="w-[35px] sm:w-[40px] h-[35px] sm:h-[40px] rounded-full"
            />
          ) : (
            <div className="w-[35px] h-[35px] sm:w-[44px] sm:h-[44px] flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center animate-pulse"></div>
          )}
        </button>

        <div
          className={`absolute right-0 mt-[10px] w-[260px] sm:w-[313px] bg-white border-2 border-[rgba(26,32,44,0.16)] rounded-[8px] z-10 transform transition-all duration-300 origin-top ${
            userDropdown
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-[10px] sm:gap-[16px] py-[14px] px-[16px]">
            <div>
              {user?.user?.avatar ? (
                <Image
                  src={user?.user?.avatar}
                  width={50}
                  height={50}
                  alt="User"
                  unoptimized
                  className="w-[44px] h-[44px] rounded-full"
                />
              ) : (
                <div className="w-[35px] h-[35px] sm:w-[44px] sm:h-[44px] flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center animate-pulse"></div>
              )}
            </div>
            <div>
              {user?.user?.full_name ? (
                <div>
                  <h3 className="text-[16px] font-bold text-merchant-text">
                    {user?.user?.full_name}
                  </h3>
                  <p className="text-[13px] font-medium text-[#0C0310]">
                    {user?.user?.username}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="h-[16px] w-[100px] bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-[13px] w-[80px] bg-gray-300 rounded-full mt-[4px] animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <Image
              src={userLine}
              width={50}
              height={50}
              alt="User line"
              className="rounded-full w-full h-[2px]"
            />
          </div>
          <ul className="py-[10px] px-[16px] space-y-[10px]">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="px-[10px] py-[10px] rounded-[8px] flex items-center justify-between gap-[6px] hover:bg-[rgba(76,208,128,0.10)] transition-colors duration-200 border-l-2 border-transparent hover:border-merchant-primary"
                >
                  <div className="flex items-center gap-[13px]">
                    <span>
                      <Image
                        src={item.icon}
                        alt="icon"
                        width={20}
                        height={20}
                      />
                    </span>
                    <span className="text-[14px] font-semibold text-merchant-text">
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-[10px] py-[10px] rounded-[8px] flex items-center justify-between gap-[6px] hover:bg-[rgba(255,0,0,0.05)] transition-colors duration-200 border-l-2 border-transparent hover:border-merchant-error w-full"
              >
                <div className="flex items-center gap-[13px]">
                  <span>
                    <Image
                      src={logoutIcon}
                      alt="logout"
                      width={20}
                      height={20}
                      className="w-[20px] h-[20px] shrink-0"
                    />
                  </span>
                  <span className="text-[14px] font-bold text-merchant-error group-hover:text-merchant-error">
                    Logout
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <CommonLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        footer={
          <div className="flex items-center gap-3 w-full">
            <button
              className="group primary-button secondary-color-btn w-full"
              onClick={() => setShowLogoutModal(false)}
            >
              <span className="primary-button-hover-effect secondary-button-hover-effect"></span>
              <span className="primary-button-text">Cancel</span>
            </button>
            <button
              onClick={logout}
              className="group primary-button error-color-btn w-full"
              disabled={logoutLoading}
            >
              <span className="primary-button-hover-effect error-button-hover-effect"></span>
              <span className="primary-button-text">Yes, Logout</span>
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center">
          <div className="mb-[30px]">
            <div className="flex justify-center items-center w-[56px] h-[56px]">
              <Image
                src={logoutIcon2}
                width={100}
                height={100}
                alt="Logout"
                className="h-full w-full"
              />
            </div>
          </div>
          <h3 className="text-[24px] font-bold text-center text-user-text pb-[12px]">
            Logout Account
          </h3>
          <p className="text-[rgba(45,45,45,0.60)] text-[14px] text-center font-medium">
            Are you sure you want fo logout?
          </p>
        </div>
      </CommonLogoutModal>
    </>
  );
};

export default UserDropdown;
