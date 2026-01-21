type CardDataI = {
  label: string;
  value: number;
  description: string;
  status: string;
  filterDate: string;
  tabId: number;
};

type PieChartDatas = {
  workFlowStatus: string;
  workFlowStatusCount: number;
  percentage: number;
};

type PieChartPanelData = {
  panelCount: number;
  panelName: string;
};

type DonutChartDatas = {
  requisitionType: string;
  requisitionCount: number;
  percentage: number;
};

export type LineChartData = {
  requisitionType: string;
  monthName: string;
  monthSpix: string;
  year: number;
  monthNumber: number;
  requisitionCount: number;
};

export type MonthlyCounts = {
  currentMonthCount: number;
  previousMonthCount: number;
  percentage: string;
  percentageLabel: string;
};

export type DateRange = { startDate: string; endDate: string };

export type SearchQuery = {
  facilityName: string;
  state: string;
};

export interface DashboardDataI {
  dashboardDataCards: CardDataI[];
  lineChartDatas: LineChartData[];
  monthlyCounts: MonthlyCounts;
  pieChartDatas: PieChartDatasTypes[];
  pieChartPanelData: PieChartDatasTypes[];
  donutChartDatas: PieChartDatasTypes[];
}

export interface DonutChartData {
  requisitionType: string;
  requisitionCount: number;
  percentage: number;
}

export type PieChartDatasTypes =  {
  label: string;
  value: number;
}

export interface CardProps {
  value: number | string;
  title: string;
  description?: string;
  color: string;
  filterDate: string;
  status: string;
  dateToSendToRequisition: string;
  tabId: number;
}
