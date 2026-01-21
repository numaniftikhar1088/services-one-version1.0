import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getDashboardBarGraphData } from "Services/Dashboard";
import useLang from "Shared/hooks/useLanguage";

function BarGraph() {
  const { t } = useLang();
  const [filter, setFilter] = useState<"current" | "last">("current");
  const [state, setState] = useState<any>({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "70%",
              },
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: t("Requisition Count"),
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " requisitions";
          },
        },
      },
    },
  });

  const getGraphData = async () => {
    try {
      const response = await getDashboardBarGraphData(filter);

      // Process the response data
      const daysOrder = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const categories = daysOrder;
      const groupedData: { [key: string]: number[] } = {};

      // Initialize grouped data
      if (response.data)
        response.data.forEach((item: any) => {
          if (!groupedData[item.requisitionType]) {
            groupedData[item.requisitionType] = Array(7).fill(0);
          }
          groupedData[item.requisitionType][item.dayOrder - 1] =
            item.requisitionCount;
        });

      const series = Object.keys(groupedData).map((type) => ({
        name: type,
        data: groupedData[type],
      }));

      // Update state
      setState((prevState: any) => ({
        ...prevState,
        series,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories,
          },
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (filter) {
      getGraphData();
    }
  }, [filter]);

  return (
    <div className="mt-4">
      <div className="card shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="mb-2 d-flex gap-5 p-10">
          <Button
            onClick={() => setFilter("last")}
            variant="contained"
            color="warning"
            disabled={filter === "last"}
            sx={{ textTransform: "none" }} // 🟢 Disable automatic uppercase
          >
            {t("Last Week")}
          </Button>
          <Button
            onClick={() => setFilter("current")}
            variant="contained"
            color="success"
            disabled={filter === "current"}
            sx={{ textTransform: "none" }} // 🟢 Disable automatic uppercase
          >
            {t("This Week")}
          </Button>
        </div>
        <div className="row px-10">
          <div id="chart">
            <ReactApexChart
              options={state.options as any}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarGraph;
