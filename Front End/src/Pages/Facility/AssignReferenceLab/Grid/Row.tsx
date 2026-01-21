import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import { Link } from 'react-router-dom'
import useLang from "Shared/hooks/useLanguage"
import { StyledDropButton, StyledDropMenuMoreAction } from '../../../../Utils/Style/Dropdownstyle'

export interface ITableObj {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: string
  npiNo: string
  username: string
  rowStatus: boolean | undefined
  userGroup: string
}
export interface AdditionalInfo {
  npi: string
}

const Row = () => {

  const { t } = useLang()

  // *********** Dropdown Function START ***********
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // *********** Dropdown Function End ***********
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <div className="d-flex justify-content-center">

            <StyledDropButton
              id="demo-positioned-button"
              aria-controls={openDrop ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openDrop ? 'true' : undefined}
              onClick={handleClick}
              className='btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4'
            >
              <i className="bi bi-three-dots-vertical p-0"></i>
            </StyledDropButton>
            <StyledDropMenuMoreAction
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={openDrop}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={handleClose} className=' w-200px p-0'>
                <Link className="text-dark w-100 h-100" to={`/edit-facility-user`} >
                  <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                  {t("Edit")}
                </Link>
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); }} className=' w-200px'>
                <i className="fa fa-trash text-danger mr-2" aria-hidden="true"></i>
                {t("Delete")}
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); }} className=' w-200px'>
                <i className="fa fa-ban text-danger mr-2"></i>
                {t("Inactive")}
              </MenuItem>

            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell component="th" scope="row">
          <span>{t("Truemedit")}</span>
        </TableCell>
        <TableCell component="th" scope="row">
          <span
          >
            {t("In-house")}
          </span>
        </TableCell>
        <TableCell component="th" scope="row">
          <span
          >{t("DTOXRNCL")}
          </span>
        </TableCell>
        <TableCell component="th" scope="row">

          <span
          >{t("Infectious Disease")}
          </span>
        </TableCell>
        <TableCell component="th" scope="row">
          <span
          >{t("Group-ID")}
          </span>
        </TableCell>
        <TableCell component="th" scope="row">
          <span
          >
            {t("Medicare")}
          </span>
        </TableCell>
        <TableCell component="th" scope="row">
          <span
          >
            {t("Male")}
          </span>
        </TableCell>
        <TableCell component="th" scope="row">
          <i className="fa fa-check text-danger"></i>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default Row;
