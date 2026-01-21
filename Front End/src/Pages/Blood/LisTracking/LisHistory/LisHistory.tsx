import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import useLang from "Shared/hooks/useLanguage";
import { useEffect, useRef, useState } from "react";
import { Loader } from "../../../../Shared/Common/Loader";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import { SortingTypeI } from "../../../../Utils/consts";
import Row from "./Row";
import { TBL_HEADERS } from "./tableHeaders";

function LisHistory() {
  const { t } = useLang();

  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const sortById = {
    clickedIconData: "Id",
    sortingOrder: "desc",
  };
  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const searchRef = useRef<any>(null);

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  const getLogs = async () => {
    try {
      const response = await RequisitionType.trackingAuditLogs(2176, "LIS");
      setRows(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <div>
        <div className=" py-1 py-lg-2">
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
              className="shadow-none"
            >
              <Table
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-30px">
                    {TBL_HEADERS.map((header) =>
                      header.name === "" ? (
                        <TableCell></TableCell>
                      ) : (
                        <TableCell className="min-w-50px">
                          <div
                            onClick={() => handleSort(header.variable)}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: "max-content" }}>
                              {t(header.name)}
                            </div>

                            {/* <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === header.variable
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === header.variable
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                              />
                            </div> */}
                          </div>
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={9}>
                      <Loader />
                    </TableCell>
                  ) : (
                    rows.map((row: any, index: number) => (
                      <Row key={index} row={row} />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LisHistory;
