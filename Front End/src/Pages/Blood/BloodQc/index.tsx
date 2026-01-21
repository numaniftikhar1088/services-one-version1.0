// Main component for the Blood QC module. Provides a tabbed interface for navigating between Blood QC Run History, Archived QC Runs, Blood QC Ranges, Deleted Controls, and QC Lots.
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import ArchivedQcRun from "./ArchivedQcRunTab";
import CoreQcRunHistory from "./CoreQCRunHistoryTab";
import SpecialPricing from "./DeletedControlsTab/Index";
import QcLotsTab from "./QcLots";
import CoreQcControls from "./CoreQcControlsTab";
import QcLevelIndex from "./QcLevel";
import QcGroupIndex from "./QcGroup";

// Custom styled Tab component for consistent styling
const TabSelected = styled(Tab)(AutocompleteStyle());

// Props for the TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component renders its children only if the current tab is selected
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

// Main component for the Blood QC tabbed interface
const InvoiceSetup: React.FC<{}> = () => {
  // State to track the currently selected tab
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      {/* Breadcrumb navigation */}
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid">
            {/* Tab navigation for Blood QC sections */}
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
                label="Core QC Run History"
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
              />
              <TabSelected
                label="Archived QC Runs"
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
              />
              <TabSelected
                label="Core QC Controls"
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
              />
              <TabSelected
                label="Deleted Controls"
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
              />
              <TabSelected
                label="QC Lots"
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
              />
              <TabSelected
                label="QC Level"
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
              />
              <TabSelected
                label="QC Group"
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
              />
            </Tabs>
            {/* Tab content for each Blood QC section */}
            <div className="card rounded-top-0 shadow-none tab-content-card">
              <div className="card-body py-2">
                <TabPanel value={value} index={0}>
                  <CoreQcRunHistory />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <ArchivedQcRun />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <CoreQcControls />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <SpecialPricing />
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <QcLotsTab />
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <QcLevelIndex />
                </TabPanel>
                <TabPanel value={value} index={6}>
                  <QcGroupIndex />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceSetup;
