import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useParams } from "react-router-dom";
import MiscellaneousService from "Services/MiscellaneousManagement/MiscellaneousService";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import useLang from "./../../Shared/hooks/useLanguage";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import SplitFilters from "./SplitFilters";

export interface TabConfiguration {
  tabName: string;
  tabID: number;
}

const initialTableData = {
  gridHeaders: [],
  gridColumns: [],
  gridData: [],
  facilityLookup: [],
};

export type Direction = "horizontal" | "vertical";

function DynamicSplitPane() {
  const { t } = useLang();
  const { pageId } = useParams();

  // Pane 1 states
  const [pane1Data, setPane1Data] = useState<any>([]);
  const [pane1, setPane1] = useState([]);
  const [pane1Loading, setPane1Loading] = useState(true);
  const [valuePane1, setValuePane1] = useState<number>(0);
  const [tabIdToSendPane1, setTabIdToSendPane1] = useState(1);
  const [bulkActionsPane1, setBulkActionsPane1] = useState([]);
  const [columnActionsPane1, setColumnsActionsPane1] = useState([]);
  const [columnDataActionsPane1, setColumnDataActionsPane1] = useState([]);
  const [topButtonActionsPane1, setTopButtonActionsPane1] = useState([]);
  const [bulkExportActionsPane1, setBulkExportActionsPane1] = useState([]);
  const [tabDataPane1, setTabDataPane1] = useState<any>(initialTableData);
  const [tabPanelsPane1, setTabPanelsPane1] = useState<any>(initialTableData);

  // Pane 2 states (duplicates)
  const [pane2Data, setPane2Data] = useState<any>([]);
  const [pane2, setPane2] = useState([]);
  const [pane2Loading, setPane2Loading] = useState(true);
  const [valuePane2, setValuePane2] = useState<number>(0);
  const [tabIdToSendPane2, setTabIdToSendPane2] = useState(1);
  const [inputFieldsPane2, setInputFieldsPane2] = useState<any>([]);
  const [bulkActionsPane2, setBulkActionsPane2] = useState([]);
  const [columnActionsPane2, setColumnsActionsPane2] = useState([]);
  const [columnDataActionsPane2, setColumnDataActionsPane2] = useState([]);
  const [topButtonActionsPane2, setTopButtonActionsPane2] = useState([]);
  const [bulkExportActionsPane2, setBulkExportActionsPane2] = useState([]);
  const [tabDataPane2, setTabDataPane2] = useState<any>(initialTableData);
  const [tabPanelsPane2, setTabPanelsPane2] = useState<any>(initialTableData);
  const [bottomButtonsPane1, setBottomButtonsPane1] = useState([]);
  const [isBulkEdit, setIsBulkEdit] = useState(false);

  const [secondPaneDirection, setSecondPaneDirection] =
    useState<Direction>("horizontal");

  // /////////////////////////////////////////

  const initialQueryObj = {
    recordNumber: "",
    filters: [],
  };

  const [filters, setFilters] = useState<any>([]);
  const [searchValue, setSearchValue] =
    useState<Record<string, any>>(initialQueryObj);

  const [topFiltersInputs, setTopFiltersInputs] = useState([]);

  const getMainFilterSplitPane = async () => {
    const response = await MiscellaneousService.getMainFilterSplitPane();
    setTopFiltersInputs(
      response?.data?.data?.sort(
        (a: any, b: any) => a.sortFilter - b.sortFilter
      )
    );
  };

  useEffect(() => {
    getMainFilterSplitPane();
    loadTabsForDynamicGrid();
    dynamicGridSplitPane();
  }, [pageId]);

  const loadTabsForDynamicGrid = async () => {
    try {
      const response = await MiscellaneousService.getTabsForSplitPane();

      const data = response?.data?.data;

      setSecondPaneDirection(data?.direction);

      const pane1 = data?.viewSplitPaneResponse?.find(
        (d: any) => d.paneNo === "1"
      );
      const pane2 = data?.viewSplitPaneResponse?.find(
        (d: any) => d.paneNo === "2"
      );

      setPane1(pane1);
      setPane2(pane2);

      // Pane 1
      const inputFieldsPane1 = pane1?.tabHeaders?.map((column: any) => {
        if (column.isShowOnUi && !column.isExpandData && column.isShow) {
          return {
            inputType: column.filterColumnsType,
            name: column.columnKey,
            jsonOptionData: column.jsonOptionData,
            fieldName: column.fieldName,
            isIndividualEditable: column.isIndividualEditable,
          };
        }
      });

      let tabPanelPane1 = pane1?.viewReqTabsWithHeadersResponse?.map(
        (tab: any) => ({
          tabName: tab.tabName,
          tabID: tab.tabID,
          sortOrder: tab.sortOrder,
        })
      );

      setColumnsActionsPane1(pane1?.tabActions);
      setColumnDataActionsPane1(pane1?.columnAction);
      setBulkActionsPane1(pane1?.bulkActions);
      setBulkExportActionsPane1(pane1?.bulkExportActions);
      setTopButtonActionsPane1(pane1?.topButtonAction);
      setTabPanelsPane1(tabPanelPane1);
      setTabDataPane1((preVal: any) => ({
        ...preVal,
        gridHeaders: pane1,
      }));

      // Pane 2
      const inputFieldsPane2 =
        pane2?.viewReqTabsWithHeadersResponse?.[0]?.tabHeaders?.map(
          (column: any) => {
            if (column.isShowOnUi && !column.isExpandData && column.isShow) {
              return {
                inputType: column.filterColumnsType,
                name: column.columnKey,
                jsonOptionData: column.jsonOptionData,
                fieldName: column.fieldName,
                isIndividualEditable: column.isIndividualEditable,
              };
            }
          }
        );

      let tabPanelPane2 = pane2?.viewReqTabsWithHeadersResponse?.map(
        (tab: any) => ({
          tabName: tab.tabName,
          tabID: tab.tabID,
          sortOrder: tab.sortOrder,
        })
      );

      setInputFieldsPane2(inputFieldsPane2);
      setColumnsActionsPane2(
        pane2?.viewReqTabsWithHeadersResponse?.[0]?.tabActions
      );
      setBottomButtonsPane1(
        pane2?.viewReqTabsWithHeadersResponse?.[0]?.bottomButtonAction
      );
      setColumnDataActionsPane2(pane2?.columnAction);
      setBulkActionsPane2(pane2?.bulkActions);
      setBulkExportActionsPane2(pane2?.bulkExportActions);
      setTopButtonActionsPane2(pane2?.topButtonAction);
      setTabPanelsPane2(tabPanelPane2);
      setTabDataPane2((preVal: any) => ({
        ...preVal,
        gridHeaders: pane2,
      }));
    } catch (error) {
      return error;
    } finally {
      setPane1Loading(false);
      setPane2Loading(false);
    }
  };

  const dynamicGridSplitPane = async (reset: boolean = false) => {
    if (reset) {
      setPane1Loading(true);
      setPane2Loading(true);
    }
    try {
      const response = await MiscellaneousService.dynamicGridSplitPane(
        !reset ? searchValue : initialQueryObj
      );

      setPane1Data(
        response.data.pane1.map((row: any) => ({
          ...row,
          rowStatus: row.IsOpenEditable ? true : row.rowStatus,
        }))
      );

      setPane2Data(
        response.data.pane2.map((row: any) => ({
          ...row,
          rowStatus: row.IsOpenEditable ? true : row.rowStatus,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setPane1Loading(false);
      setPane2Loading(false);
    }
  };

  const resetSearch = () => {
    setSearchValue(initialQueryObj);
    setFilters([]);
    dynamicGridSplitPane(true);
  };

  return (
    <div
      className="d-flex flex-column flex-column-fluid"
      style={{ height: "100vh" }}
    >
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div
          className="app-container container-fluid d-flex flex-column gap-4"
          style={{ flex: 1, overflowY: "auto", height: "100vh" }}
        >
          <BreadCrumbs />
          <PanelGroup
            direction="vertical"
            style={{ height: "100%", overflow: "hidden" }}
          >
            <Panel>
              <PanelGroup direction="vertical">
                {topFiltersInputs.length ? (
                  <Panel defaultSize={15}>
                    <div className="d-flex justify-content-around">
                      <div className="d-flex gap-3 p-2">
                        {topFiltersInputs.map((filter) => (
                          <SplitFilters
                            filter={filter}
                            setSearchValue={setSearchValue}
                            searchValue={searchValue}
                            filters={filters}
                            setFilters={setFilters}
                          />
                        ))}
                      </div>
                      <div className="d-flex align-items-center gap-2 gap-lg-3">
                        <button
                          onClick={() => dynamicGridSplitPane()}
                          className="btn btn-info btn-sm fw-500"
                          aria-controls="Search"
                        >
                          {t("Search")}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                          id="kt_reset"
                          onClick={() => resetSearch()}
                        >
                          <span>
                            <span>{t("Reset")}</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </Panel>
                ) : null}
                <PanelResizeHandle className="border" />
                <Panel defaultSize={100} style={{ height: "100vh" }}>
                  <PanelGroup direction={secondPaneDirection}>
                    <Panel
                      defaultSize={30}
                      style={{ overflowY: "auto", height: "100%" }}
                    >
                      <LeftPanel
                        rows={pane1Data}
                        setRows={setPane1Data}
                        paneNumber={pane1}
                        tabData={tabDataPane1}
                        tabPanels={tabPanelsPane1}
                        value={valuePane1}
                        setValue={setValuePane1}
                        tabIdToSend={tabIdToSendPane1}
                        setTabIdToSend={setTabIdToSendPane1}
                        setBulkActions={setBulkActionsPane1}
                        setColumnsActions={setColumnsActionsPane1}
                        setTopButtonActions={setTopButtonActionsPane1}
                        setBulkExportActions={setBulkExportActionsPane1}
                        bulkActions={bulkActionsPane1}
                        bulkExportActions={bulkExportActionsPane1}
                        topButtonActions={topButtonActionsPane1}
                        columnDataActions={columnDataActionsPane1}
                        columnActions={columnActionsPane1}
                        dynamicGridSplitPane={dynamicGridSplitPane}
                        getTabsForSplitPane={loadTabsForDynamicGrid}
                        setSearchValue={setSearchValue}
                        loading={pane1Loading}
                      />
                    </Panel>
                    <PanelResizeHandle className="border" />
                    <Panel
                      defaultSize={70}
                      style={{ overflowY: "auto", height: "100%" }}
                    >
                      <RightPanel
                        rows={pane2Data}
                        setRows={setPane2Data}
                        setRows2={setPane1Data}
                        paneNumber={pane2}
                        tabData={tabDataPane2}
                        tabPanels={tabPanelsPane2}
                        value={valuePane2}
                        setValue={setValuePane2}
                        tabIdToSend={tabIdToSendPane2}
                        setTabIdToSend={setTabIdToSendPane2}
                        setBulkActions={setBulkActionsPane2}
                        setColumnsActions={setColumnsActionsPane2}
                        setTopButtonActions={setTopButtonActionsPane2}
                        setBulkExportActions={setBulkExportActionsPane2}
                        bulkActions={bulkActionsPane2}
                        bulkExportActions={bulkExportActionsPane2}
                        topButtonActions={topButtonActionsPane2}
                        columnDataActions={columnDataActionsPane2}
                        columnActions={columnActionsPane2}
                        dynamicGridSplitPane={dynamicGridSplitPane}
                        getTabsForSplitPane={loadTabsForDynamicGrid}
                        setSearchValue={setSearchValue}
                        loading={pane2Loading}
                        inputFields={inputFieldsPane2}
                        setInputFields={setInputFieldsPane2}
                        bottomButtonsPane1={bottomButtonsPane1}
                        isBulkEdit={isBulkEdit}
                        setIsBulkEdit={setIsBulkEdit}
                      />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default DynamicSplitPane;
