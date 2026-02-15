"use client";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { File, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const SupportTicketCreate = () => {
  const network = new NetworkService();
  const [attachments, setAttachments] = useState([null]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRefs = useRef([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // add new attachment slot
  const addNewAttachmentSlot = () => {
    setAttachments((prev) => [...prev, null]);
  };

  // handle file change
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setAttachments((prev) =>
        prev.map((item, i) => (i === index ? file : item))
      );
    }
  };

  // remove file
  const removeFile = (index) => {
    if (attachments.length === 1) return;
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // handle submit
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", description);
    attachments.forEach((file) => {
      if (file) formData.append("attachments[]", file);
    });
    try {
      setLoading(true);
      const res = await network.postFormData(
        ApiPath.createSupportTicket,
        formData
      );
      if (res.status === "completed") {
        toast.success("Ticket created successfully!");
        setTitle("");
        setDescription("");
        setAttachments([null]);
        router.push(
          `/dashboard/support-tickets/${res.data.data.uuid}/support-chat`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-between items-center mb-[35px]">
        <h4 className="text-[20px] font-semibold text-merchant-text">
          Create New Tickets
        </h4>
      </div>
      <div className="bg-white rounded-[8px] p-[30px] border border-[rgba(26,32,44,0.16)]">
        <div className="max-w-[514px] mx-auto border border-[rgba(26,32,44,0.16)] p-[20px] rounded-[8px]">
          <h5 className="text-[18px] font-bold text-merchant-text mb-[30px]">
            Create New Ticket
          </h5>
          <div>
            <div className="space-y-6">
              {/* <div>
                <input
                  type="text"
                  className="user-input"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div> */}

              <div className="relative">
                <input
                  type="text"
                  id="title"
                  className={`user-input peer`}
                  placeholder=" "
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label
                  htmlFor="title"
                  className="user-label absolute -translate-y-4 scale-75 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4  start-[16px]"
                >
                  Title <span className="text-merchant-error">*</span>
                </label>
              </div>

              <div className="relative">
                <textarea
                  rows={5}
                  id="description"
                  className="user-textarea-floating peer"
                  placeholder=" "
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label
                  htmlFor="description"
                  className="user-label absolute -translate-y-4 scale-75 top-4 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[12px] peer-placeholder-shown:-translate-y-0 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                >
                  Description <span className="text-merchant-error">*</span>
                </label>
              </div>

              <div>
                <div className="flex items-end justify-end mb-4">
                  <div>
                    <button
                      type="button"
                      onClick={addNewAttachmentSlot}
                      className="h-[30px] flex items-center justify-center gap-2 bg-merchant-primary text-white rounded-[8px] px-[14px] text-[14px] font-semibold"
                    >
                      Add Attach
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="h-[140px] relative border-2 border-dashed border-merchant-input-border rounded-[8px] cursor-pointer flex items-center justify-center"
                    >
                      <div className="flex items-center gap-3">
                        {file ? (
                          <div className="relative w-[100px] h-[100px]">
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover rounded-md border"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-merchant-paragraph rounded-md border">
                                <File className="w-10 h-10 text-merchant-paragraph" />
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                setAttachments((prev) =>
                                  prev.map((item, i) =>
                                    i === index ? null : item
                                  )
                                )
                              }
                              className="absolute top-1 right-1 bg-merchant-error rounded-full p-1 shadow-md text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRefs.current[index].click()}
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Upload className="w-[17px] h-[17px] text-merchant-paragraph" />
                            <span className="text-merchant-paragraph text-[12px] font-bold">
                              Upload file
                            </span>
                          </div>
                        )}
                      </div>

                      <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        className="hidden"
                        onChange={(e) => handleFileChange(e, index)}
                      />

                      {attachments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-merchant-error absolute top-3 right-3"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-7">
              <Link
                href="/dashboard/support-tickets"
                className="group primary-button secondary-color-btn w-full"
              >
                <span className="primary-button-hover-effect secondary-button-hover-effect"></span>
                <span className="primary-button-text">Back</span>
              </Link>
              <button
                className="group primary-button w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                <span className="primary-button-hover-effect"></span>
                <span className="primary-button-text">
                  {loading ? "Adding..." : "Add Ticket"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketCreate;
