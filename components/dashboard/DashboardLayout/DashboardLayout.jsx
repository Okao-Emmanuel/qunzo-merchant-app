"use client";
import { useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import DashboardSidebar from "../DashboardSidebar/DashboardSidebar";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col ml-0 lg:ml-[288px]">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-[30px]">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
