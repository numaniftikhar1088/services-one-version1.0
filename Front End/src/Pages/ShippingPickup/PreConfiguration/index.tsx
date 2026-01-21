import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import Default from "./Default";
import FedEx from "./FedEx";
import Ups from "./Ups";
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

const PreConfiguration: React.FC<{}> = () => {
  const { t } = useLang();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  return (
    <div className="container-fluid px-10 py-5">
      <div className="pb-5">
        <BreadCrumbs />
      </div>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-content flex-column-fluid">
          <Tabs
            value={tabIndex}
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
              label={t("UPS")}
              {...a11yProps(0)}
              className="fw-bold text-capitalize"
              id={`UPS`}
            />
            <TabSelected
              label={t("FedEx")}
              {...a11yProps(1)}
              className="fw-bold text-capitalize"
              id={`FedEx`}
            />
            <TabSelected
              label={t("Default")}
              {...a11yProps(2)}
              className="fw-bold text-capitalize"
              id={`Default`}
            />
          </Tabs>
          <div className="card rounded-top-0 shadow-none">
            <TabPanel value={tabIndex} index={0}>
              <Ups />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <FedEx />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <Default />
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreConfiguration;
