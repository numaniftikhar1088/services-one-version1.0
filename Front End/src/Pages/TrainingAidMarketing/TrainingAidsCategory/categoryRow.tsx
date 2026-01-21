import { MenuItem, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { TrainingAidsCAtegorySave } from "../../../Services/Marketing/TrainingAidsCategory";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../../Utils/Style/Dropdownstyle";
import useLang from "Shared/hooks/useLanguage";
import { toast } from "react-toastify";

function CategoryRow({
  row,
  index,
  onDelete,
  apiGetData,
  showApiData,
  setApiGetData,
  setIsBtnDisabled,
}: any) {
  const { t } = useLang();

  const [anchorEl, setAnchorEl] = React.useState({
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

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  const [openalert, setOpenAlert] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = (item: any, status: string) => {
    handleClose("dropdown2");
    setOpenAlert(true);
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
    // Validate the categoryTitle before proceeding
    if (!row.categoryTitle.trim()) {
      toast.error(t("Category Title cannot be empty."));
      return;
    }

    let res = await TrainingAidsCAtegorySave(row);
    if (res.data.httpStatusCode === 200) {
      showApiData();
      setIsBtnDisabled(false);
      handleClose("dropdown2");
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.data?.error);
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
                  id={`TrainingAidsCategorySave`}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  onClick={() => {
                    handlesave();
                  }}
                >
                  <i className="bi bi-check2" />
                </button>
                <button
                  id={`TrainingAidsCategoryCancel`}
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
                id={`TrainingAidsCategory3Dots_${row.id}`}
                aria-haspopup="true"
                onClick={(event) => handleClick(event, "dropdown2")}
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
                  moduleName="Marketing"
                  pageName="Training Category"
                  permissionIdentifier="Edit"
                >
                  <MenuItem className=" p-0 text-dark">
                    <Link
                      id={`TrainingAidsCategoryEdit`}
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
                <PermissionComponent
                  moduleName="Marketing"
                  pageName="Training Category"
                  permissionIdentifier="Delete"
                >
                  <MenuItem className="p-0">
                    <a
                      id={`TrainingAidsCategoryDelete`}
                      onClick={() => handleClickOpen(row, row.id)}
                      className=" p-0 text-dark"
                    >
                      <i
                        className="fa fa-trash text-danger mr-2"
                        aria-hidden="true"
                      ></i>
                      {t("Delete")}
                    </a>
                  </MenuItem>
                </PermissionComponent>
              </StyledDropMenuMoreAction>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`TrainingAidsCategoryTitle_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row.rowStatus ? (
            <input
              id={`TrainingAidsCategoryTitle`}
              type="text"
              placeholder=""
              name="categoryTitle"
              className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
              value={row.categoryTitle}
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
                {row.categoryTitle}
              </div>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`TrainingAidsCategoryNameOfDocument_${row.id}`}
          sx={{
            width: "max-content",
          }}
        >
          <div className="d-flex justify-content-between cursor-pointer" id="">
            <div
              style={{
                width: "max-content",
              }}
            >
              {row.nameOfDocument}
            </div>
          </div>
        </TableCell>
      </TableRow>
      <BootstrapModal
        BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Record")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete this record ?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`TrainingAidsCategoryDeleteModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`TrainingAidsCategoryDeleteModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDelete(row.id)}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default CategoryRow;
