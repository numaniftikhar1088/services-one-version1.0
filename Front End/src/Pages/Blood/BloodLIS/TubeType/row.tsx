import { MenuItem, TableCell, TableRow } from "@mui/material";

import { Link } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import { toast } from "react-toastify";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

import { TubeTypeSaveData } from "Services/BloodLisSetting/BloodLisSetting";
import { useState } from "react";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";

function TubeTypeRow({
  row,
  index,
  apiGetData,
  showApiData,
  setApiGetData,
  setIsBtnDisabled,
  handleChangeSwitch,
}: any) {
  const { t } = useLang();
  const [anchorEl, setAnchorEl] = useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const getValues = (r: any) => {
    const updatedRows = apiGetData.map((row: any) => {
      if (row.id === r.id) {
        return { ...row, rowStatus: true };
      }
      return row;
    });
    setApiGetData(updatedRows);
  };

  const handleChange = (name: string, value: string, id: number) => {
    setApiGetData((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
            ...x,
            [name]: value,
          }
          : x
      )
    );
  };

  const handlesave = async () => {
    try {
      if (!row.tubeType || !row.tubeType.trim()) {
        toast.error(t("Tube Type cannot be empty."));
        return;
      }

      const payload = {
        id: row.id || 0,
        tubeTypeName: row.tubeType,
        status: row.status,
      };

      const res = await TubeTypeSaveData(payload);

      if (res?.data?.statusCode === 200) {
        showApiData();
        setIsBtnDisabled(false);
        handleClose("dropdown2");
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error in handlesave:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleRowClick = (row: any, index: number) => {
    handleClose("dropdown2");

    if (row.id !== 0) {
      const updatedRows = apiGetData.map((r: any) => {
        if (r.id === row.id) {
          return { ...r, rowStatus: false };
        }
        return r;
      });
      setApiGetData(updatedRows);
    } else {
      let newArray = [...apiGetData];
      newArray.splice(index, 1);
      setApiGetData(newArray);
      setIsBtnDisabled(false);
    }
    showApiData();
  };

  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell>
          {row.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="gap-2 d-flex">
                <button
                  id={`TubeTypeSave`}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  onClick={() => {
                    handlesave();
                  }}
                >
                  <i className="bi bi-check2" />
                </button>
                <button
                  id={`TubeTypeCancel`}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  onClick={() => handleRowClick(row, index)}
                >
                  <i className="bi bi-x" />
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <StyledDropButtonThreeDots
                id={`TubeType3Dots_${row.id}`}
                aria-haspopup="true"
                onClick={(event: any) => handleClick(event, "dropdown2")}
                className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
              >
                <i className="bi bi-three-dots-vertical p-0 icon"></i>
              </StyledDropButtonThreeDots>
              <StyledDropMenuMoreAction
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl.dropdown2}
                open={Boolean(anchorEl.dropdown2)}
                onClose={() => handleClose("dropdown2")}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <PermissionComponent
                  moduleName="Blood LIS"
                  pageName="LIS Setting"
                  permissionIdentifier="EditTubeType"
                >
                <MenuItem className=" p-0 text-dark">
                  <Link
                    id={`TubeTypeEdit`}
                    to={""}
                    className="text-dark w-100 h-100 p-0"
                    onClick={() => {
                      getValues(row);
                    }}
                  >
                    <i className="fa fa-edit text-primary mr-2 w-20px" />
                    {t("Edit")}
                  </Link>
                </MenuItem>
                </PermissionComponent>
              </StyledDropMenuMoreAction>
            </div>
          )}
        </TableCell>
        <TableCell id={`TubeTypeTitle_${row.id}`} sx={{ width: "max-content" }}>
          {row.rowStatus ? (
            <input
              id={`TubeType`}
              type="text"
              placeholder=""
              name="tubeType"
              className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
              value={row.tubeType}
              onChange={(e) =>
                handleChange(e.target.name, e.target.value, row.id)
              }
            />
          ) : (
            <div className="d-flex justify-content-between cursor-pointer">
              <div
                style={{
                  width: "max-content",
                }}
              >
                {row.tubeType}
              </div>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`RowActive/Inactive_${row.id}`}
          className="text-center"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="status"
                  id="flexSwitchCheckDefault"
                  onChange={(event: any) => handleChangeSwitch(event, row.id)}
                  checked={row.status ? true : false}
                />
                <label className="form-check-label"></label>
              </div>
            </>
          ) : (
            <>
              {row?.status ? (
                <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
              ) : (
                <i className="fa fa-ban text-danger mr-2 w-20px"></i>
              )}
            </>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

export default TubeTypeRow;
