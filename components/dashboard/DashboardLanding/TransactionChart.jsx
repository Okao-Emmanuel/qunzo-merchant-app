"use client";

import line from "@/assets/dashboard/user/user-line.png";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const TransactionChart = () => {
  const network = new NetworkService();
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("default");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({});

  // Fetch chart data
  const fetchTransactionChart = async () => {
    try {
      setLoading(true);
      const res = await network.get(ApiPath.transactionChart, {
        wallet_id: selectedWallet === "default" ? null : selectedWallet,
        month,
        year,
      });

      if (res.status === "success" || res.status === "completed") {
        setChartData(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWallets = async () => {
    try {
      const res = await network.get(ApiPath.wallets);
      if (res.status === "completed") {
        setWallets(res.data.data.wallets);
      }
    } catch (err) {
      console.error("Wallet fetch error:", err);
    }
  };

  useEffect(() => {
    fetchWallets();
    fetchTransactionChart();
  }, []);

  useEffect(() => {
    fetchTransactionChart();
  }, [selectedWallet, month, year]);

  const extractValues = (obj) => (!obj ? [] : Object.values(obj));
  const categories = chartData?.withdraw ? Object.keys(chartData.withdraw) : [];

  const series = [
    {
      name: "Payment",
      data: extractValues(chartData.payment),
    },
    {
      name: "Withdraw",
      data: extractValues(chartData.withdraw),
    },
  ];

  // Chart options
  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    stroke: {
      width: 3,
      curve: "smooth",
    },

    colors: ["#2D6CDF", "#FFC24C"],

    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#0C0310",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      labels: {
        formatter: (val) => `${val} USD`,
        style: {
          colors: "#0C0310",
          fontSize: "12px",
        },
      },
    },

    grid: {
      borderColor: "#F3F2F7",
      strokeDashArray: 6,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: true } },
    },

    tooltip: {
      custom: function ({ series, dataPointIndex }) {
        const labels = ["Payment", "Withdraw"];
        const colors = ["#2D6CDF", "#FFC24C"];

        return `
          <div style="
            background: #fff;
            padding: 10px 12px;
            font-size: 12px;
            font-weight: 600;
            color: #000;
            box-shadow: 0px 3px 10px rgba(0,0,0,0.15);
          ">
            ${labels
              .map(
                (label, i) => `
                <div style="display:flex; align-items:center; margin-bottom:4px;">
                  <span style="
                    width:8px; 
                    height:8px; 
                    border-radius:50%; 
                    background:${colors[i]};
                    margin-right:6px;
                  "></span>
                  ${label}: ${series[i]?.[dataPointIndex] || 0} USD
                </div>
              `
              )
              .join("")}
          </div>
        `;
      },
    },

    markers: {
      size: 6,
      strokeWidth: 3,
      strokeColors: "#fff",
      hover: { size: 8 },
    },

    legend: {
      show: true,
      horizontalAlign: "left",
      position: "top",
    },
  };

  return (
    <div className="bg-white rounded-[8px] p-[20px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-lg font-bold text-user-text">Transaction Report</h1>
        <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
          <select
            className="h-[32px] px-[12px] border border-[rgba(12,3,16,0.16)] rounded-[20px] text-[13px]"
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
          >
            {wallets.map((wallet) => (
              <option
                key={wallet.id}
                value={wallet.is_default ? "default" : wallet.id}
              >
                {wallet.name}
              </option>
            ))}
          </select>
          <select
            className="h-[32px] px-[12px] border border-[rgba(12,3,16,0.16)] rounded-[20px] text-[13px]"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            className="h-[32px] px-[12px] border border-[rgba(12,3,16,0.16)] rounded-[20px] text-[13px]"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2022, 2023, 2024, 2025].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="line my-[16px]">
        <Image src={line} alt="line" className="w-full h-[2px]" />
      </div>

      <div className="h-[300px] xl:h-[490px]">
        <ReactApexChart
          options={options}
          series={series}
          height="100%"
          type="line"
        />
      </div>
    </div>
  );
};

export default TransactionChart;
