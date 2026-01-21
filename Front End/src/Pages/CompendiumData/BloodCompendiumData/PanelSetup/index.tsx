import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CompandiumPanelSetupService from "../../../../Services/Compendium/CompandiumPanelSetupService";
import TestSetUpService from "../../../../Services/Compendium/TestSetUpService";
import { Loader } from "../../../../Shared/Common/Loader";
import Row from "./Row";
import useLang from "Shared/hooks/useLanguage";
// import TablePaginationUnstyled, {
//   tablePaginationUnstyledClasses as classes,
// } from "@mui/base/TablePaginationUnstyled";

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
// const CustomTablePagination = styled(TablePaginationUnstyled)(
//   ({ theme }) => `
//   & .${classes.spacer} {
//     display: none;
//   }

//   & .${classes.toolbar}  {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     gap: 10px;
//     background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};

//     @media (min-width: 768px) {
//       flex-direction: row;
//       align-items: center;
//     }
//   }
//   & .${classes.selectLabel} {
//     margin: 0;
//   }

//   & .${classes.select}{
//     padding: 8px;
//     border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
//     border-radius: 50px;
//     background-color: transparent;
//     color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
//     width:100px;
//     &:hover {
//       background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
//     }
//     &:focus {
//       outline: 1px solid ${
//         theme.palette.mode === "dark" ? blue[400] : blue[200]
//       };
//     }
//   }

//   & .${classes.displayedRows} {
//     margin: 0;

//     @media (min-width: 768px) {
//       margin-left: auto;
//     }
//   }

//   & .${classes.actions} {
//     padding: 2px;
//     border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
//     border-radius: 50px;
//     text-align: center;
//   }
//   & .${classes.actions} > button {
//     margin: 0 8px;
//     border: transparent;
//     border-radius: 2px;
//     background-color: transparent;
//     color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};

//     &:hover {
//       background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
//     }

//     &:focus {
//       outline: 1px solid ${
//         theme.palette.mode === "dark" ? blue[400] : blue[200]
//       };
//     }
//   }
//   `
// );
interface IRequisition {
  reqTypeId: number;
  requisitionTypeName: string;
}

interface IDep {
  deptId: number;
  departmentName: string;
}
interface IRows {
  id: number;
  panelName: string;
  tmitcode: string;
  reqTypeId: Number;
  requisitionTypeName: string;
  isActive: boolean;
  deptId: Number;
  departmentName: string;
}

export default function PanelSetupGrid() {
  const {t} = useLang()
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
    CompandiumPanelSetupService.getAllPanelSetup({
      pageNumber: 1,
      pageSize: 2000,
    })
      .then((res: AxiosResponse) => {
        

        setRows(res?.data?.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };
  const loadData = () => {
    CompandiumPanelSetupService.requisitionLookUpDropDown()
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
    CompandiumPanelSetupService.departmentLookUpDropDown()
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
      .catch((err: any) => {
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
      .catch((err: any) => {
        
      });
  };
  ////////////-----------------Delete a Row-------------------///////////////////
  const handleSubmit = (row: any) => {
    const queryModel = {
      id: 0,
      panelName: row?.panelName,
      tmitcode: row?.tmitcode,
      reqTypeId: row?.reqTypeId,
      deptId: row?.deptId,
      isActive: true,
    };
    
    CompandiumPanelSetupService.savePanelSetupCompandium(queryModel)
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
              {
                id: Math.random(),
                panelName: "",
                tmitcode: "",
                reqTypeId: 0,
                requisitionTypeName: "",
                isActive: true,
                deptId: 0,
                departmentName: "",
                rowStatus: true,
              },
              ...prevRows,
            ])
          }
          variant="contained"
          color="success"
          className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
        >
          {t("Add New Panel SetUp")}
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
                  <TableCell>{t("PANEL NAME")}</TableCell>
                  <TableCell>{t("TMIT CODE")}</TableCell>
                  <TableCell>{t("REQUISITION TYPE")}</TableCell>
                  <TableCell>{t("DEPARTMENT")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <Loader />
                ) : (
                  rows.map((item: any, index) => {
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={5}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </div>
    </>
  );
}
