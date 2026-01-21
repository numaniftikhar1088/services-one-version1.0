import { TableCell, TableRow } from "@mui/material";
import React from "react";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import { CrossIcon, DoneIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";

function AddVoucher({ setAddRow }: any) {
  const { t } = useLang();
  return (
    <>
      <TableRow className="h-30px">
        <TableCell sx={{ width: "max-content" }}>
          <div className="gap-2 d-flex">
            <button className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px">
              <DoneIcon />
            </button>
            <button
              className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
              onClick={() => setAddRow(false)}
            >
              <CrossIcon />
            </button>
          </div>
        </TableCell>
        <TableCell>
          <Select
            menuPortalTarget={document.body}
            theme={(theme: any) => styles(theme)}
            name="trainingAidsCategory"
            styles={reactSelectSMStyle}
          />
        </TableCell>

        <TableCell>
          <Select
            menuPortalTarget={document.body}
            theme={(theme: any) => styles(theme)}
            name="trainingAidsCategory"
            styles={reactSelectSMStyle}
          />
        </TableCell>
        <TableCell>
          <input
            type="text"
            className="form-control bg-white rounded-2 fs-8 h-30px"
            placeholder={t("Rate %")}
          />
        </TableCell>
        <TableCell>
          <input
            type="text"
            className="form-control bg-white rounded-2 fs-8 h-30px"
            placeholder={t("Rate %")}
          />
        </TableCell>
        <TableCell>
          <input
            type="text"
            className="form-control bg-white rounded-2 fs-8 h-30px"
            placeholder={t("Effective Start Date")}
          />
        </TableCell>
        <TableCell>
          <input
            type="text"
            className="form-control bg-white rounded-2 fs-8 h-30px"
            placeholder={t("Effective End Date")}
          />
        </TableCell>
        <TableCell>
          <Select
            menuPortalTarget={document.body}
            theme={(theme: any) => styles(theme)}
            name="trainingAidsCategory"
            styles={reactSelectSMStyle}
          />
        </TableCell>
      </TableRow>
    </>
  );
}

export default AddVoucher;
