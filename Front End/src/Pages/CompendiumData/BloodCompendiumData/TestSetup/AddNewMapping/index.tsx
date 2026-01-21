import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import AsyncSelect from "react-select/async";
import DropdownButton from "../../../../../Shared/DropdownButton";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  RemoveICon,
} from "../../../../../Shared/Icons";
import { styles } from "../../../../../Utils/Common";
import { TestSetupActionsArray } from "../../../../../Utils/Compendium/ActionsArray";
import TestSetupExpendablesRows from "../TestSetupExpendablesRows/TestSetupExpendablesRows";
// import TablePaginationUnstyled, {
//   tablePaginationUnstyledClasses as classes,
// } from "@mui/base/TablePaginationUnstyled";
import Stack from "@mui/material/Stack";
import useLang from './../../../../../Shared/hooks/useLanguage';

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
function Row(props: { row: any; rows: any; setRows: any; index: number }) {
  const { t } = useLang()
  const { row, rows, index, setRows } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {!row.rowStatus ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                  <RemoveICon />
                </button>
              ) : (
                <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                  <AddIcon />
                </button>
              )}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <div className="gap-2 d-flex">
                <button className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px">
                  <DoneIcon />
                </button>
                <button
                  onClick={() => {
                    let newArray = [...rows];
                    newArray.splice(index, 1);
                    setRows(newArray);
                  }}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <CrossIcon />
                </button>
              </div>
            ) : (
              <DropdownButton iconArray={TestSetupActionsArray} row={row} />
            )}
          </div>
        </TableCell>
        <TableCell component="th" scope="row">
          <input
            type="text"
            name="userName"
            className="form-control bg-transparent mb-3 mb-lg-0"
            placeholder={t("Display Name")}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <input
            type="text"
            name="userName"
            className="form-control bg-transparent mb-3 mb-lg-0"
            placeholder={t("Performing Lab")}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <input
            type="text"
            name="userName"
            className="form-control bg-transparent mb-3 mb-lg-0"
            placeholder={t("Test Code")}
          />
        </TableCell>
        <TableCell align="left">
          <div className="col-12">
            <AsyncSelect
              theme={(theme) => styles(theme)}
              cacheOptions
              // onChange={(event: any) => {
              //   return setValues((preVal: any) => {
              //     return {
              //       ...preVal,
              //       reqTypeId: event?.value,
              //     };
              //   });
              // }}
              //defaultValue={{ value: values.reqTypeId, label: values.label }}
              //loadOptions={loadOptions}
              defaultOptions
            />
          </div>
        </TableCell>
        <TableCell align="left">
          <div className="col-12">
            <AsyncSelect
              theme={(theme) => styles(theme)}
              cacheOptions
              // onChange={(event: any) => {
              //   return setValues((preVal: any) => {
              //     return {
              //       ...preVal,
              //       reqTypeId: event?.value,
              //     };
              //   });
              // }}
              //defaultValue={{ value: values.reqTypeId, label: values.label }}
              //loadOptions={loadOptions}
              defaultOptions
            />
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <TestSetupExpendablesRows />
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const createData = (
  id: number,
  name: string,
  carbs: number,
  protein: number,
  price: number,
  rowStatus: boolean
) => {
  return {
    id: id,
    name: name,
    carbs: carbs,
    protein: protein,
    price: price,
    rowStatus: rowStatus,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
};
export default function AddNewMappingTable() {
  const {t} = useLang()
  const [rows, setRows] = React.useState(() => [
    createData(1, "Ice cream sandwich", 37, 4.3, 4.99, false),
  ]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="my-4">
        <Button
          onClick={() =>
            setRows((prevRows) => [
              createData(5, "bread", 4, 5, 6, true),
              ...prevRows,
            ])
          }
          variant="contained"
          color="success"
          className="btn btn-table-addnew btn-sm fw-bold mr-3 px-10 text-capitalize"
        >
          <i className="bi bi-plus-lg"></i> {t("Add New Mapping")}
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
                  <TableCell>{t("DISPLAY NAME")}</TableCell>
                  <TableCell style={{ width: "100px" }}>
                    {t("PERFORMING LAB")}
                  </TableCell>
                  <TableCell>{t("TEST CODE")}</TableCell>
                  <TableCell>{t("ORDER CODE")}</TableCell>
                  <TableCell>{t("RESULT CODE")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <Row row={row} index={index} rows={rows} setRows={setRows} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={5}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
          <Stack alignItems="end">
            {/* <CustomTablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'rows per page',
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
