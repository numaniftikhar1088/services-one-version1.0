import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import React from "react";
import { useLocation } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import DigitalCheckIn from "./DigitalCheckIn";
import ScanHistroyTable from "./ScanHistroyTable";
import PaperCheckIn from "./PaperCheckIn";
import PendingDataEntry from "./PendingDataEntry";

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
const BulkCheckIn = () => {
  const { t } = useLang();
  const location = useLocation();

  const [value, setValue] = React.useState(location?.state?.tab ?? 0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
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
            label={t("Digital Check In")}
            {...a11yProps(0)}
            className="fw-bold text-capitalize"
            id="DigitalCheckIn"
          />
          <TabSelected
            label={t("Scan History Table")}
            {...a11yProps(1)}
            className="fw-bold text-capitalize"
            id="ScanHistroyTable"
          />
          <TabSelected
            label="Paper Check In"
            {...a11yProps(2)}
            className="fw-bold text-capitalize"
            id="PaperCheckIn"
          />
          <TabSelected
            label="Pending Data Entry"
            {...a11yProps(3)}
            className="fw-bold text-capitalize"
            id="PendingDataEntry"
          />
        </Tabs>

        <TabPanel value={value} index={0}>
          <DigitalCheckIn />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ScanHistroyTable />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <PaperCheckIn />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <PendingDataEntry />
        </TabPanel>
      </div>
    </>
  );
};

export default BulkCheckIn;
