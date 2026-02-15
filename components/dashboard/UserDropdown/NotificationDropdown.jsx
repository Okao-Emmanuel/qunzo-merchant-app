"use client";
import notificationIcon from "@/assets/dashboard/sidebar-icon/notification.svg";
import userLine from "@/assets/dashboard/user/user-line.png";
import NoDataFound from "@/components/common/NoDataFound";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { notificationStyles } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NotificationDropdown = () => {
  const network = new NetworkService();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Get all notifications
  const getAllNotifications = async () => {
    try {
      const response = await network.get(ApiPath.notifications, {
        for: "merchant",
      });

      setNotifications(response.data.data);
      setUnreadCount(response.data.data.unread_count);
    } finally {
    }
  };

  // mark all as read
  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => {
        if (!prev?.notifications) return prev;
        return {
          ...prev,
          notifications: prev.notifications.map((n) => ({
            ...n,
            is_read: true,
          })),
          unread_count: 0,
        };
      });
      setUnreadCount(0);

      await network.post(
        ApiPath.markAsReadNotification,
        {},
        {
          for: "merchant",
        }
      );
    } finally {
    }
  };

  // notification styles based on type

  useEffect(() => {
    getAllNotifications();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close on route change
  useEffect(() => {
    setNotificationDropdown(false);
  }, [pathname]);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] flex-shrink-0 rounded-[8px] bg-white flex items-center justify-center cursor-pointer"
        onClick={() => setNotificationDropdown((prev) => !prev)}
      >
        <span className="relative">
          <Image
            src={notificationIcon}
            alt="Notification"
            width={20}
            height={20}
            className="w-[20px] h-[20px]"
          />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-[2px] w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </span>
      </button>

      <div
        className={`absolute right-[-55px] sm:right-0 mt-[10px] w-[280px] sm:w-[433px] bg-white border-2 border-[rgba(26,32,44,0.16)] rounded-[8px] z-10 transform transition-all duration-300 origin-top ${
          notificationDropdown
            ? "opacity-100 scale-y-100"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        <div>
          <div className="flex justify-between items-center px-[16px] py-[16px]">
            <h3 className="text-base sm:text-lg font-bold text-merchant-text">
              Notifications
            </h3>

            <div className="flex items-center gap-1 sm:gap-[20px]">
              {notifications?.unread_count > 0 && (
                <button
                  className="underline text-[14px] font-semibold text-merchant-text"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              <button
                className="cursor-pointer text-merchant-paragraph"
                onClick={() => setNotificationDropdown(false)}
              >
                <Icon icon="lucide:x" width="24" height="24" />
              </button>
            </div>
          </div>
          <div className="mb-[12px]">
            <Image
              src={userLine}
              alt="Notification"
              width={20}
              height={20}
              className="w-full h-[2px]"
            />
          </div>
          <div className="max-h-[532px] overflow-y-auto">
            <div className="px-[16px] py-[16px]">
              {notifications?.notifications?.length === 0 ? (
                <>
                  <div className="my-4">
                    <NoDataFound message="No notifications found" />
                  </div>
                </>
              ) : (
                <>
                  {notifications?.notifications?.map((notification) => {
                    const { icon, bg } =
                      notificationStyles[notification.type] ||
                      notificationStyles.default;

                    return (
                      <div
                        key={notification.id}
                        className={`flex items-center justify-between gap-[10px] sm:gap-[16px] mb-[24px]`}
                      >
                        <div className="flex items-start gap-[10px] sm:gap-[16px]">
                          <div
                            className={`icon rounded-full h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] flex items-center justify-center flex-shrink-0`}
                            style={{ background: bg }}
                          >
                            <Image
                              src={icon}
                              alt="icon"
                              width={20}
                              height={20}
                            />
                          </div>
                          <div>
                            <h6 className="text-[15px] font-semibold text-merchant-text mb-[8px]">
                              {notification.title}
                            </h6>
                            <p className="text-[12px] font-medium text-[rgba(12,3,16,0.80)]">
                              {notification.created_at}
                            </p>
                          </div>
                        </div>
                        {!notification.is_read && (
                          <div>
                            <span className="block h-[8px] w-[8px] rounded-full bg-merchant-primary"></span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center px-[20px] pt-[12px] pb-[30px]">
            <Link
              href="/dashboard/notifications"
              className="group primary-button secondary-color-btn w-full"
            >
              <span className="primary-button-hover-effect secondary-button-hover-effect"></span>
              <span className="primary-button-text">View all</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
