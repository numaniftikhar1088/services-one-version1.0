import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import useLang from "Shared/hooks/useLanguage";
import { Loader } from "../../../Shared/Common/Loader";

const ReferenceLabGrid = (props: {
  rows: any;
  setRows: any;
  dropDownValues: any;
  searchRequest: any;
  searchQuery: any;
  EditUser: any;
  handleChange: any;
  loading: boolean;
  deleteRecord: any;
  StatusChange: any;
}) => {
  const {
    rows,
    searchRequest,
    searchQuery,
    EditUser,
    handleChange,
    loading,
    deleteRecord,
    StatusChange,
  } = props;
  // ********** Dropdown START **********
  const { t } = useLang()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // ********** Dropdown EDN **********


  return (
    <>
      <TableHead>
        <TableRow className="h-50px">
          <TableCell></TableCell>
          <TableCell>
            <input
              type="text"
              name="firstName"
              className="form-control bg-white mb-3 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.firstName}
              onChange={searchQuery}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              name="lastName"
              className="form-control bg-white mb-3 mb-lg-0"
              placeholder={t("Search ...")}
              onChange={searchQuery}
              value={searchRequest.lastName}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              name="adminEmail"
              className="form-control bg-white mb-3 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.adminEmail}
              onChange={searchQuery}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              name="adminType"
              className="form-control bg-white mb-3 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.adminType}
              onChange={searchQuery}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              name="userGroup"
              className="form-control bg-white mb-3 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.userGroup}
              onChange={searchQuery}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              name="userGroup"
              className="form-control bg-white mb-3 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.userGroup}
              onChange={searchQuery}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              name="userGroup"
              className="form-control bg-white mb-3 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.userGroup}
              onChange={searchQuery}
            />
          </TableCell>
          <TableCell>
            <input
              type="text"
              name="userGroup"
              className="form-control bg-white mb-3 mb-lg-0"
              placeholder={t("Search ...")}
              value={searchRequest.userGroup}
              onChange={searchQuery}
            />
          </TableCell>
        </TableRow>
        <TableRow className="h-40px">
          <TableCell>{t("Actions")}</TableCell>
          <TableCell className="min-w-200px">{t("Reference Lab")}</TableCell>
          <TableCell className="min-w-200px">{t("Lab Type")}</TableCell>
          <TableCell className="min-w-200px">{t("Code")}</TableCell>
          <TableCell className="min-w-200px">{t("Requisition Type")}</TableCell>
          <TableCell className="min-w-200px">{t("Group")}</TableCell>
          <TableCell className="min-w-200px">{t("Insurance")}</TableCell>
          <TableCell className="min-w-200px">{t("Gender")}</TableCell>
          <TableCell className="min-w-200px">{t("Status")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableCell colSpan={9} className="">
            <Loader />
          </TableCell>
        ) : (
          rows?.map((row: any) => (
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
              <TableCell>
                <div className="d-flex justify-content-center">
                  <Dropdown>
                    <Dropdown.Toggle className="p-0 del-before">
                      <div
                        className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        <i className="bi bi-three-dots-vertical p-0"></i>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4">
                      <Dropdown.Item
                        className="menu-item p-0"
                        onClick={() => EditUser(row)}
                      >
                        <span className="menu-link text-dark">
                          <i className="fa fa-edit text-warning mr-2  w-20px"></i>
                          {t("Edit")}
                        </span>
                      </Dropdown.Item>

                      <Dropdown.Item
                        className="menu-item p-0"
                        onClick={() => deleteRecord(row.id)}
                      >
                        <span className="menu-link text-dark">
                          <i className="fa fa-trash text-danger mr-2  w-20px"></i>
                          {t("Delete")}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="menu-item p-0"
                        onClick={() => StatusChange(row.id, row.status)}
                      >
                        <span className="menu-link text-dark">
                          {row.status === false ? (
                            <>
                              <i className="fa fa-check text-primary mr-2 w-20px">
                                {" "}
                              </i>
                              <span>{t("Active")}</span>
                            </>
                          ) : (
                            <>
                              <i className="fa fa-times text-danger mr-2 w-20px"></i>
                              <span>{t("InActive")}</span>
                            </>
                          )}
                        </span>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </TableCell>

              <TableCell component="th" scope="row">
                {row.referenceLab}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.labType}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.code}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.requisitionType}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.testGroup}
              </TableCell>
              <TableCell component="th" scope="row">
                { }
              </TableCell>
              <TableCell component="th" scope="row">
                { }
              </TableCell>
              <TableCell component="th" scope="row" className="text-center">
                {row.status === true ? (
                  <>
                    <i className="fa fa-check text-primary"></i>
                  </>
                ) : (
                  <>
                    <i className="fa fa-times text-danger"></i>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </>
  );
};

export default ReferenceLabGrid;
