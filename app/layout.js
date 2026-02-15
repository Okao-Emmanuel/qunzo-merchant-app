import { RegisterInfoProvider } from "@/context/RegisterInfoContext";
import { SettingsProvider } from "@/context/settingsContext";
import { UserProvider } from "@/context/UserContext";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  title: "Qunzo Merchant",
  description: "Empower Your Financial Journey with Qunzo",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable}`}>
      <body className={plusJakartaSans.className}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <SettingsProvider>
          <UserProvider>
            <RegisterInfoProvider>{children}</RegisterInfoProvider>
          </UserProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
