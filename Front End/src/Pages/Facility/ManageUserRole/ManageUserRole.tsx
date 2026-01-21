import Box from "@mui/material/Box";
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
import { AxiosError, AxiosResponse } from "axios";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserManagementService from "../../../Services/UserManagement/UserManagementService";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import {
  AddIcon,
  ArrowDown,
  ArrowUp,
  LoaderIcon,
  RemoveICon,
  TrashIcon,
} from "../../../Shared/Icons";
import ManageUserRoleExpandable from "./ManageUserRoleExpandable";
import useLang from "Shared/hooks/useLanguage";

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

function Row(props: { row: any; loadData: any }) {
  const { t } = useLang();
  const [openalert, setOpenAlert] = React.useState(false);
  const [value, setValue] = useState<any>({
    userid: 0,
  });
  const handleClickOpen = (userId: any) => {
    setOpenAlert(true);
    setValue(() => {
      return {
        userid: userId,
      };
    });
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const [check, setCheck] = useState(false);
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const editRole = async (row: any) => {
    await UserManagementService.getByIdAllUserRolesAndPermissions(row.roleId)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          navigate(`/add-user-roles`, {
            state: res.data.data,
          });
        }
      })
      .catch((err: AxiosError) => {
        console.trace(err);
      });
  };
  const deleteRow = (id: number) => {
    setCheck(true);
    UserManagementService?.deleteRecord(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          toast.success(t(res?.data?.title));
          props.loadData();
        } else if (res?.data?.status === 400) {
          toast.error(t(res?.data?.title));
        }
      })
      .catch((err: AxiosError) => {
        console.trace(err);
      })
      .finally(() => {
        setCheck(false);
        handleCloseAlert();
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
              {open ? (
                <button
                  id={`AdminManageuserroleExpandOpen_${row.roleId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`AdminManageuserroleExpandClose_${row.roleId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <PermissionComponent
              moduleName="Admin"
              pageName="User Role and Page Rights"
              permissionIdentifier="Edit"
            >
              <button
                id={`AdminManageuserroleEdit_${row.roleId}`}
                onClick={() => editRole(row)}
                className="btn btn-icon btn-sm fw-bold btn-info"
              >
                <i style={{ fontSize: "18px" }} className="fas">
                  &#xf303;
                </i>
              </button>
            </PermissionComponent>
            {!row?.isDeleteAble ? (
              <PermissionComponent
                moduleName="Admin"
                pageName="User Role and Page Rights"
                permissionIdentifier="Delete"
              >
                <button
                  id={`AdminManageuserroleDelete_${row.roleId}`}
                  className="btn btn-icon btn-sm fw-bold btn-danger"
                  disabled
                >
                  <TrashIcon
                    className="fa fa-trash"
                    style={{ fontSize: "18px", color: "white" }}
                  />
                </button>
              </PermissionComponent>
            ) : (
              <PermissionComponent
                moduleName="Admin"
                pageName="User Role and Page Rights"
                permissionIdentifier="Delete"
              >
                <button
                  id={`AdminManageuserroleDeleteButton_${row.roleId}`}
                  className="btn btn-icon btn-sm fw-bold btn-danger"
                  onClick={() => handleClickOpen(row.roleId)}
                >
                  <TrashIcon
                    className="fa fa-trash"
                    style={{ fontSize: "18px", color: "white" }}
                  />
                </button>
              </PermissionComponent>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`AdminManageuserroleRoleName_${row.roleId}`}
          component="th"
          scope="row"
        >
          {row?.roleName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <ManageUserRoleExpandable row={row} />
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Modal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete User Role")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this User Role ?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`AdminManageuserroleDeleteModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AdminManageuserroleModalDeleteConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => deleteRow(value.userid)}
          >
            <span>{check ? <LoaderIcon /> : null}</span>{" "}
            <span>
              {""} {t("Delete")}
            </span>
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default function ManageUserRoleGrid(props: any) {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    refetch();
  }, [props?.clicked]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await UserManagementService.getAllUserRoles(
        props?.inputRef.current.value,
        props.sort.sortingOrder
      );
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  const { data, refetch } = useQuery("userRolesandclaims", loadData, {
    enabled: false,
  });

  const searchQuery = (e: any) => {
    props?.setSearchRequest(e.target.value);
    setLoading(false);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      // Call your search function here, e.g., searchQuery()
      refetch();
    }
  };
  ////////////-----------------Sorting-------------------///////////////////
  const searchRef = useRef<any>(null);

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    props.setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  useEffect(() => {
    refetch();
  }, [props.sort]);

  ////////////-----------------Sorting-------------------///////////////////
  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <div className="table_bordered overflow-hidden">
        <TableContainer component={Paper} className="shadow-none">
          <Table
            aria-label="collapsible table"
            className="table table-cutome-expend table-bordered table-head-2-bg  table-bg table-head-custom table-vertical-center border-1 mb-0"
          >
            <TableHead>
              <TableRow className="h-40px">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <input
                    id={`AdminManageuserroleSearchUserRole`}
                    type="search"
                    name="search"
                    ref={props?.inputRef}
                    className="form-control bg-white h-30px rounded"
                    placeholder={t("Search ...")}
                    value={props?.searchRequest}
                    onChange={searchQuery}
                    onKeyDown={(e) => handleKeyPress(e)}
                  />
                </TableCell>
              </TableRow>
              <TableRow className="h-30px">
                <TableCell style={{ width: "49px" }} />
                <TableCell style={{ width: "100px" }} className="text-center">
                  {t("ACTIONS")}
                </TableCell>
                <TableCell
                  className="min-w-200px"
                  sx={{ width: "max-content" }}
                >
                  <div
                    onClick={() => handleSort("roleName")}
                    className="d-flex justify-content-between cursor-pointer"
                    id=""
                    ref={searchRef}
                  >
                    <div style={{ width: "max-content" }}>
                      {t("User Roles")}
                    </div>

                    <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                      <ArrowUp
                        CustomeClass={`${
                          props.sort.sortingOrder === "desc" &&
                          props.sort.clickedIconData === "roleName"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                      />
                      <ArrowDown
                        CustomeClass={`${
                          props.sort.sortingOrder === "asc" &&
                          props.sort.clickedIconData === "roleName"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableCell colSpan={3} className="">
                  <Loader />
                </TableCell>
              ) : (
                data?.data?.data?.map((row: any) => (
                  <Row row={row} loadData={refetch} key={row?.roleId} />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
}
