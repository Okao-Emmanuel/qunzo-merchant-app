import DashboardWallets from "./DashboardWallets";
import PaymentAnalysis from "./PaymentAnalysis";
import RecentTransaction from "./RecentTransaction";
import TransactionChart from "./TransactionChart";
import UserCard from "./UserCard";

const DashboardLanding = () => {
  return (
    <div className="dashboard-landing grid grid-cols-1 3xl:grid-cols-12 gap-[30px]">
      <div className="col-span-12 3xl:col-span-9 space-y-[30px]">
        <UserCard />
        <TransactionChart />
      </div>
      <div className="col-span-12 3xl:col-span-3 space-y-[30px]">
        <DashboardWallets />
        <PaymentAnalysis />
      </div>
      <div className="col-span-12">
        <RecentTransaction />
      </div>
    </div>
  );
};

export default DashboardLanding;
