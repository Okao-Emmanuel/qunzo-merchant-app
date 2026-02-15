"use client";

import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditWithdrawAccount = ({ withdrawId }) => {
  const network = new NetworkService();
  const [withdrawAllAccountData, setWithdrawAllAccountData] = useState([]);
  const [manualFields, setManualFields] = useState({});
  const [methodName, setMethodName] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accountGetLoading, setAccountGetLoading] = useState(false);

  // Fetch withdraw accounts
  const withdrawAllAccountDataGet = async () => {
    setAccountGetLoading(true);
    try {
      const res = await network.get(ApiPath.withdrawAccount);
      if (res.status === "completed") {
        setWithdrawAllAccountData(res.data.data);
      }
    } finally {
      setAccountGetLoading(false);
    }
  };

  const selectedAccount = withdrawAllAccountData?.accounts?.find(
    (a) => a.id === Number(withdrawId)
  );

  // Initialize form fields when data is ready
  useEffect(() => {
    if (selectedAccount?.method?.fields) {
      const initialManualFields = {};

      selectedAccount.method.fields.forEach((field) => {
        if (field.type === "file") {
          if (field.value) {
            const fileUrl = field.value;
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
            initialManualFields[field.name] = {
              file: null,
              preview: fileUrl,
              name: fileUrl.split("/").pop(),
              isImage,
            };
          } else {
            initialManualFields[field.name] = null;
          }
        } else {
          initialManualFields[field.name] = field.value || "";
        }
      });

      setManualFields(initialManualFields);
      if (selectedAccount?.method_name) {
        setMethodName(selectedAccount.method_name);
      }
    }
  }, [selectedAccount]);

  // Handle manual normal input or textarea
  const handleChange = (e, field) => {
    setManualFields((prev) => ({
      ...prev,
      [field.name]: e.target.value,
    }));
  };

  // Handle file input
  const handleManualFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const preview = isImage ? URL.createObjectURL(file) : null;
      setManualFields((prev) => ({
        ...prev,
        [fieldName]: { file, preview, name: file.name, isImage },
      }));
    }
  };

  // Handle removing file data
  const handleRemoveFile = (fieldName) => {
    setManualFields((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("method_name", methodName);
    data.append("_method", "put");

    selectedAccount?.method?.fields?.forEach((field) => {
      const fieldValue = manualFields[field.name];
      data.append(`credentials[${field.name}][type]`, field.type);
      data.append(
        `credentials[${field.name}][validation]`,
        field.validation || ""
      );

      if (field.type === "file") {
        if (fieldValue?.file instanceof File) {
          data.append(`credentials[${field.name}][value]`, fieldValue.file);
        } else if (fieldValue?.preview && !fieldValue?.file) {
          data.append(`credentials[${field.name}][value]`, fieldValue.preview);
        } else {
          data.append(`credentials[${field.name}][value]`, "");
        }
      } else {
        data.append(`credentials[${field.name}][value]`, fieldValue || "");
      }
    });

    try {
      setLoading(true);
      const res = await network.postFormData(
        ApiPath.withdrawAccountID(withdrawId),
        data
      );
      if (res.status === "completed") {
        toast.success("Withdraw account updated successfully!");
        await withdrawAllAccountDataGet();
        router.push("/dashboard/withdraw/withdraw-account");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    withdrawAllAccountDataGet();
  }, []);

  const SkeletonCard = () => {
    return (
      <div className="p-6 bg-white border border-[rgba(26,32,44,0.16)] rounded-[8px] animate-pulse">
        <div className="h-7 bg-gray-300 rounded w-48 mb-6"></div>
        <div className="border border-[rgba(26,32,44,0.16)] rounded-[8px] p-6 max-w-[514px] mx-auto space-y-6">
          <div className="h-6 bg-gray-300 rounded w-40"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
          <div className="flex gap-3">
            <div className="h-12 bg-gray-300 w-full rounded"></div>
            <div className="h-12 bg-gray-300 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-[35px]">
        <h4 className="text-[24px] font-semibold text-merchant-text">
          Edit Withdraw Account
        </h4>
      </div>
      {accountGetLoading ? (
        <SkeletonCard />
      ) : (
        <div className="bg-white border border-[rgba(26,32,44,0.16)] rounded-[8px] p-[20px] sm:p-[30px]">
          <div className="max-w-[514px] mx-auto border border-[rgba(26,32,44,0.16)] p-[20px] rounded-[8px]">
            <h5 className="text-[18px] font-bold text-merchant-text mb-[30px]">
              Edit Withdraw Account
            </h5>
            <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-7">
              <div className="col-span-12">
                <label className="user-label">
                  Method Name <span className="text-merchant-error">*</span>
                </label>
                <input
                  type="text"
                  className="user-input mt-1"
                  value={methodName}
                  onChange={(e) => setMethodName(e.target.value)}
                />
              </div>

              {selectedAccount?.method?.fields?.map((field, index) => (
                <div key={field.name} className="col-span-12">
                  <label className="user-label">
                    {field.name}{" "}
                    {field.validation === "required" && (
                      <span className="text-merchant-error">*</span>
                    )}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={manualFields[field.name] || ""}
                      onChange={(e) => handleChange(e, field)}
                      className="user-textarea mt-1"
                    />
                  ) : field.type === "file" ? (
                    <div
                      onClick={() =>
                        document.getElementById(`manual-file-${index}`).click()
                      }
                      className="h-[140px] relative border-2 border-dashed border-merchant-input-border rounded-[8px] cursor-pointer flex items-center justify-center mt-1"
                    >
                      <input
                        id={`manual-file-${index}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleManualFileChange(e, field.name)}
                      />

                      {!manualFields[field.name] ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Icon
                            icon="lucide:upload"
                            width="24"
                            height="24"
                            className="text-merchant-paragraph mb-[7px]"
                          />
                          <p className="text-merchant-paragraph font-semibold text-[14px]">
                            Upload Your File
                          </p>
                        </div>
                      ) : (
                        <>
                          {manualFields[field.name].isImage ? (
                            <img
                              src={manualFields[field.name].preview}
                              alt={field.name}
                              className="w-full h-full object-contain p-1.5"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full p-4">
                              <p className="text-merchant-paragraph font-semibold text-[14px]">
                                {manualFields[field.name].name}
                              </p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(field.name);
                            }}
                            className="absolute top-2 right-2 bg-merchant-error rounded-full p-1 shadow"
                          >
                            <Icon
                              icon="lucide:x"
                              width="18"
                              height="18"
                              className="text-white"
                            />
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={manualFields[field.name] || ""}
                      onChange={(e) => handleChange(e, field)}
                      className="user-input mt-1"
                    />
                  )}
                </div>
              ))}
              <div className="col-span-12">
                <div className="flex justify-between gap-3">
                  <Link
                    href="/dashboard/withdraw/withdraw-account"
                    className="group primary-button secondary-color-btn w-full"
                  >
                    <span className="primary-button-hover-effect secondary-button-hover-effect"></span>
                    <span className="primary-button-text">Back</span>
                  </Link>
                  <button
                    className="group primary-button w-full"
                    type="submit"
                    disabled={loading}
                  >
                    <span className="primary-button-hover-effect"></span>
                    <span className="primary-button-text">
                      {loading ? "Updating..." : "Update"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditWithdrawAccount;
