import { Collapse, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import Box from "@mui/material/Box";
import React from 'react';
import { DropdownButton } from 'react-bootstrap';
import Dropdown from "react-bootstrap/Dropdown";
import PermissionComponent from 'Shared/Common/Permissions/PermissionComponent';
import { AddIcon, RemoveICon } from 'Shared/Icons';
import LabSelection from './LabSelection';
import useLang from "Shared/hooks/useLanguage";


const Row = ({
    item,
    setOpen1,
    open1,
    handleClick,
    EditInsurance,
    handleClickOpen,
    insuranceData
}: any) => {
    const { t } = useLang();

    return (
        <>
            {/* <TableRow>
                <TableCell className="text-center">
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen1(!open1)}
                        className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
                    >
                        {open1 ? (
                            <button className="btn btn-icon btn-icon-light btn-sm fw-bold rounded h-10px w-20px">
                                <RemoveICon />
                            </button>
                        ) : (
                            <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                                <AddIcon />
                            </button>
                        )}
                    </IconButton>
                </TableCell>
                <TableCell className="text-center">
                    <DropdownButton
                        className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn moreaction-dropdown"
                        key="end"
                        id="dropdown-button-drop-end"
                        drop="end"
                        title={
                            <i className="bi bi-three-dots-vertical p-0"></i>
                        }
                        onClick={(
                            event: React.MouseEvent<HTMLElement>
                        ) => handleClick(event, item)}
                    >
                        {insuranceData.status ? (
                            <PermissionComponent
                                moduleName="Setup"
                                pageName="Insurance Provider Assignment"
                                permissionIdentifier="Edit"
                            >
                                <Dropdown.Item
                                    className="w-auto"
                                    eventKey="1"
                                    onClick={() =>
                                        EditInsurance(item)
                                    }
                                >
                                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                    {t("Edit")}
                                </Dropdown.Item>
                            </PermissionComponent>
                        ) : null}
                        <Dropdown.Item
                            className="w-auto"
                            eventKey="2"
                            onClick={(e) =>
                                handleClickOpen(insuranceData)
                            }
                        >
                            {insuranceData.status ? (
                                <PermissionComponent
                                    moduleName="Setup"
                                    pageName="Insurance Provider Assignment"
                                    permissionIdentifier="Inactive"
                                >
                                    <i
                                        className="fa fa-ban text-danger mr-2 w-20px"
                                        aria-hidden="true"
                                    ></i>
                                </PermissionComponent>
                            ) : (
                                <PermissionComponent
                                    moduleName="Setup"
                                    pageName="Insurance Provider Assignment"
                                    permissionIdentifier="Active"
                                >
                                    <i
                                        className="fa fa-check-circle text-success mr-2 w-20px"
                                        aria-hidden="true"
                                    ></i>
                                </PermissionComponent>
                            )}
                            {insuranceData.status ? (
                                <PermissionComponent
                                    moduleName="Setup"
                                    pageName="Insurance Provider Assignment"
                                    permissionIdentifier="Inactive"
                                >
                                    {t("Inactive")}
                                </PermissionComponent>
                            ) : (
                                <PermissionComponent
                                    moduleName="Setup"
                                    pageName="Insurance Provider Assignment"
                                    permissionIdentifier="Active"
                                >
                                    {t("Active")}
                                </PermissionComponent>
                            )}
                        </Dropdown.Item>
                    </DropdownButton>
                </TableCell>
                <TableCell>{item?.providerName}</TableCell>
                <TableCell>{item?.displayName}</TableCell>
                <TableCell>{item?.tmitCode}</TableCell>
                <TableCell>{item?.insuranceType}</TableCell>
                <TableCell className="text-center">
                    {item?.status ? (
                        <i
                            className="fa fa-check-circle text-success"
                            title="Enabled"
                        ></i>
                    ) : (
                        <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                    )}
                </TableCell>
            </TableRow> */}

            {/* <TableRow>
                <TableCell colSpan={7} className="padding-0">
                    <Collapse in={open1} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography gutterBottom component="div">
                                <div className="table-expend-sticky">
                                    <div className="row">
                                        <div className="col-lg-12 bg-white px-lg-14 px-md-10 px-4 pb-6">
                                            <LabSelection
                                            // setSports2={setSports2}
                                            // facilities={facilities}
                                            // sports2={sports2}
                                            // id={row?.id}
                                            // loadGridData={loadGridData}
                                            // setOpen={setOpen}
                                            // row={row.facilities}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow> */}

        </>
    )
}

export default Row
