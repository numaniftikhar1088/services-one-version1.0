import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import { BloodCompendiumDataNav } from './BloodCompendiumDataNav';
import { PanelSetup } from './PanelSetup/PanelSetup';
import { TestSetup } from './TestSetup/TestSetup';
import useLang from './../../../Shared/hooks/useLanguage';


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

const BloodCompendiumData: React.FC<{}> = () => {
  const { t } = useLang()
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <BloodCompendiumDataNav />
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { background: "transparent" } }}
            className='min-h-auto'
          >
            <TabSelected
              label={t("Panel Setup")}
              {...a11yProps(0)}
              className="fw-bold text-capitalize"
            />
            <TabSelected
              label={t("Test Setup")}
              {...a11yProps(1)}
              className="fw-bold text-capitalize"
            />
          </Tabs>
          <div className="card rounded-top-0 shadow-none">
            <div className="card-body px-3 px-md-8">
              <TabPanel value={value} index={0}>
                <PanelSetup />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <TestSetup />
              </TabPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BloodCompendiumData;