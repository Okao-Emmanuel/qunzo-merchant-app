"use client";
import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/context/settingsContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { getSettingValue, getUserTransactionIcon } from "@/utils/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const TransactionHistory = () => {
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
      const response = await networkService.get(ApiPath.transactions, {
        page: currentPage,
        per_page: perPage,
        txn: searchQuery,
        status: status,
      });
      setTransactions(response.data.data.transactions);
      setPerPage(response.data.data.meta.per_page);
      setLastPage(response.data.data.meta.last_page);
      setTotal(response.data.data.meta.total);
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

  useEffect(() => {
    fetchResTransactionsData();
  }, [currentPage, type, status]);

  return (
    <>
      <div>
        <div className="mb-[30px]">
          <h4 className="text-[20px] font-bold text-merchant-text">
            Transactions
          </h4>
        </div>
        <div className="border border-[rgba(26,32,44,0.10)] p-[20px] rounded-[8px]">
          <div className="filter flex items-center gap-[16px] mb-[30px]">
            <div className="w-full sm:w-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="text"
                  className="user-input user-input-4 !border"
                  placeholder="Transaction ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="w-full sm:w-sm">
                  <Select
                    value={status}
                    onValueChange={(value) => setStatus(value)}
                  >
                    <SelectTrigger className="w-full !h-[40px] border border-merchant-input-border rounded-[8px] text-merchant-text !text-[14px]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>

                    <SelectContent className="rounded-[8px]">
                      <SelectGroup>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <button
                  className="group primary-button primary-button-md w-full sm:w-1/2"
                  onClick={() => {
                    setCurrentPage(1);
                    fetchResTransactionsData();
                  }}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">Search</span>
                </button>
              </div>
            </div>
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
                        transactions.map((transaction, index) => {
                          const { icon, bg } = getUserTransactionIcon(
                            transaction.type
                          );
                          return (
                            <tr className="table-body-tr last:!border-0">
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
      </div>
      {transactions.length > 0 && (
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

export default TransactionHistory;
