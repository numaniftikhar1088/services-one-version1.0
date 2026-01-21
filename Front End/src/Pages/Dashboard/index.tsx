import { useEffect, useState } from "react";
import BarGraph from "./components/BarGraph";
import DateFilter from "./components/DateFilter";
import Card from "./components/NumberCard";
import OrderProgression from "./components/OrderProgression";
import PieChart from "./components/PieChart";
import SampleVolumeFacility from "./components/SampleVolumeFacility";
import { DashboardDataI, DateRange } from "./dashboard.types";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { getDashboardDataWithFilter } from "Services/Dashboard";

const initialObject = {
  startDate: "",
  endDate: "",
};

const initialDashboardDataState = {
  dashboardDataCards: [],
  lineChartDatas: [],
  monthlyCounts: {},
  pieChartDatas: [],
  pieChartPanelData: [],
  donutChartDatas: [],
};

function Dashboard() {
  const [filter, setFilter] = useState<DateRange>(initialObject);
  const [dateToSendToRequisition, setDateForRequisition] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardDataI>(
    initialDashboardDataState as any
  );

  const colors = [
    "#D9EEDB",
    "#F5E8B8",
    "#E5D9F8",
    "#C9F4C5",
    "#D4EEFD",
    "#FFD3E1",
    "#F4E8CC",
  ];

  const getDashboardData = async () => {
    try {
      const response = await getDashboardDataWithFilter(filter);
      const formatedPieChartPanelData = response.data.pieChartPanelData.map(
        (item: any) => ({
          value: item.panelCount,
          label: item.panelName,
        })
      );

      const formatedPieChartDatas = response.data.pieChartDatas.map(
        (item: any) => ({
          value: item.workFlowStatusCount,
          label: item.workFlowStatus,
        })
      );

      const formatedDonutChartDatas = response.data.donutChartDatas.map(
        (item: any) => ({
          value: item.requisitionCount,
          label: item.requisitionType,
        })
      );

      const dashboardData = {
        ...response.data,
        pieChartPanelData: formatedPieChartPanelData,
        pieChartDatas: formatedPieChartDatas,
        donutChartDatas: formatedDonutChartDatas,
      };

      setDashboardData(dashboardData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (filter.startDate && filter.endDate) {
      getDashboardData();
    }
  }, [filter]);

  const handleFilterChange = (
    startDate: string,
    endDate: string,
    dateFilter: string
  ) => {
    setFilter({ ...filter, startDate, endDate });
    setDateForRequisition(dateFilter);
  };

  console.log(
    dashboardData.pieChartPanelData.length,
    "dashboardData.pieChartPanelData.length"
  );

  return (
    <div>
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex gap-4 justify-content-center justify-content-sm-between align-items-center">
          <div className="w-100">
            <BreadCrumbs />
          </div>
          <div className="d-flex justify-content-end align-items-center w-100 gap-4">
            <DateFilter onDateChange={handleFilterChange} />
          </div>
        </div>
      </div>
      <div className="mt-5 app-container justify-content-start container-fluid d-flex flex-wrap gap-4">
        {dashboardData.dashboardDataCards.map((card, index) => (
          <div key={index} style={{ width: "fit-content" }}>
            <Card
              value={card.value}
              title={card.label}
              description={card.description}
              color={colors[index]}
              filterDate={card.filterDate}
              status={card.status}
              tabId={card.tabId}
              dateToSendToRequisition={dateToSendToRequisition}
            />
          </div>
        ))}
      </div>
      <div className="app-container">
        <OrderProgression
          lineChartData={dashboardData.lineChartDatas}
          monthlyCounts={dashboardData.monthlyCounts}
        />
      </div>
      <div className="app-container">
        <div className="row g-4 pie-graphs">
          <div className="col-md-6 col-12">
            <PieChart
              pieChartDatas={dashboardData?.donutChartDatas}
              pieHole={0.4}
              cardHeader={"Order By Type"}
            />
          </div>
          <div className="col-md-6 col-12">
            <PieChart
              pieChartDatas={dashboardData.pieChartDatas}
              cardHeader={"Order Disposition"}
            />
          </div>
        </div>
      </div>
      <div className="app-container">
        <div className="row g-4 pie-graphs">
          {dashboardData.pieChartPanelData.length ? (
            <div className="col-md-6 col-12">
              <PieChart
                pieChartDatas={dashboardData.pieChartPanelData}
                cardHeader={"Orders By Panel"}
              />
            </div>
          ) : null}
          <div
            className={
              dashboardData.pieChartPanelData.length
                ? "col-md-6 col-12"
                : "col-12"
            }
          >
            <BarGraph key={dashboardData.pieChartPanelData.length} />
          </div>
        </div>
      </div>
      <div className="app-container mb-5">
        <SampleVolumeFacility />
      </div>
    </div>
  );
}

export default Dashboard;
