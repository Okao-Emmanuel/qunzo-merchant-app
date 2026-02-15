"use client";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const WithdrawAccount = () => {
  const network = new NetworkService();
  const [withdrawAllAccountData, setWithdrawAllAccountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  // Fetch withdraw account data
  const withdrawAllAccountDataGet = async (keyword = searchQuery) => {
    setLoading(true);
    try {
      const res = await network.get(ApiPath.withdrawAccount, {
        keyword: keyword,
      });
      if (res.status === "completed") {
        setWithdrawAllAccountData(res.data.data);
      }
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    withdrawAllAccountDataGet(searchQuery);
  };

  // Handle enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    try {
      const res = await network.delete(ApiPath.withdrawAccountID(id));
      if (res.status === "completed") {
        toast.success("Withdraw account deleted successfully!");
        withdrawAllAccountDataGet();
      }
    } finally {
    }
  };

  // Initial data fetch
  useEffect(() => {
    withdrawAllAccountDataGet();
  }, []);

  return (
    <>
      <div>
        <div className="mb-[30px]">
          <h4 className="text-[20px] font-bold text-merchant-text">
            Withdraw Account
          </h4>
        </div>
        <div className="border border-[rgba(26,32,44,0.10)] p-[20px] rounded-[8px]">
          <div className="filter flex flex-wrap justify-between items-center gap-[16px] mb-[30px]">
            <div className="w-full sm:w-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="text"
                  className="user-input user-input-4 !border"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                href="/dashboard/withdraw/withdraw-account/add-withdraw-account"
                className="primary-button-3"
              >
                Add Withdraw Account
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
                        <th className="table-th">SL No</th>
                        <th className="table-th">Account</th>
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
                        withdrawAllAccountData?.accounts?.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-[40px] text-center">
                            <NoDataFound message="No Withdraw Account Found" />
                          </td>
                        </tr>
                      ) : (
                        withdrawAllAccountData?.accounts?.map((item, index) => {
                          return (
                            <tr className="table-body-tr last:!border-0">
                              <td className="table-td">
                                <span className="text-[13px] text-merchant-paragraph font-semibold">
                                  {index + 1}
                                </span>
                              </td>
                              <td className="table-td">
                                <span className="text-[13px] text-merchant-text font-semibold">
                                  {item.method_name}
                                </span>
                              </td>
                              <td className="table-td">
                                <div className="flex items-center gap-[18px]">
                                  <Link
                                    href={`/dashboard/withdraw/withdraw-account/${item.id}/edit-withdraw-account`}
                                    className="flex justify-center items-center w-[26px] h-[26px] border border-merchant-primary rounded-[4px] bg-[rgba(76,208,128,0.20)]"
                                  >
                                    <Tooltip>
                                      <TooltipTrigger className="cursor-pointer">
                                        <Icon
                                          icon="basil:edit-outline"
                                          width="18"
                                          height="18"
                                          className="text-merchant-text"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Edit Account</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </Link>
                                  <button
                                    className="flex justify-center items-center w-[26px] h-[26px] border border-merchant-error rounded-[4px] bg-[rgba(220,60,34,0.10)]"
                                    onClick={() => {
                                      setShowDeleteModal(true);
                                      setDeleteId(item.id);
                                    }}
                                  >
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-pointer">
                                          <Icon
                                            icon="basil:trash-outline"
                                            width="18"
                                            height="18"
                                            className="text-merchant-error"
                                          />
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delete Account</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </button>
                                </div>
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
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete!"
        footer={
          <>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="group primary-button primary-border primary-button-md w-full"
            >
              <span className="primary-button-hover-effect"></span>
              <span className="primary-button-text">Cancel</span>
            </button>
            <button
              onClick={() => {
                handleDelete(deleteId);
                setShowDeleteModal(false);
              }}
              className="group primary-button primary-button-md error-color-btn w-full"
            >
              <span className="primary-button-hover-effect error-button-hover-effect"></span>
              <span className="primary-button-text">Delete</span>
            </button>
          </>
        }
      >
        <p className="text-center">
          Are you sure you want to delete this Account?
        </p>
      </DeleteConfirmationModal>
    </>
  );
};

export default WithdrawAccount;
