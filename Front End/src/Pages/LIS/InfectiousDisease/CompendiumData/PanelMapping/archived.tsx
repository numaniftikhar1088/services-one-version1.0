import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import PanelMappingService from "Services/InfectiousDisease/PanelMappingService";
import useLang from "Shared/hooks/useLanguage";

function ArchivedIdCompendium({ curPage, pageSize, loadGridData }: any) {
  const { t } = useLang();

  const [archiveRows, setArchiverows] = useState([]);

  const loadArchieveData = (sortingState?: any) => {
    const nullObj = {
      performingLabId: 0,
      performingLabName: "",
      panelName: "",
      panelCode: "",
      assayName: "",
      organism: "",
      testCode: "",
      groupName: "",
      antibioticClass: "",
      reportingRuleName: "",
      resistance: null,
    };

    PanelMappingService.getAllDeletedCompendium({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: nullObj,
      sortColumn: sortingState?.clickedIconData,
      sortDirection: sortingState?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setArchiverows(res?.data?.result);
      })
      .catch((err: any) => {
        console.error(err, "err");
      });
  };

  const restoreDeletedRow = (id: number) => {
    PanelMappingService.restoreDeletedPanelMapping(id)
      .then((res: any) => {
        if (res?.status === 200) {
          toast.success(t(res?.data?.message));
          loadArchieveData();
          loadGridData(true, false);
        } else {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: any) => {
        console.error("Error deleting panel mapping:", err);
        toast.error(t("Something went wrong while deleting"));
      });
  };

  useEffect(() => {
    loadArchieveData();
  }, []);

  return (
    <>
      <div className="card mt-2">
        <Box sx={{ height: "auto", width: "100%" }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={{
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
              }}
              component={Paper}
              className="shadow-none"
            >
              <Table
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}></div>
                      </div>
                    </TableCell>

                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          {t("Performing Lab")}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>{t("Panel")}</div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>{t("Test")}</div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>{t("Group")}</div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Reporting Rule")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Deleted By")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Deleted Date")}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {archiveRows.map((item: any, index: number) => {
                    return (
                      <TableRow className="h-30px">
                        <TableCell>
                          <div className="rotatebtnn">
                            <DropdownButton
                              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                              key="end"
                              id={`IDCompendiumDataPanelMaping3Dots_${item.id}`}
                              drop="end"
                              title={
                                <i className="bi bi-three-dots-vertical p-0"></i>
                              }
                            >
                              <Dropdown.Item
                                id={`IDCompendiumDataPanelMapingDelete`}
                                className="w-auto"
                                eventKey="2"
                                onClick={() => restoreDeletedRow(item.panelId)}
                              >
                                <span className="menu-item px-3">
                                  <i className="fa fa-refresh text-success mr-2 w-20px"></i>
                                  {t("Restore")}
                                </span>
                              </Dropdown.Item>
                            </DropdownButton>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            {item.performingLabName}
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            <div style={{ width: "max-content" }}>
                              {item.panelName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            <div style={{ width: "max-content" }}>
                              {item.testCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            <div style={{ width: "max-content" }}>
                              {item.groupName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            <div style={{ width: "max-content" }}>
                              {item.reportingRuleName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            <div style={{ width: "max-content" }}>
                              {item.deletedBy}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            <div style={{ width: "max-content" }}>
                              {item.deletedDate
                                ? moment(item.deletedDate).format("DD MMM YYYY")
                                : "-"}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </>
  );
}

export default ArchivedIdCompendium;
