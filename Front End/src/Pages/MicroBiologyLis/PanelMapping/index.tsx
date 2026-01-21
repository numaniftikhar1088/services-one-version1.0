import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import usePagination from "../../../Shared/hooks/usePagination";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import Row, { MicroBiologyPanelMappingRow } from "./Row";
import PanelMappingService from "Services/InfectiousDisease/PanelMappingService";
import { PanelsAgainstLabId } from "Services/InfectiousDisease/ReflexRules";
import {
  GetAllMicroBiologyPanelMapping,
  GroupLookupByReqType,
} from "Services/MicroBiology/PanelMapping";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import { StringRecord } from "Shared/Type";
import useIsMobile from "Shared/hooks/useIsMobile";
import useLang from "Shared/hooks/useLanguage";

const initialSearchQuery = {
  performingLabId: 0,
  panelId: 0,
  panelName: "",
  reflexOnPanelIds: 0,
  reflexOn: "",
  indivisualPanel: null,
};

const queryDisplayTagNames: StringRecord = {
  performingLabId: "Performing Lab",
  panelName: "Panel Name",
  reflexOnPanelIds: "Reflex On Panel",
  reflexOn: "Reflex On",
  groupId: "Group Name",
};

function MicrobiologyPanelMapping() {
  const { t } = useLang();

  const isMobile = useIsMobile();

  // const [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<MicroBiologyPanelMappingRow[]>([]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [dropDownValues, setDropDownValues] = useState({
    GroupList: [],
    OrganismList: [],
    PerformingLabList: [],
    ReflexOnPanelList: [],
    ReflexOnPanelSearchList: [],
    ReflexOnList: [
      { label: "Detected", value: "Detected" },
      { label: "Not Detected", value: "Not Detected" },
    ],
  });

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
  const { curPage, pageSize, setTotal } = usePagination();

  useEffect(() => {
    loadGridData(true, false);
  }, [curPage, pageSize]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const loadGridData = (loader: boolean, sortingState?: any) => {
    if (loader) {
      setLoading(true);
    }
    setIsAddButtonDisabled(false);
    GetAllMicroBiologyPanelMapping({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: initialSearchQuery,
      sortColumn: sortingState?.clickedIconData,
      sortDirection: sortingState?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.totalRecord);
        setRows(res?.data?.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

  const PerformingLabLookUp = () => {
    PanelMappingService.PerformingLabLookup()
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            PerformingLabList: res?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const ReflexOnPanelLookUp = (labId: number | null) => {
    PanelsAgainstLabId(labId)
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            [labId ? "ReflexOnPanelList" : "ReflexOnPanelSearchList"]:
              res?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const GroupLookUp = () => {
    GroupLookupByReqType(57)
      .then((res: AxiosResponse) => {
        const formattedList = res?.data?.data.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));

        setDropDownValues((prevVal: any) => ({
          ...prevVal,
          GroupList: formattedList,
        }));
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  useEffect(() => {
    GroupLookUp();
    PerformingLabLookUp();
    ReflexOnPanelLookUp(null);
  }, []);

  return (
    <>
      <div id="kt_app_toolbar" className="app-toolbar py-2 pt-lg-3">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
        >
          <BreadCrumbs />
        </div>
      </div>
      <div className="app-container container-fluid">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-body pt-2 pb-4">
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
                <div className="d-flex gap-2 responsive-flexed-actions">
                  <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
                    <div className="mt-0">
                      <PermissionComponent
                        moduleName="Microbiology LIS"
                        pageName="Panel Mapping"
                        permissionIdentifier="AddNew"
                      >
                        <Button
                          id={`IDCompendiumDataPharmDPreferenceAddRow`}
                          onClick={() => {
                            if (!isAddButtonDisabled) {
                              setRows((prevRows: any) => [
                                {
                                  ...initialSearchQuery,
                                  id: 0,
                                  rowStatus: true,
                                  indivisualPanel: true,
                                },
                                ...prevRows,
                              ]);
                              setIsAddButtonDisabled(true);
                            }
                          }}
                          variant="contained"
                          color="success"
                          className="btn btn-primary btn-sm text-capitalize fw-400"
                          disabled={loading || rows.length === 1}
                          sx={{
                            "&.Mui-disabled": {
                              opacity: "0.65",
                              backgroundColor: "#69A54B",
                              color: "white",
                            },
                          }}
                        >
                          <i className="bi bi-plus-lg"></i>
                          {t("Add New")}
                        </Button>
                      </PermissionComponent>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <Box sx={{ height: "auto", width: "100%" }}>
                  <div className="card">
                    <Box sx={{ height: "auto", width: "100%" }}>
                      <div className="table_bordered overflow-hidden">
                        <TableContainer
                          sx={
                            isMobile
                              ? {}
                              : {
                                  maxHeight: "calc(100vh - 100px)",
                                  "&::-webkit-scrollbar": {
                                    width: 7,
                                  },
                                  "&::-webkit-scrollbar-track": {
                                    backgroundColor: "#fff",
                                  },
                                  "&:hover": {
                                    "&::-webkit-scrollbar-thumb": {
                                      backgroundColor: "var(--kt-gray-400)",
                                      borderRadius: 2,
                                    },
                                  },
                                  "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: "var(--kt-gray-400)",
                                    borderRadius: 2,
                                  },
                                }
                          }
                          className="shadow-none"
                        >
                          <Table
                            aria-label="sticky table collapsible"
                            className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                          >
                            <TableHead>
                              <TableRow className="h-30px">
                                <TableCell className="min-w-50px">
                                  {t("Actions")}
                                </TableCell>
                                <TableCell sx={{ width: "max-content" }}>
                                  <div style={{ width: "max-content" }}>
                                    {t("Performing Lab")}
                                  </div>
                                </TableCell>
                                <TableCell sx={{ width: "max-content" }}>
                                  <div style={{ width: "max-content" }}>
                                    {t("Panel Name")}
                                  </div>
                                </TableCell>
                                <TableCell sx={{ width: "max-content" }}>
                                  <div style={{ width: "max-content" }}>
                                    {t("Reflex On Panel")}
                                  </div>
                                </TableCell>
                                <TableCell sx={{ width: "max-content" }}>
                                  <div style={{ width: "max-content" }}>
                                    {t("Reflex On")}
                                  </div>
                                </TableCell>
                                <TableCell sx={{ width: "max-content" }}>
                                  <div style={{ width: "max-content" }}>
                                    {t("Group Name")}
                                  </div>
                                </TableCell>
                                <TableCell className="min-w-50px">
                                  <div style={{ width: "max-content" }}>
                                    {t("Individual Panel")}
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {loading ? (
                                <TableCell colSpan={7} className="">
                                  <Loader />
                                </TableCell>
                              ) : rows.length ? (
                                rows.map((item: any, index: number) => {
                                  return (
                                    <Row
                                      row={item}
                                      rows={rows}
                                      key={item.id}
                                      index={index}
                                      setRows={setRows}
                                      ReflexOnPanelLookUp={ReflexOnPanelLookUp}
                                      loadGridData={loadGridData}
                                      dropDownValues={dropDownValues}
                                      // OrganismLookUp={OrganismLookUp}
                                      setDropDownValues={setDropDownValues}
                                      queryDisplayTagNames={
                                        queryDisplayTagNames
                                      }
                                      setIsAddButtonDisabled={
                                        setIsAddButtonDisabled
                                      }
                                    />
                                  );
                                })
                              ) : (
                                <NoRecord colSpan={7} />
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </Box>
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MicrobiologyPanelMapping;
