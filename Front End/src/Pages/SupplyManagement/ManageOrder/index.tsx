import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import NewOrders from "./NewOrders";
import Rejected from "./Rejected";
import Shipped from "./Shipped";
import { useLocation } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";

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

const ManageOrder: React.FC<{}> = () => {
  const { t } = useLang();
  const [value, setValue] = React.useState(0);
  const location = useLocation();
  const { shipped } = location.state || {};
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    if (shipped === "shipped") {
      setValue(1);
    }
  }, [shipped]);
  return (
    <>
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
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
                label={t("New Orders")}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id={`NewOrder`}
              />
              <TabSelected
                label={t("Shipped")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Shiped`}
              />
              <TabSelected
                label={t("Rejected")}
                {...a11yProps(2)}
                className="fw-bold text-capitalize"
                id={`Rejected`}
              />
            </Tabs>
            <div className="card rounded-top-0 shadow-none">
              <div className="card-body py-2">
                <TabPanel value={value} index={0}>
                  <NewOrders />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Shipped />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Rejected />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageOrder;
