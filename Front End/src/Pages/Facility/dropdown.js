import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import ArrowBottomIcon from '../../Shared/SVG/ArrowBottomIcon';
import { StyledDropButton, StyledDropMenu } from '../../Utils/Style/Dropdownstyle';
import useLang from './../../Shared/hooks/useLanguage';


export default function PositionedMenu() {
  const { t } = useLang()
  //   const [anchorEl, setAnchorEl] = React.useState(null);
  //   const openDrop = Boolean(anchorEl);
  //   const handleClick = (event) => {
  //     setAnchorEl(event.currentTarget);
  //   };
  //   const handleClose = () => {
  //     setAnchorEl(null);
  //   };
  const [anchorEl, setAnchorEl] = React.useState({ dropdown1: null, dropdown2: null });
  const openDrop = Boolean(anchorEl.dropdown1) || Boolean(anchorEl.dropdown2);

  const handleClick = (event, dropdownName) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  return (
    <>

      {/* <div>
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
        <MenuItem onClick={handleClose} className=' w-200px'>
            <i className="fa fa-pause text-danger mr-2  w-20px"></i>
            Suspend
        </MenuItem>
        <MenuItem onClick={handleClose} className=' w-200px'>
            <i className="fa fa-ban text-danger mr-2  w-20px"></i>
            Inactive
        </MenuItem>
      </StyledDropMenuMoreAction>
    </div> */}


      <div>
        <StyledDropButton
          id="demo-positioned-button1"
          aria-controls={openDrop ? 'demo-positioned-menu1' : undefined}
          aria-haspopup="true"
          aria-expanded={openDrop ? 'true' : undefined}
          onClick={(event) => handleClick(event, 'dropdown1')}
          className='btn btn-info btn-sm'
        >
          {t("bulk action")}
          <span className="svg-icon svg-icon-5 m-0">
            <ArrowBottomIcon />
          </span>
        </StyledDropButton>
        <StyledDropMenu
          id="demo-positioned-menu1"
          aria-labelledby="demo-positioned-button1"
          anchorEl={anchorEl.dropdown1}
          open={Boolean(anchorEl.dropdown1)}
          onClose={() => handleClose('dropdown1')}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => handleClose('dropdown1')} className=' w-200px'>
            <i className="fa fa-pause text-danger mr-2  w-20px"></i>
            {t("Suspend")}
          </MenuItem>
          <MenuItem onClick={() => handleClose('dropdown1')} className=' w-200px'>
            <i className="fa fa-ban text-danger mr-2  w-20px"></i>
            {t("Inactive")}
          </MenuItem>
        </StyledDropMenu>
      </div>

      <div>
        <StyledDropButton
          id="demo-positioned-button2"
          aria-controls={openDrop ? 'demo-positioned-menu2' : undefined}
          aria-haspopup="true"
          aria-expanded={openDrop ? 'true' : undefined}
          onClick={(event) => handleClick(event, 'dropdown2')}
          className='btn btn-excle btn-sm'
        >
          <i
            style={{ color: "white", fontSize: "20px", paddingLeft: "2px" }}
            className="fa"
          >
            &#xf1c3;
          </i>
          <span className="svg-icon svg-icon-5 m-0">
            <ArrowBottomIcon />
          </span>
        </StyledDropButton>
        <StyledDropMenu
          id="demo-positioned-menu2"
          aria-labelledby="demo-positioned-button2"
          anchorEl={anchorEl.dropdown2}
          open={Boolean(anchorEl.dropdown2)}
          onClose={() => handleClose('dropdown2')}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => handleClose('dropdown2')}>
            <i className="fa text-excle mr-2  w-20px">&#xf1c3;</i>
            {t("Export All Records")}
          </MenuItem>
          <MenuItem onClick={() => handleClose('dropdown2')}>
            <i className="fa text-success mr-2 w-20px">&#xf15b;</i>
            {t("Export Selected Records")}
          </MenuItem>
        </StyledDropMenu>
      </div>

    </>
  );
}