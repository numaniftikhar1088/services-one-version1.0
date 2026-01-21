import { Divider } from "@mui/material";
import Chart from "react-google-charts";
import useLang from "Shared/hooks/useLanguage";
import { PieChartDatasTypes } from "../dashboard.types";

interface PieChartProps {
  pieChartDatas: PieChartDatasTypes[];
  pieHole?: number;
  cardHeader: string;
}

function PieChart({ pieChartDatas, pieHole = 0, cardHeader }: PieChartProps) {
  const { t } = useLang();
  // Transform the API data for the chart
  const transformedData = [
    ["Workflow Status", "Count"], // Chart headers
    ...pieChartDatas?.map((item: PieChartDatasTypes) => [
      item?.label,
      item?.value,
    ]),
  ];

  const options = {
    pieHole: pieHole, // For a doughnut chart
    is3D: pieHole ? false : true, // Disable 3D effect
    pieSliceText: cardHeader === "Orders By Panel" ? "value" : "percentage", // Show actual values for donut, percentages for pie
    legend: {
      position: "bottom",
      alignment: "left", // Center-align the legend
      maxLines: 3, // Allow multi-line legends when there are plenty of items
      textStyle: { fontSize: 12 }, // Adjust font size for better spacing
    },
    chartArea: {
      width: "100%",
      height: "75%", // Adjust the chart height for proper layout
    }, // Custom color palette
  };

  return (
    <div className="mt-4">
      <div className="card shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="mb-2 p-4">
          <h5 className="card-title">{t(cardHeader)}</h5>
          <Divider />
        </div>
        <div className="row">
          <div className="d-flex justify-content-center">
            <div id="chart" style={{ width: "50%" }}>
              <Chart
                chartType="PieChart"
                data={transformedData}
                options={options}
                width={"100%"}
                height={"400px"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PieChart;
