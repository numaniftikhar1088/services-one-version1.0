import React from "react";
import useLang from './../../../../../../Shared/hooks/useLanguage';

const TableActionNav = () => {
  
  const {t} = useLang()
  // states for bulk actions
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // states for export button
  const [Export, setExport] = React.useState<null | HTMLElement>(null);
  const openButton = Boolean(Export);
  const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
    setExport(event.currentTarget);
  };
  const handleCloseButton = () => {
    setExport(null);
  };

  return (
    <>
      <div className="py-3 py-lg-2">
        <div className="mt-2 mb-2 col-xl-2 col-lg-2 col-md-2 col-sm-6 d-flex align-items-center gap-2">
          <span className="fw-400">{t("Records")}</span>
          <select
            className="form-select fa-1x h-35px py-2 w-125px text-truncate fw-400"
            data-kt-select2="true"
            data-placeholder="Select option"
            data-dropdown-parent="#kt_menu_63b2e70320b73"
            data-allow-clear="true"
          >
            <option>{t("Records")}</option>
            <option value="1">{t("5")}</option>
            <option value="2">{t("10")}</option>
            <option value="3">{t("50")}</option>
            <option value="4">{t("100")}</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default TableActionNav;
