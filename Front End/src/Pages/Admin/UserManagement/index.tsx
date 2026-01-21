import { Collapse, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import useLang from "Shared/hooks/useLanguage";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import ArchivedUserListTab from "./ArchivedUserListTab";
import UserList from "./UserList";
import AddUser from "./UserList/AddUser";
import { useUserListContext } from "./UserListContext";

const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserManagement: React.FC<{}> = () => {
  const { t } = useLang();

  const [value, setValue] = React.useState(0);
  const {
    open,
    setOpen,
    editGridHeader,
    setDataAndErrors,
    errors,
    changeHandler,
    changeHandlerForNames,
    formData,
    handleSubmit,
    dropDownValues,
    GetDataAgainstRoles,
    GetDataAgainstRolesByUserId,
    onClose,
    checkboxes,
    setCheckboxes,
    ValidEmail,
    isEmailExistError,
    setAdminEmail,
    adminEmail,
  } = useUserListContext();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="app-toolbar py-3 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="app-container container-fluid">
        <Collapse in={open}>
          <AddUser
            modalheader={
              editGridHeader ? t("Edit Admin User") : t("Add Admin User")
            }
            editGridHeader={editGridHeader}
            setDataAndErrors={setDataAndErrors}
            errors={errors}
            changeHandler={changeHandler}
            changeHandlerForNames={changeHandlerForNames}
            formData={formData}
            handleSubmit={handleSubmit}
            dropDownValues={dropDownValues}
            UserGroupList={dropDownValues?.UserGroupList}
            AdminTypeList={dropDownValues?.AdminTypeList}
            GetDataAgainstRoles={GetDataAgainstRoles}
            GetDataAgainstRolesByUserId={GetDataAgainstRolesByUserId}
            setIsOpen={setOpen}
            isOpen={open}
            onClose={onClose}
            checkboxes={checkboxes}
            setCheckboxes={setCheckboxes}
            ValidEmail={ValidEmail}
            isEmailExistError={isEmailExistError}
            setAdminEmail={setAdminEmail}
            adminEmail={adminEmail}
          />
        </Collapse>
      </div>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid">
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{ style: { background: "transparent" } }}
              className="min-h-auto"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-scrollButtons": {
                  width: 0,
                  transition: "width 0.7s ease",
                  "&:not(.Mui-disabled)": {
                    width: "48px",
                  },
                },
              }}
            >
              <TabSelected
                label={t("User List")}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id={`UserList`}
              />
              <TabSelected
                label={t("Archived")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Archived`}
              />
            </Tabs>
            <div className="card rounded-top-0 shadow-none">
              <div className="card-body py-2">
                <TabPanel value={value} index={0}>
                  <UserList />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <ArchivedUserListTab />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
