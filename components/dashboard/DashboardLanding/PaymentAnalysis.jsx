"use client";
import line from "@/assets/dashboard/user/user-line.png";
import NoDataFound from "@/components/common/NoDataFound";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import Image from "next/image";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const PaymentAnalysis = () => {
  const network = new NetworkService();
  const [chartData, setChartData] = useState({
    labels: [],
    series: [],
  });

  const [selectedDate, setSelectedDate] = useState("seven_days");

  const fetchPaymentAnalysis = async () => {
    try {
      const res = await network.get(ApiPath.paymentAnalysis, {
        date: selectedDate,
      });
      if (res.data.status === "success") {
        setChartData(res.data.data.data);
      }
    } finally {
    }
  };

  useEffect(() => {
    fetchPaymentAnalysis();
  }, [selectedDate]);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: chartData.labels,
    colors: ["#14AE6F", "#FF9500"],

    legend: {
      position: "right",
      verticalAlign: "center",
      fontSize: "14px",
      labels: {
        colors: "#000",
      },
      markers: {
        radius: 6,
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 0,
    },

    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      position: "bottom",
    },

    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-[8px] p-[20px] border border-[rgba(26,32,44,0.16)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-[18px] font-bold text-agent-text">
          Payment Analysis
        </h4>

        <select
          className="h-[32px] px-[12px] border border-[rgba(12,3,16,0.16)] rounded-[5px] text-[13px]"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="seven_days">Last 7 Days</option>
          <option value="thirty_days">Last 1 Month</option>
          <option value="last_year">Last 1 Year</option>
        </select>
      </div>

      <div className="line my-[16px]">
        <Image
          src={line}
          alt="line"
          width={100}
          height={100}
          className="w-full h-[2px]"
        />
      </div>

      <div className="w-[250px] 4xl:w-[300px] mx-auto">
        {chartData?.series?.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartData.series}
            type="donut"
            width="100%"
            className="w-full"
          />
        ) : (
          <div className="py-8">
            <NoDataFound message="No analysis data found" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentAnalysis;
