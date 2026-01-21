import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { memo, useState } from 'react'
import Select from 'react-select'
import {
  CrossIcon,
  DoneIcon,
  LoaderIcon,
  ThreeDots
} from '../../../Shared/Icons'
import { styles } from '../../../Utils/Common'

import { Dropdown, DropdownButton } from 'react-bootstrap'
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent'
import useLang from "Shared/hooks/useLanguage";
export interface ITableObj {
  id: number
  qccontrolName: string
  panelName: string
  panelId: number | null
  labName: string
  labId: number | null
  isActive: boolean
  rowStatus: boolean
}

const Row = (props: {
  row: ITableObj
  rows: any
  setRows: any
  index: number
  dropDownValues: any
  handleChange: Function
  handleSubmit: Function
  loadGridData: any
  setErrors: any
  errors: any
  request: any
  setRequest: any
  check: any
  setCheck: any
  setShow1: any
  handleClickOpen: any
  setIsAddButtonDisabled: any
  isButtonDisabled: any
  handleIsActive: any
  ChangeStatus: any
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    handleSubmit,
    loadGridData,
    setErrors,
    errors,
    request,
    setRequest,
    check,
    setCheck,
    setShow1,
    handleClickOpen,
    setIsAddButtonDisabled,
    isButtonDisabled,
    handleIsActive,
    ChangeStatus,
  } = props

  const { t } = useLang()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = useState(false)
  const getValues = (r: any) => {
    const updatedRows = rows.map((row: any) => {
      if (row.id === r.id) {
        return { ...row, rowStatus: true }
      }
      return row
    })
    setRows(updatedRows)
  }
  //
  //
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request && check ? (
                    <button className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px">
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubmit(row)}
                      disabled={isButtonDisabled}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (row.id != 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.id === row.id) {
                            return { ...r, rowStatus: false }
                          }
                          return r
                        })
                        setRows(updatedRows)
                        loadGridData(true, false)
                      } else {
                        let newArray = [...rows]
                        newArray.splice(index, 1)
                        setRows(newArray)
                        setErrors(false)
                        setRequest(false)
                        setIsAddButtonDisabled(false)
                      }
                    }}
                    className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <CrossIcon />
                  </button>
                </div>
              </>
            ) : (
              // <DropdownButton
              //   getValues={getValues}
              //   iconArray={QCBatchSetupActionsArray}
              //   row={row}
              // />
              <div className='rotatebtnn'>
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id="dropdown-button-drop-end"
                  drop="end"
                  title={<ThreeDots />}
                >
                  <>
                    {row?.isActive === true ? (
                      <>
                        {/* <Dropdown.Item eventKey="1">
                        <div
                          className="menu-item px-3"
                          onClick={() => getValues(row)}
                        >
                          <span className="text-dark w-100 h-100">
                            <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                            Edit
                          </span>
                        </div>
                      </Dropdown.Item> */}
                        {/* <PermissionComponent
                          pageName="QC Batch Setup"
                          permissionIdentifier="Inactive"
                        > */}
                          <Dropdown.Item eventKey="1">
                            <div
                              className="menu-item px-3"
                              onClick={() => ChangeStatus(row?.id)}
                            >
                              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                              {t("InActive")}
                            </div>
                          </Dropdown.Item>
                        {/* </PermissionComponent> */}
                      </>
                    ) : (
                      // <PermissionComponent
                      //   pageName="QC Batch Setup"
                      //   permissionIdentifier="Active"
                      // >
                        <Dropdown.Item eventKey="1">
                          <div
                            className="menu-item px-3"
                            onClick={() => ChangeStatus(row?.id)}
                          >
                            <i className="fa fa-check-circle text-success mr-2 w-20px"></i>
                            {t("Active")}
                          </div>
                        </Dropdown.Item>
                      // </PermissionComponent>
                    )}
                  </>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell scope="row">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  type="text"
                  name="qccontrolName"
                  className="form-control bg-transparent mb-3 mb-lg-0"
                  placeholder={t("QC Name")}
                  value={row?.qccontrolName}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.qccontrolName}
            </span>
          )}
        </TableCell>

        <TableCell align="left">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  menuPortalTarget={document.body}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.PanelList}
                  onChange={(event: any) =>
                    handleChange('panelId', event.value, row?.id)
                  }
                  value={dropDownValues?.PanelList.filter(function (
                    option: any,
                  ) {
                    return option.value === row?.panelId
                  })}
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.panelName}
            </span>
          )}
        </TableCell>
        <TableCell align="left">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  menuPortalTarget={document.body}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.LabList}
                  onChange={(event: any) =>
                    handleChange('labId', event.value, row?.id)
                  }
                  value={dropDownValues?.LabList.filter(function (option: any) {
                    return option.value === row?.labId
                  })}
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.labName}
            </span>
          )}
        </TableCell>
        {row?.rowStatus ? (
          <TableCell>
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isActive"
                  checked={row?.isActive}
                  onChange={(event: any) => handleIsActive(event, row.id)}
                />
              </div>
            </div>
          </TableCell>
        ) : (
          <TableCell>
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isActive"
                  checked={row?.isActive}
                  disabled={true}
                />
              </div>
            </div>
          </TableCell>
        )}
      </TableRow>
    </React.Fragment>
  )
}

export default memo(Row)
