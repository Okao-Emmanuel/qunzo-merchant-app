const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

const ApiPath = {
  baseURL,

  //global path
  setting: (settingsKey) => `/get-settings?key=${settingsKey}`,
  allSettings: `/get-settings`,
  allCurrency: `/get-currencies`,
  allCountry: `/get-countries`,
  currencyConvert: (charge, walletCode) =>
    `/convert/${charge}/${walletCode}/true`,
  registerFieldsValidation: `/get-register-fields/merchant`,

  //authentication path
  login: `/auth/merchant/login`,
  logout: `/auth/merchant/logout`,
  register: `/auth/merchant/register`,
  emailVerify: `/auth/merchant/send-verify-email`,
  verificationValidate: `/auth/merchant/validate-verify-email`,
  user: `/auth/merchant/profile`,
  forgetPassword: `/auth/merchant/forgot-password`,
  resetVerifyOtp: `/auth/merchant/reset-verify-otp`,
  userProfile: `/merchant/settings/profile`,
  changePassword: `/merchant/settings/change-password`,
  updatePersonalInfo: `/auth/merchant/personal-info-update`,
  documentTypes: `/merchant/kyc`,
  idVerification: `/merchant/kyc`,
  kycHistory: `/merchant/kyc/history`,
  qrCodeGenerate: `/merchant/settings/2fa/generate`,
  enable2FA: `/merchant/settings/2fa/enable`,
  disable2FA: `/merchant/settings/2fa/disable`,
  twoFaVerification: `/auth/merchant/2fa/verify`,

  //dashboard path
  dashboard: `/dashboard`,
  notifications: `/get-notifications`,
  markAsReadNotification: `/mark-as-read-notification`,
  wallets: `/merchant/wallets`,
  deleteWallet: (walletId) => `/merchant/wallets/${walletId}`,
  transactions: `/merchant/transactions`,
  transactionChart: `/merchant/activity-chart`,
  paymentAnalysis: `merchant/circle-chart`,
  qrCode: `/merchant/qrcode`,
  apiKeys: `/merchant/access-keys`,
  generateApiKey: `/merchant/access-keys/regenerate`,
  withdrawAccount: `/merchant/withdraw-accounts`,
  withdraw: `/merchant/withdraw`,
  withdrawAccountID: (accountId) => `/merchant/withdraw-accounts/${accountId}`,
  withdraw: `/merchant/withdraw`,
  withdrawMethods: `/merchant/withdraw-accounts/methods/list`,
  supportTicket: `/merchant/ticket`,
  supportChat: (chatId) => `/merchant/ticket/${chatId}`,
  replyChat: (chatId) => `/merchant/ticket/reply/${chatId}`,
  closeSupportTicket: (chatId) => `/merchant/ticket/action/${chatId}`,
  createSupportTicket: `/merchant/ticket`,
};

export default ApiPath;
