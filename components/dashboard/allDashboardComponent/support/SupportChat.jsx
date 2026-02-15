"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const SupportChat = ({ ticketID }) => {
  const network = new NetworkService();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);
  const [loadingCloseMessage, setLoadingCloseMessage] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await network.get(ApiPath.supportChat(ticketID));
      if (res.status === "completed") {
        setMessages(res.data.data);
      }
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  // send message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && attachments.length === 0) {
      toast.error("Please enter a message");
      return;
    }
    const formData = new FormData();
    formData.append("message", newMessage);
    attachments.forEach((file) => {
      formData.append("attachments[]", file.file);
    });
    try {
      setLoadingSendMessage(true);
      const res = await network.postFormData(
        ApiPath.replyChat(ticketID),
        formData
      );
      if (res.status === "completed") {
        setNewMessage("");
        setAttachments([]);
        fetchMessages();
      }
    } finally {
      setLoadingSendMessage(false);
    }
  };

  // handle file upload
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // handle file change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  // remove attachment
  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  // close message
  const handleCloseMessage = async () => {
    setLoadingCloseMessage(true);
    try {
      const res = await network.post(ApiPath.closeSupportTicket(ticketID), {});
      if (res.status === "completed") {
        toast.success("Message closed successfully!");
        setMessages((prev) => ({
          ...prev,
          ticket: {
            ...prev.ticket,
            status: "close",
          },
        }));
        router.push("/dashboard/support-tickets");
      }
    } finally {
    }
  };

  // effects
  useEffect(() => {
    fetchMessages();
  }, []);

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <Link
        href="/dashboard/support-tickets"
        className="text-user-text text-[14px] font-bold flex items-center gap-2 hover:underline hover:text-user-primary transition-all duration-300 ease-in-out mb-3"
      >
        <Icon
          icon="lucide:arrow-left"
          width="20"
          height="20"
          className="w-[20px] h-[20px]"
        />
        Back
      </Link>

      <div className="flex flex-wrap gap-2 justify-between items-center mb-[35px]">
        <h4 className="text-[20px] font-semibold text-merchant-text">
          Support Chat
        </h4>
      </div>

      <div className="bg-white rounded-[8px] border border-[rgba(26,32,44,0.10)]">
        <div className="p-[20px] border-b border-[rgba(26,32,44,0.10)]">
          <div className="flex items-center gap-3 justify-between">
            {loading ? (
              <div className="h-[30px] bg-gray-200 rounded-md w-[10%] animate-pulse"></div>
            ) : (
              <h3 className="text-merchant-text font-bold text-[16px] lg:text-[18px]">
                {messages?.ticket?.title}{" "}
                {messages?.ticket?.uuid && `(${messages?.ticket?.uuid})`}
              </h3>
            )}
            {loading ? (
              <div className="h-[40px] bg-gray-200 rounded-[8px] w-[10%] animate-pulse"></div>
            ) : (
              <div>
                {messages?.ticket?.status === "open" && (
                  <button
                    className="h-[40px] px-[20px] flex items-center justify-center bg-merchant-error rounded-[8px] text-white text-[14px] font-bold cursor-pointer"
                    onClick={handleCloseMessage}
                    disabled={loadingCloseMessage}
                  >
                    {loadingCloseMessage ? "Closing..." : "Close"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col h-[calc(100vh-330px)]">
          {loading ? (
            <div className="h-full flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : messages?.ticket ? (
            <div className="flex-1 p-[20px] space-y-4 overflow-y-auto hide-scrollbar">
              <div className="flex justify-end">
                <div className="flex flex-row-reverse items-center gap-[8px]">
                  <div>
                    <Image
                      src={messages?.ticket?.user?.avatar}
                      width={500}
                      height={500}
                      unoptimized
                      alt="User"
                      className="w-9 h-9 object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-merchant-text text-end">
                      {messages?.ticket?.user?.name}
                    </h3>
                    <p className="text-[14px] font-medium text-merchant-paragraph text-end">
                      {messages?.ticket?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex flex-row-reverse items-start gap-3 w-[90%] lg:w-[40%]">
                  <div className="flex flex-col w-full">
                    <div className="bg-[rgba(76,208,128,0.10)] border border-merchant-primary rounded-tl-[8px] rounded-bl-[8px] rounded-br-[8px] rounded-tr-0 p-[14px]">
                      <p className="text-[rgba(26,32,44,0.60)] text-[16px] font-medium">
                        {messages?.ticket?.message}
                      </p>
                      {messages?.ticket?.attachments?.length > 0 && (
                        <div className="mt-2 mb-2 last-of-type:mb-0">
                          <p
                            className={`text-merchant-text text-[12px] font-bold mb-1`}
                          >
                            Attachments:
                          </p>
                          <div className="flex flex-col gap-1">
                            {messages?.ticket?.attachments?.map(
                              (attachment, index) => (
                                <div>
                                  <a
                                    key={attachment.id}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                    key={index}
                                  >
                                    <Icon
                                      icon="lucide:file"
                                      width="24"
                                      height="24"
                                      className={`text-merchant-primary h-[16px] w-[16px]`}
                                    />
                                    <span
                                      className={`text-[rgba(26,32,44,0.60)] text-xs font-semibold`}
                                    >
                                      {attachment.name}
                                    </span>
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {messages?.messages?.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.is_admin === false ? "justify-end" : "justify-start"
                  } flex`}
                >
                  <div
                    className={`${
                      message.is_admin === false
                        ? "flex-row-reverse"
                        : "flex-row"
                    } flex items-start gap-3 w-[90%] lg:w-[40%] `}
                  >
                    <div className="flex flex-col w-full">
                      <div>
                        {message.is_admin === true ? (
                          <div className="flex items-center mb-[12px] gap-2.5">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                              <Image
                                src={message?.user?.avatar}
                                width={500}
                                height={500}
                                unoptimized
                                alt="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="text-[16px] font-bold text-merchant-text">
                                {message.user.name}
                              </p>
                              <p className="text-[14px] font-medium text-merchant-paragraph">
                                {message.user.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-row-reverse items-center mb-[12px] gap-2.5">
                            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                              <Image
                                src={message?.user?.avatar}
                                width={500}
                                height={500}
                                unoptimized
                                alt="w-full h-full object-cover rounded-full"
                              />
                            </div>

                            <div className="flex flex-col justify-center">
                              <p className="text-[16px] font-bold text-merchant-text text-end">
                                {message.user.name}
                              </p>
                              <p className="text-[14px] font-medium text-merchant-paragraph text-end">
                                {message.user.email}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div
                        className={`${
                          message.is_admin === false
                            ? "bg-[rgba(76,208,128,0.10)] border border-merchant-primary rounded-tl-[8px] rounded-bl-[8px] rounded-br-[8px] rounded-tr-0"
                            : "bg-[#F5F5F5] rounded-tl-0 rounded-bl-[8px] rounded-br-[8px] rounded-tr-[8px]"
                        } p-[14px]`}
                      >
                        <p
                          className={`${
                            message.is_admin === false
                              ? "text-[rgba(26,32,44,0.60)]"
                              : "text-[rgba(26,32,44,0.80)]"
                          } text-[16px] font-medium`}
                        >
                          {message.message}
                        </p>
                        {message.attachments?.length > 0 && (
                          <div className="flex flex-col gap-[4px] mt-2 mb-2 last-of-type:mb-0">
                            <p
                              className={`${
                                message.is_admin === false
                                  ? "text-merchant-text"
                                  : "text-merchant-text"
                              } text-[12px] font-bold`}
                            >
                              Attachments:
                            </p>
                            <div className="flex flex-col gap-1">
                              {message.attachments?.map((attachment, index) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1"
                                  key={index}
                                >
                                  <Icon
                                    icon="lucide:file"
                                    width="24"
                                    height="24"
                                    className={`${
                                      message.is_admin === false
                                        ? "text-merchant-primary"
                                        : "text-merchant-primary"
                                    } h-[16px] w-[16px]`}
                                  />
                                  <span
                                    className={`${
                                      message.is_admin === false
                                        ? "text-merchant-paragraph"
                                        : "text-merchant-paragraph"
                                    } text-xs font-semibold`}
                                  >
                                    {attachment.name}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} className=""></div>
            </div>
          ) : null}
          {messages?.ticket?.status === "open" && (
            <div className="bg-white px-[20px] pb-[20px] pt-1 rounded-b-lg">
              <div className="upload-files pb-3 flex flex-wrap items-center gap-2">
                {attachments.map((item) => (
                  <div
                    key={item.id}
                    className="relative border rounded-[8px] p-2 flex items-center gap-2 mt-2 mr-2"
                  >
                    {item.preview ? (
                      <Image
                        src={item.preview}
                        alt={item.file.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-7.5 h-7.5"
                      />
                    ) : (
                      <span>
                        <Icon
                          icon="lucide:file"
                          width="24"
                          height="24"
                          className="w-7.5 h-7.5 text-merchant-paragraph"
                        />
                      </span>
                    )}
                    <span className="text-xs text-merchant-paragraph truncate max-w-[120px]">
                      {item.file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(item.id)}
                      className="absolute -top-2 -right-2 bg-merchant-error text-white rounded-full p-1"
                    >
                      <Icon
                        icon="lucide:x"
                        width="24"
                        height="24"
                        className="w-2.5 h-2.5"
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-end gap-[14px]">
                <div className="relative w-full">
                  <textarea
                    placeholder="Type your message..."
                    className="w-full h-[100px] px-4 py-3 rounded-[8px] border border-[rgba(26,32,44,0.10)] focus:outline-none focus:ring-1 focus:ring-merchant-primary focus:border-transparent placeholder:text-merchant-paragraph placeholder:text-[14px] placeholder:font-normal"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-[14px]">
                  <div>
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="file-upload-btn cursor-pointer text-merchant-paragraph flex justify-center items-center"
                    >
                      <Icon
                        icon="basil:attach-outline"
                        width="24"
                        height="24"
                      />
                    </button>
                    <input
                      type="file"
                      multiple
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    className="h-[40px] items-center justify-center px-[30px] rounded-[8px] bg-merchant-primary text-white text-[16px] font-bold"
                    onClick={handleSendMessage}
                    disabled={loadingSendMessage}
                  >
                    {loadingSendMessage ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
