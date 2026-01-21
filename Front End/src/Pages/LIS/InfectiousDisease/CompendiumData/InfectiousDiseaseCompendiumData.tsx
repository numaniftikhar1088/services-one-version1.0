import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { AutocompleteStyle } from "../../../../Utils/MuiStyles/AutocompleteStyles";
import { AssayData } from "./AssayData/AssayData";
import ControlReportingRules from "./ControlReportingRules/index";
import { Nav } from "./Nav";
import PanelMapping from "./PanelMapping/PanelMaping";
import PanelReportingRules from "./PanelReportingRules";
import PharmDPreference from "./PharmDPreference";
import ReflexRule from "./ReflexRule";
import AOEForId from "./AOEForID/PanelMaping";
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

const InfectiousDiseaseCompendiumData = () => {
  const { t } = useLang();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [refresh, setRefresh] = React.useState(false);
  console.log(refresh, "refresh");

  return (
    <>
      <Nav setRefresh={setRefresh} refresh={refresh} />
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
                label={t("Panel Mapping")}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id="PanelMaping"
              />
              <TabSelected
                label={t("Assay Data")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id="AssayData"
              />
              <TabSelected
                label={t("Panel Reporting Rules")}
                {...a11yProps(2)}
                className="fw-bold text-capitalize"
                id="PanelReportingRule"
              />
              <TabSelected
                label={t("Control Reporting Rules")}
                {...a11yProps(3)}
                className="fw-bold text-capitalize"
                id="ControlReportingRule"
              />
              <TabSelected
                label={t("PharmD Preference")}
                {...a11yProps(4)}
                className="fw-bold text-capitalize"
                id="PharmDPreference"
              />
              <TabSelected
                label={t("Reflex Rule")}
                {...a11yProps(5)}
                className="fw-bold text-capitalize"
                id="ReflexRule"
              />
              <TabSelected
                label={t("AOE for ID")}
                {...a11yProps(6)}
                className="fw-bold text-capitalize"
                id="AOEForID"
              />
            </Tabs>
            <div className="card rounded-top-0 shadow-none">
              <div className="card-body py-2">
                <TabPanel value={value} index={0}>
                  <PanelMapping setRefresh={setRefresh} refresh={refresh} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <AssayData />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <PanelReportingRules />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <ControlReportingRules />
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <PharmDPreference />
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <ReflexRule />
                </TabPanel>
                <TabPanel value={value} index={6}>
                  <AOEForId />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfectiousDiseaseCompendiumData;
