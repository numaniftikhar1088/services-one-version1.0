import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React from "react";
import DropdownButton from "../../../../../../Shared/DropdownButton";
import { ViewRequisitionActionsArray } from "../../../../../../Utils/Requisition/Input/ActionsArray";
import useLang from './../../../../../../Shared/hooks/useLanguage';

const Row = () => {
  const { t } = useLang()
  const getValues = (row: any, action: string) => {
    if (action === "Delete") {

    }
    if (action === "Edit") {

    }
  };
  return (
    <>
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <div className="d-flex justify-content-center">
              <DropdownButton
                getValues={getValues}
                iconArray={ViewRequisitionActionsArray}
                row={1}
              />
            </div>
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="table-text">{t("Vero Lab")}</div>
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="table-text">{t("1095 Investment Boulevard, Apex, NC 27502")}</div>
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="table-text">{t("Vero Diagnostics")}</div>
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="table-text">{t("VER")}</div>
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="table-text">{t("VER")}</div>
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="table-text">{t("No")}</div>
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="table-text">{t("In-House")}</div>
          </TableCell>

        </TableRow>
      </React.Fragment>
    </>
  );
};

export default Row;
