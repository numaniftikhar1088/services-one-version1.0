import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PanelSetupData from "../../../../Services/Compendium/CompandiumPanelSetupService";
import TestSetUpService from "../../../../Services/Compendium/TestSetUpService";
import { Loader } from "../../../../Shared/Common/Loader";
import useLang from './../../../../Shared/hooks/useLanguage';
import Row, { ITableObj } from "./Row";

const blue = {
  200: "#A5D8FF",
  400: "#3399FF",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

interface IRequisition {
  reqTypeId: number;
  requisitionTypeName: string;
}

interface IDep {
  deptId: number;
  departmentName: string;
}
export interface IRows {
  id: number;
  name: string;
  department: number;
  departmentName: string;
  isActive: boolean;
  requisitionType: number;
  requisitionTypeName: string;
  tmitCode: string;
}
// const createData = (
//   id: number | "",
//   name: string | "",
//   department: number | "",
//   departmentName: string | "",
//   isActive: boolean | "",
//   requisitionType: number | "",
//   requisitionTypeName: string | "",
//   tmitCode: string | "",
//   rowStatus: boolean | ""
// ) => {
//   return {
//     id: id,
//     name: name,
//     department: department,
//     departmentName: departmentName,
//     isActive: isActive,
//     requisitionType: requisitionType,
//     requisitionTypeName: requisitionTypeName,
//     tmitCode: tmitCode,
//     rowStatus: rowStatus,
//     history: [
//       {
//         date: "2020-01-05",
//         customerId: "11091700",
//         amount: 3,
//       },
//       {
//         date: "2020-01-02",
//         customerId: "Anonymous",
//         amount: 1,
//       },
//     ],
//   };
// };
export default function CollapsibleTable() {
  const { t } = useLang();
  const [dropDownValues, setDropDownValues] = useState({
    requisitionList: [],
    departments: [],
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IRows[]>(() => []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    loadData();
    loadGridData(true);
  }, []);

  const loadGridData = (loader: boolean) => {
    if (loader) {
      setLoading(true);
    }
    TestSetUpService.getTestSetUpGridData({
      pageNumber: 1,
      pageSize: 200,
      // queryModel: {
      //   name: "string",
      //   tmitCode: "string",
      //   department: 0,
      //   isActive: true,
      // },
    })
      .then((res: AxiosResponse) => {
        setRows(res?.data?.data?.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };
  const loadData = () => {
    TestSetUpService.requisitionLookUpDropDown()
      .then((res: AxiosResponse) => {
        let RequisitionArray: any = [];
        res?.data?.data?.forEach((val: IRequisition) => {
          let requisitionDetails = {
            value: val?.reqTypeId,
            label: val?.requisitionTypeName,
          };
          RequisitionArray.push(requisitionDetails);
        });
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            requisitionList: RequisitionArray,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
    PanelSetupData.departmentLookUpDropDown()
      .then((res: AxiosResponse) => {
        let depArray: any = [];
        res?.data?.data?.forEach((val: IDep) => {
          let depDetails = {
            value: val?.deptId,
            label: val?.departmentName,
          };
          depArray.push(depDetails);
          setDropDownValues((preVal: any) => {
            return {
              ...preVal,
              departments: depArray,
            };
          });
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const handleChange = (name: string, value: string, id: number) => {
    setRows((curr) =>
      curr.map((x) =>
        x.id === id
          ? {
            ...x,
            [name]: value,
          }
          : x
      )
    );
  };
  ////////////-----------------Update a Row-------------------///////////////////
  const updateRow = (row: any) => {
    const queryModel = {
      id: row?.id,
      name: row?.name,
      referenceLab: 0,
      department: row?.department,
      tmiT_Code: row?.tmitCode,
      requisitionType: row?.requisitionType,
      isActive: true,
    };
    TestSetUpService.updateRecord(queryModel)
      .then((res: AxiosResponse) => {
        if (res?.data.data.status === 200) {
          toast.success(res?.data?.data?.message);
          loadGridData(false);
        }
      })
      .catch((err: AxiosError) => {
        console.trace(err);
      });
  };
  ////////////-----------------Updata a Row-------------------///////////////////
  ////////////-----------------Delete a Row-------------------///////////////////
  const deleteRow = (id: number) => {
    TestSetUpService?.deleteRecord(id)
      .then((res: AxiosResponse) => {

        if (res?.data?.status === 200) {
          toast.success(res?.data?.title);
          loadGridData(false);
        }
      })
      .catch((err: AxiosError) => {

      });
  };
  ////////////-----------------Delete a Row-------------------///////////////////
  const handleSubmit = (row: ITableObj) => {

    const queryModel = {
      id: 0,
      name: row?.name,
      referenceLab: 0,
      department: row?.department,
      tmiT_Code: row?.tmitCode,
      requisitionType: row?.requisitionType,
      isActive: true,
    };
    TestSetUpService.createTest(queryModel)
      .then((res: AxiosResponse) => {
        if (res?.data.data.status === 200) {
          toast.success(res?.data?.data?.message);
          loadGridData(false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };


  return (
    <>
      <div className="my-6 mt-0">
        <Button
          onClick={() =>
            setRows((prevRows: any) => [
              //createData("", "", "", "--select", "", "", "--select", "", true),
              {
                id: Math.random(),
                name: "",
                department: "",
                departmentName: "",
                isActive: true,
                requisitionType: "",
                requisitionTypeName: "",
                tmitCode: "",
                rowStatus: true,
              },
              ...prevRows,
            ])
          }
          variant="contained"
          color="success"
          className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
        >
          {t("Add New Test Assignment")}
        </Button>
      </div>
      <div className="card">
        <Box sx={{ height: "auto", width: "100%" }}>
          <TableContainer component={Paper} className="shadow-none">
            <Table
              aria-label="collapsible table"
              className="table table-cutome-expend table-bordered table-head-bg table-head-custom table-vertical-center"
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "49px" }} />
                  <TableCell style={{ width: "100px" }}>{t("ACTIONS")}</TableCell>
                  <TableCell>{t("TestName")}</TableCell>
                  <TableCell>{t("TMIT CODE")}</TableCell>
                  <TableCell>{t("REQUISITION TYPE")}</TableCell>
                  <TableCell>{t("DEPARTMENT")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                               {loading ? (
                  <Loader />
                ) : (
                  rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item: any, index) => {
                      return (
                        <Row
                          row={item}
                          index={index}
                          rows={rows}
                          setRows={setRows}
                          dropDownValues={dropDownValues}
                          handleChange={handleChange}
                          updateRow={updateRow}
                          handleDelete={deleteRow}
                          handleSubmit={handleSubmit}
                        />
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack alignItems="end">
            {/* <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={2}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  "aria-label": "rows per page",
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                } as any,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </Stack>
        </Box>
      </div>
    </>
  );
}
