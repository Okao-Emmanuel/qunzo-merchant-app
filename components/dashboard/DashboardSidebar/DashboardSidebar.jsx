"use client";
import logoutIcon2 from "@/assets/dashboard/icon/logout-icon.svg";
import apiAccessKeyIcon from "@/assets/dashboard/sidebar-icon/api-access-key.svg";
import dashboardIcon from "@/assets/dashboard/sidebar-icon/dashboard.svg";
import myWalletsIcon from "@/assets/dashboard/sidebar-icon/my-wallets.svg";
import notificationIcon from "@/assets/dashboard/sidebar-icon/notification.svg";
import qrCodeIcon from "@/assets/dashboard/sidebar-icon/qr-code.svg";
import settingsIcon from "@/assets/dashboard/sidebar-icon/settings.svg";
import supportTicketIcon from "@/assets/dashboard/sidebar-icon/support.svg";
import transactionIcon from "@/assets/dashboard/sidebar-icon/transaction.svg";
import withdrawMoneyIcon from "@/assets/dashboard/sidebar-icon/withdraw.svg";
import logo from "@/assets/logo/logo.png";
import CommonLogoutModal from "@/components/common/CommonLogoutModal";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const currentPath = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, loading, logout, logoutLoading, setLogoutLoading } = useUser();

  const isActive = (href) => {
    if (href === "/dashboard") {
      return currentPath === "/dashboard";
    }
    return currentPath.startsWith(href);
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: dashboardIcon },
    { label: "My Wallets", href: "/dashboard/my-wallets", icon: myWalletsIcon },
    { label: "QR Code", href: "/dashboard/qr-code", icon: qrCodeIcon },
    {
      label: "API Access Key",
      href: "/dashboard/api-access-key",
      icon: apiAccessKeyIcon,
    },
    {
      label: "Transactions",
      href: "/dashboard/transactions",
      icon: transactionIcon,
    },
    {
      label: "Withdraw",
      href: "/dashboard/withdraw",
      icon: withdrawMoneyIcon,
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
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[288px] bg-merchant-bg-one transform 
          transition-transform duration-300 ease-in-out border-r border-[rgba(61,53,64,0.10)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:fixed lg:translate-x-0 lg:flex lg:flex-col
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-[80px] shrink-0 px-6 bg-merchant-bg-one border-b border-[rgba(61,53,64,0.10)]">
          <Link href="/">
            <Image
              src={logo}
              alt="Logo"
              width={200}
              height={200}
              className="h-[30px] w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="full-nav mt-[20px] h-100vh overflow-y-auto hide-scrollbar">
          <ul className="px-[16px]">
            <span className="block px-[32px] py-[10px] mb-[10px] text-[12px] text-merchant-paragraph font-semibold uppercase">
              Menu
            </span>
            {menuItems.map((item) => (
              <li key={item.href} className="mb-[12px] last:mb-0">
                <Link
                  href={item.href}
                  className={`group flex items-center px-[16px] py-[12px] text-[14px] font-semibold rounded-[8px] relative overflow-hidden transition-colors duration-200 border-l-4 ${
                    isActive(item.href)
                      ? "bg-[rgba(76,208,128,0.15)] text-agent-primary border-l-merchant-primary"
                      : "text-agent-text hover:bg-[rgba(76,208,128,0.15)] hover:border-l-merchant-primary border-l-transparent"
                  }`}
                >
                  <div className="flex items-center">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={20}
                      height={20}
                      className="mr-3"
                    />
                    <span className="font-bold">{item.label}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <div className="h-[1px] bg-[rgba(61,53,64,0.10)] my-[24px] mx-[16px]"></div>
            <span className="block px-[32px] py-[10px] mb-[10px] text-[12px] text-merchant-paragraph font-semibold uppercase">
              General
            </span>
          </div>
          <ul className="px-[16px] space-y-[12px]">
            <li>
              <Link
                href="/dashboard/settings"
                className={`group flex items-center px-[16px] py-[12px] text-[14px] font-semibold rounded-[8px] relative overflow-hidden transition-colors duration-200 border-l-4 ${
                  isActive("/dashboard/settings")
                    ? "bg-[rgba(76,208,128,0.15)] text-agent-primary border-l-merchant-primary"
                    : "text-agent-text hover:bg-[rgba(76,208,128,0.15)] hover:border-l-merchant-primary border-l-transparent"
                }`}
              >
                <div className="flex items-center">
                  <Image
                    src={settingsIcon}
                    alt="icon"
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                  <span className="font-bold">Settings</span>
                </div>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                className={`group w-full flex items-center px-[16px] py-[12px] text-[14px] font-semibold rounded-[8px] relative overflow-hidden transition-colors duration-200 border-l-4 ${
                  isActive("/dashboard/logout")
                    ? "bg-[rgba(208,76,76,0.15)] text-agent-primary border-l-merchant-error"
                    : "text-agent-text hover:bg-[rgba(208,76,76,0.15)] hover:border-l-merchant-error border-l-transparent"
                }`}
              >
                <div className="flex items-center">
                  <Image
                    src={logoutIcon2}
                    alt="dashboard"
                    width={100}
                    height={100}
                    className="mr-3 h-[20px] w-[20px]"
                  />
                  <span className="font-bold">Logout</span>
                </div>
              </button>
            </li>
          </ul>
        </nav>
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

export default DashboardSidebar;
