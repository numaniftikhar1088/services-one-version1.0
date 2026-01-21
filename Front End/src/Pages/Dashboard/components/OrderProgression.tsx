import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { LineChartData, MonthlyCounts } from "../dashboard.types";
import useLang from "Shared/hooks/useLanguage";

const OrderProgression = ({
  lineChartData,
  monthlyCounts,
}: {
  lineChartData: LineChartData[];
  monthlyCounts: MonthlyCounts;
}) => {
  const { t } = useLang();
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    const months = Array.from(
      new Set(lineChartData.map((item) => `${item.monthSpix} ${item.year}`))
    ).sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      const monthNumberA = lineChartData.find(
        (item) => `${item.monthSpix} ${item.year}` === a
      )!.monthNumber;
      const monthNumberB = lineChartData.find(
        (item) => `${item.monthSpix} ${item.year}` === b
      )!.monthNumber;
      return parseInt(yearA) - parseInt(yearB) || monthNumberA - monthNumberB;
    });

    const groupedData: Record<string, number[]> = {};
    lineChartData.forEach((item) => {
      const label = `${item.monthSpix} ${item.year}`;
      if (!groupedData[item.requisitionType]) {
        groupedData[item.requisitionType] = new Array(months.length).fill(0);
      }
      const monthIndex = months.indexOf(label);
      groupedData[item.requisitionType][monthIndex] += item.requisitionCount;
    });

    const series = Object.keys(groupedData).map((key) => ({
      name: key,
      data: groupedData[key],
    }));

    setChartOptions({
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: months, // Updated with month and year
      },
      yaxis: {
        title: {
          text: t("Number of Requisitions"),
        },
      },
    });

    setChartSeries(series as any);
  }, [lineChartData]);

  return (
    // <div className="mt-4">
    //   <div className="card shadow-sm" style={{ borderRadius: "12px" }}>
    //     <div className="mb-2 p-4">
    //       <h5 className="card-title">{t("Order Progression In Period")}</h5>
    //       <Divider />
    //     </div>
    //     <div className="row">
    //       {/* Left Section */}
    //       <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
    //         <h6>{t("Total Order")}</h6>
    //         <div
    //           className="card border-0 text-center p-3"
    //           style={{ backgroundColor: "#eeeeee", borderRadius: "5px" }}
    //         >
    //           <h2 className="fw-bold">
    //             {monthlyCounts.currentMonthCount} / MONTH
    //           </h2>
    //           <hr style={{ margin: 0 }} />
    //           <p className="fw-bold m-0 p-5">
    //             You are tracking at{" "}
    //             <p style={{ fontSize: "18px", margin: 0 }}>
    //               {monthlyCounts.percentage} {monthlyCounts.percentageLabel}
    //             </p>
    //           </p>
    //           <hr style={{ margin: 0 }} />
    //           <h2 className="fw-bold mt-5">
    //             {monthlyCounts.previousMonthCount} / Previous Month
    //           </h2>
    //         </div>
    //       </div>
    //       {/* Right Section */}
    //       <div className="col-md-8">
    //         <ReactApexChart
    //           options={chartOptions}
    //           series={chartSeries}
    //           type="area"
    //           height={300}
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="mt-4">
      <div className="card shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="mb-2 p-4">
          <h5 className="card-title">{t("Order Progression In Period")}</h5>
          <Divider />
        </div>
        <div className="row">
          <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
            <h6>{t("Total Order")}</h6>
            <div
              className="card border-0 text-center p-3"
              style={{ backgroundColor: "#eeeeee", borderRadius: "5px" }}
            >
              <h2 className="fw-bold">
                {monthlyCounts.currentMonthCount} / {t("Month")}
              </h2>
              <hr style={{ margin: 0 }} />
              <p className="fw-bold m-0 p-5">
                {t("You are tracking at")}{" "}
                <p style={{ fontSize: "18px", margin: 0 }}>
                  {monthlyCounts.percentage} {t(monthlyCounts.percentageLabel)}
                </p>
              </p>
              <hr style={{ margin: 0 }} />
              <h2 className="fw-bold mt-5">
                {monthlyCounts.previousMonthCount} / {t("Previous Month")}
              </h2>
            </div>
          </div>
          <div className="col-md-8">
            <ReactApexChart
              options={{
                ...chartOptions,
                yaxis: {
                  title: {
                    text: t("Number of Requisitions"),
                  },
                },
              }}
              series={chartSeries}
              type="area"
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProgression;
