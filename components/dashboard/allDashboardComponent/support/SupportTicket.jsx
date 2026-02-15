"use client";
import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { CreatedAtFormatDate } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SupportTicket = () => {
  const network = new NetworkService();
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSupportTickets = async () => {
    setLoading(true);
    try {
      const res = await network.get(ApiPath.supportTicket, {
        page: currentPage,
        per_page: perPage,
        subject: searchQuery,
        status: status,
      });
      setSupportTickets(res.data.data);
      setPerPage(res.data.data.pagination.per_page);
      setLastPage(res.data.data.pagination.last_page);
      setTotal(res.data.data.pagination.total);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  // page change
  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
  };

  const handleSearch = () => {
    fetchSupportTickets();
  };

  useEffect(() => {
    fetchSupportTickets();
  }, [status, currentPage]);

  return (
    <>
      <div>
        <div className="mb-[30px]">
          <h4 className="text-[20px] font-bold text-merchant-text">
            Support Tickets
          </h4>
        </div>
        <div className="border border-[rgba(26,32,44,0.10)] p-[20px] rounded-[8px]">
          <div className="filter flex flex-wrap justify-between items-center gap-[16px] mb-[30px]">
            <div className="w-full sm:w-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="text"
                  className="user-input user-input-4 !border"
                  placeholder="Search Message"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="group primary-button primary-button-md w-full sm:w-1/2"
                  onClick={handleSearch}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">Search</span>
                </button>
              </div>
            </div>
            <div>
              <Link
                href="/dashboard/support-tickets/create-support"
                className="primary-button-3"
              >
                Create Ticket
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-[8px]">
            <div className="max-w-full overflow-x-auto">
              <div className="common-table min-w-[1020px]">
                <div className="full-table">
                  <table className="w-full whitespace-nowrap">
                    <thead className="table-head">
                      <tr className="table-head-tr">
                        <th className="table-th">Ticket Title</th>
                        <th className="table-th">Status </th>
                        <th className="table-th">Action</th>
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="text-center pt-5">
                            <div className="flex justify-center items-center">
                              <LoadingSpinner />
                            </div>
                          </td>
                        </tr>
                      ) : hasFetched &&
                        supportTickets?.tickets?.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-[40px] text-center">
                            <NoDataFound message="No Ticket Found" />
                          </td>
                        </tr>
                      ) : (
                        <>
                          {supportTickets?.tickets?.map((supportTicket) => (
                            <tr
                              className="table-body-tr last:!border-0"
                              key={supportTicket?.id}
                            >
                              <td className="table-td">
                                <div className="flex items-center gap-[10px]">
                                  <div
                                    className={`icon w-[40px] h-[40px] flex items-center justify-center rounded-full flex-shrink-0}`}
                                  >
                                    <Image
                                      src={supportTicket?.user?.avatar}
                                      alt="icon"
                                      width={20}
                                      height={20}
                                      unoptimized
                                      className="w-full h-full rounded-full"
                                    />
                                  </div>
                                  <div>
                                    <h6 className="text-[13px] font-bold text-merchant-text mb-[5px]">
                                      {supportTicket?.uuid} -{" "}
                                      {supportTicket?.title}
                                    </h6>
                                    <p className="text-[12px] text-merchant-paragraph font-semibold">
                                      Create At :{" "}
                                      <CreatedAtFormatDate
                                        createdAt={supportTicket?.created_at}
                                      />
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="table-td">
                                {supportTicket?.status === "open" ? (
                                  <Badge status="open" />
                                ) : (
                                  <Badge status="closed" />
                                )}
                              </td>
                              <td className="table-td">
                                <Link
                                  href={`/dashboard/support-tickets/${supportTicket?.uuid}/support-chat`}
                                  className="group primary-button primary-button-sm"
                                >
                                  <span className="primary-button-hover-effect"></span>
                                  <span className="primary-button-text">
                                    View
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {supportTickets?.tickets?.length > 0 && (
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

export default SupportTicket;
