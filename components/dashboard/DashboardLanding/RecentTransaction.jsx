"use client";
import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import { useSettings } from "@/context/settingsContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { getSettingValue, getUserTransactionIcon } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const RecentTransaction = () => {
  const networkService = new NetworkService();
  const [transactions, setTransactions] = useState([]);
  const [transactionsTypes, setTransactionsTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { settings } = useSettings();
  const siteCurrency = getSettingValue(settings, "site_currency");
  const siteCurrencyDecimals = getSettingValue(
    settings,
    "site_currency_decimals"
  );

  // Fetch Transactions
  const fetchResTransactionsData = async () => {
    try {
      setLoading(true);
      const response = await networkService.get(ApiPath.transactions);
      if (response?.status === "completed" && response?.data?.data?.transactions) {
        setTransactions(response.data.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    fetchResTransactionsData();
  }, []);

  return (
    <>
      <div className="border border-[rgba(26,32,44,0.10)] p-[20px] rounded-[8px]">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-[20px]">
          <h4 className="text-[18px] font-bold text-merchant-text">
            Transactions
          </h4>
        </div>
        <div className="bg-white rounded-[8px]">
          <div className="max-w-full overflow-x-auto">
            <div className="common-table min-w-[1020px]">
              <div className="full-table">
                <table className="w-full whitespace-nowrap">
                  <thead className="table-head">
                    <tr className="table-head-tr">
                      <th className="table-th">
                        Description <i className="flaticon-004-bank"></i>
                      </th>
                      <th className="table-th">Transaction ID</th>
                      <th className="table-th">Type</th>
                      <th className="table-th">Amount</th>
                      <th className="table-th">Charge</th>
                      <th className="table-th">Status</th>
                      <th className="table-th">Method</th>
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
                    ) : hasFetched && transactions.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-[40px] text-center">
                          <NoDataFound message="No Transactions Found" />
                        </td>
                      </tr>
                    ) : (
                      transactions.slice(0, 7).map((transaction, index) => {
                        const { icon, bg } = getUserTransactionIcon(
                          transaction.type
                        );
                        return (
                          <tr
                            className="table-body-tr last:!border-0"
                            key={index}
                          >
                            <td className="table-td">
                              <div className="flex items-center gap-[10px]">
                                <div
                                  className={`icon w-[40px] h-[40px] flex items-center justify-center rounded-full flex-shrink-0 ${bg}`}
                                >
                                  <Image
                                    src={icon}
                                    alt="icon"
                                    width={20}
                                    height={20}
                                  />
                                </div>
                                <div>
                                  <h6 className="text-[13px] font-bold text-merchant-text mb-[5px]">
                                    {transaction.description}
                                  </h6>
                                  <p className="text-[12px] text-merchant-paragraph font-semibold">
                                    {transaction.created_at}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="table-td">
                              <span className="text-[13px] text-merchant-text font-semibold">
                                {transaction.tnx}
                              </span>
                            </td>
                            <td className="table-td">
                              <span className="text-[13px] text-merchant-paragraph font-semibold">
                                {transaction.type}
                              </span>
                            </td>
                            <td className="table-td">
                              <div className="flex items-center gap-[5px]">
                                <Icon
                                  icon={
                                    transaction.is_plus
                                      ? "lucide:arrow-up"
                                      : "lucide:arrow-down"
                                  }
                                  width="20"
                                  height="20"
                                  className={`w-[20px] h-[20px] ${
                                    transaction.is_plus
                                      ? "text-merchant-success"
                                      : "text-merchant-error"
                                  }`}
                                />
                                <span className="block text-[13px] text-merchant-paragraph font-semibold">
                                  {transaction.is_plus ? "+" : "-"}
                                  {transaction.amount}{" "}
                                  {transaction.trx_currency_code}
                                </span>
                              </div>
                            </td>
                            <td className="table-td">
                              <div className="flex items-center gap-[5px]">
                                <Icon
                                  icon="lucide:arrow-down"
                                  width="24"
                                  height="24"
                                  className="text-merchant-error w-[20px] h-[20px]"
                                />
                                <span className="block text-[13px] text-merchant-paragraph font-semibold">
                                  -{transaction.charge}{" "}
                                  {transaction.trx_currency_code}
                                </span>
                              </div>
                            </td>
                            <td className="table-td">
                              <Badge status={transaction.status} />
                            </td>
                            <td className="table-td">
                              <span className="text-[13px] text-merchant-paragraph font-semibold">
                                {transaction.method}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentTransaction;
