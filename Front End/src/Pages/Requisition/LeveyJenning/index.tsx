import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LeveingJenningReport: React.FC<any> = ({ data, labels }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstance.current) {
          // Update existing chart
          chartInstance.current.data.labels = labels;
          chartInstance.current.data.datasets[0].data = data;
          chartInstance.current.update();
        } else {
          // Create new chart
          chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Line Chart Example",
                  data: data,
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 2,
                  fill: false,
                },
              ],
            },
            options: {
              // scales: {
              //   x: {
              //     type: "linear",
              //     position: "bottom",
              //   },
              //   y: {
              //     min: 0,
              //   },
              // },
              scales: {
                y: {
                  stacked: true,
                },
              },
            },
          });
        }
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null; // Reset to null after destroying
      }
    };
  }, [data, labels]);

  return <canvas ref={chartRef} />;
};

export default LeveingJenningReport;
