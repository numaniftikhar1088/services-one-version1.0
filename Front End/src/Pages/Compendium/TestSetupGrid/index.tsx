import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DropdownButton from "../../../Shared/DropdownButton";
import TablePagination from "@mui/material/TablePagination";
import TestSetUpService from "../../../Services/Compendium/TestSetUpService";
import Compendium from "../../../Services/Compendium/TestSetUpService";
import AsyncSelect from "react-select/async";
import { styles } from "../../../Utils/Common";
import {
  AddIcon,
  RemoveICon,
  DoneIcon,
  CrossIcon,
} from "../../../Shared/Icons";
import { TestSetupActionsArray } from "../../../Utils/Compendium/ActionsArray";
import { AxiosResponse } from "axios";
import { t } from "i18next";
import useLang from "../../../Shared/hooks/useLanguage";

interface IRequisition {
  reqTypeId: number;
  requisitionTypeName: string;
}
function Row(props: { row: any; rows: any; setRows: any; index: number }) {
  const { row, rows, index, setRows } = props;
  const [open, setOpen] = React.useState(false);
  const [requisitionList, setRequisitionList] = useState<
    {
      reqTypeId: number;
      requisitionTypeName: string;
    }[]
  >([]);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    TestSetUpService.getTestSetUpGridData({
      pageNumber: 0,
      pageSize: 0,
      queryModel: {
        name: "string",
        tmitCode: "string",
        department: 0,
        isActive: true,
      },
    })
      .then((res: AxiosResponse) => console.log(res, "res"))
      .catch((err: any) => {
        console.trace(err, "err");
      });
    Compendium.requisitionLookUpDropDown().then((res: AxiosResponse) => {
      let RequisitionArray: any = [];
      res?.data?.data?.forEach((val: IRequisition) => {
        let requisitionDetails = {
          value: val?.reqTypeId,
          label: val?.requisitionTypeName,
        };
        RequisitionArray.push(requisitionDetails);
      });
      setRequisitionList(RequisitionArray);
    });
  };

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
              {open ? <RemoveICon /> : <AddIcon />}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell>
          {row.rowStatus ? (
            <>
              <DoneIcon />
              <p
                onClick={() => {
                  let newArray = [...rows];
                  newArray.splice(index, 1);
                  setRows(newArray);
                }}
              >
                <CrossIcon />
              </p>
            </>
          ) : (
            <DropdownButton iconArray={TestSetupActionsArray} row={row} />
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          <input
            type="text"
            name="userName"
            className="form-control bg-transparent mb-3 mb-lg-0"
            placeholder={t("User Name")}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <input
            type="text"
            name="userName"
            className="form-control bg-transparent mb-3 mb-lg-0"
            placeholder={t("User Name")}
          />
        </TableCell>
        <TableCell align="right">
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
        <TableCell align="right">
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                {t("Additional Setup")}
              </Typography>
              <Table size="small" aria-label="purchases">
                {/* <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  {/* {row.history.map((historyRow: any) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))} */}
                  {/* start */}
                  <TableRow>
                    <TableCell>
                      <div className="fv-row mb-4">
                        {/* <!--begin::Label--> */}
                        <label className="required   mb-2">{t("Test Type")}</label>
                        <div className="d-flex align-items-center mt-3">
                          {/* <!--begin::Option--> */}
                          <label className="form-check form-check-inline form-check-solid me-5">
                            <input
                              className="form-check-input ifuser"
                              //onChange={accountActivationByUsername}
                              value={0}
                              name="activationType"
                              type="radio"
                              //checked={usernameType}
                              autoComplete="off"
                            />
                            <span className=" ps-2 ">{t("Individual")}</span>
                          </label>
                          {/* <!--end::Option--> */}
                          {/* <!--begin::Option--> */}
                          <label className="form-check form-check-inline form-check-solid">
                            <input
                              className="form-check-input ifemail"
                              value={1}
                              //onChange={accountActivationByEmail}
                              name="activationType"
                              type="radio"
                              //checked={emailType}
                              autoComplete="off"
                            />
                            <span className=" ps-2 ">{t("Group")}</span>
                          </label>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        name="userName"
                        className="form-control bg-transparent mb-3 mb-lg-0"
                        placeholder={t("User Name")}
                      />
                    </TableCell>
                    <TableCell>
                      <select
                        name="state"
                        className="form-select form-control bg-transparent"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder={t("--Select Option--")}
                      >
                        <option>{t("---select---")}</option>
                        <option value="california">{t("California")}</option>
                        <option value="texas">{t("Texas")}</option>
                        <option value="Item 3">{t("Florida")}</option>
                        <option value="alaska">{t("Alaska")}</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        name="state"
                        className="form-select form-control bg-transparent"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder={t("--Select Option--")}
                      >
                        <option>{t("---select---")}</option>
                        <option value="california">{t("California")}</option>
                        <option value="texas">{t("Texas")}</option>
                        <option value="Item 3">{t("Florida")}</option>
                        <option value="alaska">{t("Alaska")}</option>
                      </select>
                    </TableCell>
                  </TableRow>
                  {/* end */}
                  {/* start */}
                  <TableRow>
                    <TableCell>
                      <div className="fv-row mb-4">
                        {/* <!--begin::Label--> */}
                        <label className="required   mb-2">{t("Result Method")}</label>
                        <div className="d-flex align-items-center mt-3">
                          {/* <!--begin::Option--> */}
                          <label className="form-check form-check-inline form-check-solid me-5">
                            <input
                              className="form-check-input ifuser"
                              //onChange={accountActivationByUsername}
                              value={0}
                              name="activationType"
                              type="radio"
                              //checked={usernameType}
                              autoComplete="off"
                            />
                            <span className=" ps-2 ">{t("Manual")}</span>
                          </label>
                          {/* <!--end::Option--> */}
                          {/* <!--begin::Option--> */}
                          <label className="form-check form-check-inline form-check-solid">
                            <input
                              className="form-check-input ifemail"
                              value={1}
                              //onChange={accountActivationByEmail}
                              name="activationType"
                              type="radio"
                              //checked={emailType}
                              autoComplete="off"
                            />
                            <span className=" ps-2 ">{t("Interface")}</span>
                          </label>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        name="userName"
                        className="form-control bg-transparent mb-3 mb-lg-0"
                        placeholder={t("User Name")}
                      />
                    </TableCell>
                    <TableCell>
                      <select
                        name="state"
                        className="form-select form-control bg-transparent"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder={t("--Select Option--")}
                      >
                        <option>{t("---select---")}</option>
                        <option value="california">{t("California")}</option>
                        <option value="texas">{t("Texas")}</option>
                        <option value="Item 3">{t("Florida")}</option>
                        <option value="alaska">{t("Alaska")}</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <label className="form-check form-check-inline form-check-solid">
                        <input
                          className="form-check-input ifemail"
                          value={1}
                          //onChange={accountActivationByEmail}
                          name="activationType"
                          type="radio"
                          //checked={emailType}
                          autoComplete="off"
                        />
                        <span className=" ps-2 ">{t("Calculation")}</span>
                      </label>
                    </TableCell>
                    <TableCell>
                      <select
                        name="state"
                        className="form-select form-control bg-transparent"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder={t("--Select Option--")}
                      >
                        <option>{t("---select---")}</option>
                        <option value="california">{t("California")}</option>
                        <option value="texas">{t("Texas")}</option>
                        <option value="Item 3">{t("Florida")}</option>
                        <option value="alaska">{t("Alaska")}</option>
                      </select>
                    </TableCell>
                  </TableRow>
                  {/* end */}
                  {/* start */}
                  <TableRow>
                    <TableCell>
                      <div className="fv-row mb-4">
                        {/* <!--begin::Label--> */}
                        <label className="required   mb-2">{t("Result Method")}</label>
                        <div className="d-flex align-items-center mt-3">
                          {/* <!--begin::Option--> */}
                          <label className="form-check form-check-inline form-check-solid me-5">
                            <input
                              className="form-check-input ifuser"
                              //onChange={accountActivationByUsername}
                              value={0}
                              name="activationType"
                              type="radio"
                              //checked={usernameType}
                              autoComplete="off"
                            />
                            <span className=" ps-2 ">{t("Manual")}</span>
                          </label>
                          {/* <!--end::Option--> */}
                          {/* <!--begin::Option--> */}
                          <label className="form-check form-check-inline form-check-solid">
                            <input
                              className="form-check-input ifemail"
                              value={1}
                              //onChange={accountActivationByEmail}
                              name="activationType"
                              type="radio"
                              //checked={emailType}
                              autoComplete="off"
                            />
                            <span className=" ps-2 ">{t("Interface")}</span>
                          </label>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <select
                        name="state"
                        className="form-select form-control bg-transparent"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder={t("--Select Option--")}
                      >
                        <option>{t("---Select---")}</option>
                        <option value="california">{t("California")}</option>
                        <option value="texas">{t("Texas")}</option>
                        <option value="Item 3">{t("Florida")}</option>
                        <option value="alaska">{t("Alaska")}</option>
                      </select>
                    </TableCell>
                  </TableRow>
                  {/* end */}
                </TableBody>
              </Table>
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
export default function CollapsibleTable() {
  const { t } = useLang()
  const [rows, setRows] = React.useState(() => [
    createData(1, "Ice cream sandwich", 37, 4.3, 4.99, false),
    createData(2, "Eclair", 24, 6.0, 3.79, false),
    createData(3, "Cupcake", 67, 4.3, 2.5, false),
    createData(4, "Gingerbread", 356, 3.9, 1.5, false),
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
      <div
        style={{ marginTop: "5px" }}
        className="app-content flex-column-fluid"
      >
        <div className="app-container container-fluid">
          <div className="my-2">
            <Button
              onClick={() =>
                setRows((prevRows) => [
                  createData(5, "bread", 4, 5, 6, true),
                  ...prevRows,
                ])
              }
              variant="contained"
              color="success"
            >
              {t("Add New Test Assignment")}
            </Button>
          </div>
          <div className="card">
            <Box sx={{ height: 300, width: "100%" }}>
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>{t("ACTIONS")}</TableCell>
                      <TableCell>{t("TEST NAME")}</TableCell>
                      <TableCell>{t("TMIT CODE")}</TableCell>
                      <TableCell>{t("REQUISITION TYPE")}</TableCell>
                      <TableCell>{t("DEPARTMENT")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <Row
                        row={row}
                        index={index}
                        rows={rows}
                        setRows={setRows}
                      />
                    ))}
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
        </div>
      </div>
    </>
  );
}
