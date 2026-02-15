// import your icons
import CreditIcon from "@/assets/dashboard/transaction-icon/credit-icon.svg";
import debitIcon from "@/assets/dashboard/transaction-icon/debit-icon.svg";
import exchangeIcon from "@/assets/dashboard/transaction-icon/exchnage-icon.svg";
import invoiceIcon from "@/assets/dashboard/transaction-icon/invoice-icon.svg";
import manualDepositIcon from "@/assets/dashboard/transaction-icon/manual-deposit-icon.svg";
import paymentIcon from "@/assets/dashboard/transaction-icon/payment-icon.svg";
import refundIcon from "@/assets/dashboard/transaction-icon/refund-icon.svg";
import signUpBonusIcon from "@/assets/dashboard/transaction-icon/sign-up-bonus-icon.svg";
import withdrawAutoIcon from "@/assets/dashboard/transaction-icon/withdraw-auto.svg";
import withdrawIcon from "@/assets/dashboard/transaction-icon/withdraw-icon.svg";

import merchantPaymentIcon from "@/assets/dashboard/notification-icon/merchant_payment.svg";
import merchantTicketReplyIcon from "@/assets/dashboard/notification-icon/merchant_ticket_reply.svg";
import merchantWithdrawApprovedIcon from "@/assets/dashboard/notification-icon/merchant_withdraw_approved.svg";
import merchantWithdrawRejectedIcon from "@/assets/dashboard/notification-icon/merchant_withdraw_rejected.svg";

export function formatTitle(path) {
  if (!path) return "Dashboard";

  const parts = path.split("/").filter(Boolean);
  const lastSegment = parts[parts.length - 1];

  if (lastSegment === "dashboard") return "Dashboard";

  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// calculate min and max amount helper function
export const dynamicDecimals = ({
  currencyCode,
  siteCurrencyCode,
  siteCurrencyDecimals,
  isCrypto,
}) => {
  const dynamicCurrency = currencyCode === siteCurrencyCode;
  // console.log("dynamicCurrency", dynamicCurrency);

  if (dynamicCurrency) {
    // console.log("siteCurrencyDecimals", siteCurrencyDecimals);
    return siteCurrencyDecimals;
  } else {
    // console.log("isCrypto", isCrypto);
    return isCrypto ? 8 : 2;
  }
};

// calculate charge helper function
export const calculateCharge = (gatewayMethod, siteCurrency) => {
  if (!gatewayMethod) return { mainCharge: "", displayChargeType: "" };

  const gatewayCurrency = gatewayMethod?.currency;
  const gatewayCharge = gatewayMethod?.charge;
  const currencyType = gatewayMethod?.currency_type;
  const chargeType = gatewayMethod?.charge_type;

  let mainCharge = "";

  if (
    siteCurrency?.trim().toUpperCase() === gatewayCurrency?.trim().toUpperCase()
  ) {
    mainCharge = Number(gatewayCharge).toFixed(2);
  } else if (currencyType?.toLowerCase() === "crypto") {
    mainCharge = Number(gatewayCharge).toFixed(8);
  } else {
    mainCharge = Number(gatewayCharge).toFixed(2);
  }

  let displayChargeType = chargeType === "percentage" ? "%" : gatewayCurrency;

  return { mainCharge, displayChargeType };
};

// calculate min and max amount helper function
export const calculateMinMaxAmount = (gatewayMethod, siteCurrency) => {
  if (!gatewayMethod) return { minAmount: "", maxAmount: "" };

  const gatewayCurrency = gatewayMethod?.currency;
  const gatewayMinCurrency = gatewayMethod?.minimum_deposit;
  const gatewayMaxCurrency = gatewayMethod?.maximum_deposit;
  const currencyType = gatewayMethod?.currency_type;

  let minAmount = "";
  let maxAmount = "";

  if (
    siteCurrency?.trim().toUpperCase() === gatewayCurrency?.trim().toUpperCase()
  ) {
    minAmount = Number(gatewayMinCurrency).toFixed(2);
    maxAmount = Number(gatewayMaxCurrency).toFixed(2);
  } else if (currencyType?.toLowerCase() === "crypto") {
    minAmount = Number(gatewayMinCurrency).toFixed(8);
    maxAmount = Number(gatewayMaxCurrency).toFixed(8);
  } else {
    minAmount = Number(gatewayMinCurrency).toFixed(2);
    maxAmount = Number(gatewayMaxCurrency).toFixed(2);
  }

  return { minAmount, maxAmount };
};

// get settings value
export const getSettingValue = (settings, key) => {
  if (!settings?.data) return null;
  const found = settings.data.find((item) => item.name === key);
  return found ? found.value : null;
};

//get field status
export const getFieldStatus = (fields, key) => {
  if (!Array.isArray(fields)) return false;
  const found = fields.find((item) => item.key === key);
  return found?.value === "1";
};

//formate date created at
export function CreatedAtFormatDate({ createdAt }) {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  if (isNaN(date)) return null;

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formatted = new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", "");

  return <span>{formatted}</span>;
}

//formate local date
export const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// notification styles based on type
export const notificationStyles = {
  merchant_payment: {
    icon: merchantPaymentIcon,
    bg: "rgba(116,69,255,0.10)",
  },
  merchant_ticket_reply: {
    icon: merchantTicketReplyIcon,
    bg: "#E2F5FF",
  },
  withdraw_approved: {
    icon: merchantWithdrawApprovedIcon,
    bg: "#FFDBFC",
  },
  withdraw_rejected: {
    icon: merchantWithdrawRejectedIcon,
    bg: "#FFE4E4",
  },
  kyc_action: {
    icon: CreditIcon,
    bg: "#FFE4E4",
  },
  default: {
    icon: merchantWithdrawApprovedIcon,
    bg: "#FFE4E4",
  },
};

// get user transaction icon
export const getUserTransactionIcon = (type) => {
  switch (type) {
    case "Payment":
      return {
        icon: paymentIcon,
        bg: "bg-[#D5E3FF]",
      };
    case "Credit":
      return {
        icon: CreditIcon,
        bg: "bg-[#FFD5F8]",
      };
    case "Exchange":
      return {
        icon: exchangeIcon,
        bg: "bg-[#FFD5F8]",
      };
    case "Invoice":
      return {
        icon: invoiceIcon,
        bg: "bg-[#FFE5D5]",
      };
    case "Debit":
      return {
        icon: debitIcon,
        bg: "bg-[#E0D5FF]",
      };
    case "Signup Bonus":
      return {
        icon: signUpBonusIcon,
        bg: "bg-[#FFE5D5]",
      };
    case "Withdraw":
      return {
        icon: withdrawIcon,
        bg: "bg-[#E0D5FF]",
      };
    case "Withdraw Auto":
      return {
        icon: withdrawAutoIcon,
        bg: "bg-[#FFD5F8]",
      };
    case "Deposit":
      return {
        icon: manualDepositIcon,
        bg: "bg-[#D5FFF5]",
      };
    case "Manual Deposit":
      return {
        icon: manualDepositIcon,
        bg: "bg-[#FFF1D5]",
      };
    case "Refund":
      return {
        icon: refundIcon,
        bg: "bg-[#FFDED5]",
      };
    default:
      return {
        icon: paymentIcon,
        bg: "bg-[#FFF1D5]",
      };
  }
};
