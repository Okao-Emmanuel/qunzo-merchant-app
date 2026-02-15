"use client";
import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import Link from "next/link";
import { useEffect, useState } from "react";

const KycHistory = () => {
  const network = new NetworkService();
  const [kycHistory, setKycHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchKycHistory = async () => {
    try {
      setLoading(true);
      const res = await network.get(ApiPath.kycHistory);
      setKycHistory(res.data.data);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    fetchKycHistory();
  }, []);

  return (
    <>
      <div>
        <div className="mb-[30px]">
          <h4 className="text-[20px] font-bold text-merchant-text">
            Kyc History
          </h4>
        </div>
        <div className="border border-[rgba(26,32,44,0.10)] p-[20px] rounded-[8px]">
          <div className="bg-white rounded-[8px]">
            <div className="max-w-full overflow-x-auto">
              <div className="common-table min-w-[1020px]">
                <div className="full-table">
                  <table className="w-full whitespace-nowrap">
                    <thead className="table-head">
                      <tr className="table-head-tr">
                        <th className="table-th">Type</th>
                        <th className="table-th">Admin Message</th>
                        <th className="table-th">Status</th>
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
                      ) : hasFetched && kycHistory?.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-[40px] text-center">
                            <NoDataFound message="No KYC Data Found" />
                          </td>
                        </tr>
                      ) : (
                        <>
                          {kycHistory?.map((item) => (
                            <tr
                              className="table-body-tr last:!border-0"
                              key={item?.id}
                            >
                              <td className="table-td">
                                <span className="text-[13px] text-merchant-paragraph font-semibold">
                                  {item?.type}
                                </span>
                              </td>
                              <td className="table-td">
                                <span className="text-[13px] text-merchant-paragraph font-semibold">
                                  {item?.message}
                                </span>
                              </td>
                              <td className="table-td">
                                <Badge status={item?.status} />
                              </td>
                              <td className="table-td">
                                <Link
                                  href={`/dashboard/settings/kyc-history/${item?.id}/kyc-details`}
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
    </>
  );
};

export default KycHistory;
