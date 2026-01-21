import React from 'react'

//table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper } from "@mui/material";
import TableCell from "@mui/material/TableCell";

//dropdown
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import useLang from 'Shared/hooks/useLanguage';





const ManageSalesRepTable = () => {
    const { t } = useLang();
return (
<div className="table_bordered overflow-hidden table-responsive">
<Box sx={{ height: "auto", width: "100%" }}>
    <TableContainer
    component={Paper}
    className="shadow-none"
    sx={{
        maxHeight: "calc(100vh - 100px)",
        "&::-webkit-scrollbar": {
        width: 7,
        },
        "&::-webkit-scrollbar-track": {
        backgroundColor: "#fff",
        },
        "&:hover": {
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--kt-gray-400)",
            borderRadius: 2,
        },
        },
        "&::-webkit-scrollbar-thumb": {
        backgroundColor: "var(--kt-gray-400)",
        borderRadius: 2,
        },
    }}
    >
    <Table
        stickyHeader
        aria-label="sticky table collapsible"
        className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
    >
        <TableHead>
        <TableRow className="h-40px" style={{ backgroundColor: "#E9EEF4" }}>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
            {" "}
            <input
                className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                defaultValue=""
                name="userGroup"
                placeholder={t("Search ...")}
                type="text"
            />
            </TableCell>
            <TableCell>
            <input
                className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                defaultValue=""
                name="userGroup"
                placeholder={t("Search ...")}
                type="text"
            />
            </TableCell>
            <TableCell>
            <input
                className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                defaultValue=""
                name="userGroup"
                placeholder={t("Search ...")}
                type="text"
            />
            </TableCell>
            <TableCell>
            <input
                className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                defaultValue=""
                name="userGroup"
                placeholder={t("Search ...")}
                type="text"
            />
            </TableCell>
            <TableCell>
            <input
                className="min-w-150px w-100  form-control bg-white mb-3 mb-lg-0"
                defaultValue=""
                name="userGroup"
                placeholder={t("Search ...")}
                type="text"
            />
            </TableCell>
        </TableRow>
        <TableRow
            className="h-40px"
            style={{
            color: "#3F4254 !important",
            backgroundColor: "#F3F6F9 !important",
            }}
        >
            <TableCell>
            <label className="form-check form-check-sm form-check-solid">
                <input className=" form-check-input" type="checkbox" />
            </label>
            </TableCell>
            <TableCell>
            <div style={{ width: "max-content" }}>Actions</div>
            </TableCell>
            <TableCell>
            <div style={{ width: "max-content" }}>First Name</div>
            </TableCell>
            <TableCell>
            <div style={{ width: "max-content" }}>Last Name</div>
            </TableCell>
            <TableCell>
            <div style={{ width: "max-content" }}>Phone</div>
            </TableCell>
            <TableCell>
            <div style={{ width: "max-content" }}>Email</div>
            </TableCell>
            <TableCell>
            <div style={{ width: "max-content" }}>Primary RepNo</div>
            </TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
        <TableRow>
            <TableCell>
            <label className="form-check form-check-sm form-check-solid">
                <input className=" form-check-input" type="checkbox" />
            </label>
            </TableCell>
            <TableCell className="text-center">
            <DropdownButton
                className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                key="end"
                id="dropdown-button-drop-end"
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
                <Dropdown.Item eventKey="1">
                <div className="menu-item">
                    <i className="fa fa-user text-info mr-2 w-20px"></i>Go To Portal
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="2">
                <div className="menu-item">
                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                    Edit
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="3">
                <div className="menu-item">
                    <i className="fa fa-eye text-success mr-2 w-20px"></i>
                    View
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="4">
                <div className="menu-item">
                    <i className="fa fa-pause text-danger mr-2 w-20px"></i>
                    Suspend
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="5">
                <div className="menu-item">
                    <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                    Inactive
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="6">
                <div className="menu-item">
                    <i className="fa fa-archive mr-2 text-success"></i>
                    Archived
                </div>
                </Dropdown.Item>
            </DropdownButton>
            </TableCell>
            <TableCell>Ali Hassan</TableCell>
            <TableCell>Mehdi</TableCell>
            <TableCell>6107620273 </TableCell>
            <TableCell>@ShahWebs.com</TableCell>
            <TableCell>---</TableCell>
        </TableRow>
        <TableRow>
            <TableCell>
            <label className="form-check form-check-sm form-check-solid">
                <input className=" form-check-input" type="checkbox" />
            </label>
            </TableCell>
            <TableCell className="text-center">
            <DropdownButton
                className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                key="end"
                id="dropdown-button-drop-end"
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
                <Dropdown.Item eventKey="1">
                <div className="menu-item">
                    <i className="fa fa-user text-info mr-2 w-20px"></i> Go To
                    Portal
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="2">
                <div className="menu-item">
                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                    Edit
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="3">
                <div className="menu-item">
                    <i className="fa fa-eye text-success mr-2 w-20px"></i>
                    View
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="4">
                <div className="menu-item">
                    <i className="fa fa-pause text-danger mr-2 w-20px"></i>
                    Suspend
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="5">
                <div className="menu-item">
                    <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                    Inactive
                </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="6">
                <div className="menu-item">
                    <i className="fa fa-archive mr-2 text-success"></i>
                    Archived
                </div>
                </Dropdown.Item>
            </DropdownButton>
            </TableCell>
            <TableCell>Ali Hassan</TableCell>
            <TableCell>Mehdi</TableCell>
            <TableCell>6107620273 </TableCell>
            <TableCell>@ShahWebs.com</TableCell>
            <TableCell>---</TableCell>
        </TableRow>
        </TableBody>
    </Table>
    </TableContainer>
</Box>
</div>
);
}

export default ManageSalesRepTable
export {}