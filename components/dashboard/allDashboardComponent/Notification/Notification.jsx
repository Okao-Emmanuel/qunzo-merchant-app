"use client";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { notificationStyles } from "@/utils/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const Notification = () => {
  const network = new NetworkService();
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get all notifications
  const getAllNotifications = async () => {
    setLoading(true);
    try {
      const response = await network.get(ApiPath.notifications, {
        for: "agent",
        page: currentPage,
        per_page: perPage,
      });

      if (response?.status === "completed" && response?.data?.data) {
        const meta = response.data.data.meta;
        if (meta) {
          setPerPage(meta.per_page);
          setLastPage(meta.last_page);
          setTotal(meta.total);
        }
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // page change
  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    getAllNotifications();
  }, [currentPage]);

  // notification skeleton loader
  const renderSkeleton = () =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
      <div
        key={i}
        className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[10px] p-[16px] rounded-[11px] mb-[12px] last:mb-0 animate-pulse"
      >
        <div className="flex items-center gap-[10px] sm:gap-[16px] w-full sm:w-auto">
          <div className="rounded-full h-[40px] w-[40px] flex-shrink-0 bg-gray-300"></div>
          <div className="w-full flex-shrink-0">
            <div className="h-3 bg-gray-200 rounded w-[150px] mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-[80px]"></div>
          </div>
        </div>
      </div>
    ));

  return (
    <>
      <div className="all-notification">
        <div className="flex justify-between items-center mb-[30px]">
          <h4 className="text-[20px] font-semibold text-agent-text">
            Notifications
          </h4>
        </div>
        <div className="border border-[rgba(26,32,44,0.10)] p-[30px] rounded-[8px]">
          {loading ? (
            <div className="all-notification">{renderSkeleton()}</div>
          ) : (
            <div className="all-notification">
              {notifications?.notifications?.length === 0 ? (
                <div className="h-[calc(100vh-180px)] flex justify-center items-center">
                  <NoDataFound message="No notifications found" />
                </div>
              ) : (
                <>
                  {notifications?.notifications?.map((notification, index) => {
                    const { icon, bg } =
                      notificationStyles[notification.type] ||
                      notificationStyles.default;

                    return (
                      <div
                        key={notification.id || notification.created_at || index}
                        className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[10px] rounded-[11px] mb-[30px] last:mb-0`}
                      >
                        <div className="left flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-[16px]">
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
                              <p className="text-[12px] font-medium text-[rgba(26,32,44,0.60)]">
                                {notification.created_at}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {notifications?.notifications?.length > 0 && (
        <div className="mt-[30px]">
          <Pagination
            lastPage={lastPage}
            handlePageClick={handlePageClick}
            currentPage={currentPage}
            perPage={perPage}
            total={total}
          />
        </div>
      )}
    </>
  );
};

export default Notification;
