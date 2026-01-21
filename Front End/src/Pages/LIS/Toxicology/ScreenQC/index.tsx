import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import useLang from "Shared/hooks/useLanguage";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import ArchivedQCRuns from "./ArchivedQCRuns";
import QCRunsHistory from "./QCRunsHistory";
import ToxQCControls from "./ToxQCControls";
import ArchivedQCControls from "./ArchivedQCControls";
import QCLots from "./QCLots";
import ArchivedQCLots from "./ArchivedQCLots";
import ErrorLog from "./ErrorLog";
import QCLevel from "./QCLevel";

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

const ScreenQC: React.FC<{}> = () => {
  const { t } = useLang();
  const [value, setValue] = React.useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs
            // useStatic={true}
            // staticBreadcrumbs={[{ name: "Tox List" }, { name: "Screen QC" }]}
          />
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
                label={t("Tox QC Run History")}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id={`ReadyToShip`}
              />
              <TabSelected
                label={t("Archived QC Runs")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Shipped`}
              />
              <TabSelected
                label={t("Tox QC Controls")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Shipped`}
              />
              <TabSelected
                label={t("Archived QC Controls")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Shipped`}
              />
              <TabSelected
                label={t("QC Lots")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Shipped`}
              />
              <TabSelected
                label={t("Archived QC Lots")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Shipped`}
              />
              <TabSelected
                label={t("Error Log")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Shipped`}
              />
              <TabSelected
                label={t("QC Level")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Shipped`}
              />
            </Tabs>
            <div className="card rounded-top-0 shadow-none">
              <div className="card-body py-2">
                <TabPanel value={value} index={0}>
                  <QCRunsHistory />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <ArchivedQCRuns />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <ToxQCControls />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <ArchivedQCControls />
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <QCLots />
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <ArchivedQCLots />
                </TabPanel>
                <TabPanel value={value} index={6}>
                  <ErrorLog />
                </TabPanel>
                <TabPanel value={value} index={7}>
                  <QCLevel />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenQC;
