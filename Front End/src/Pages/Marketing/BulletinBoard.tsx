import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { AutocompleteStyle } from "../../Utils/MuiStyles/AutocompleteStyles";
import PhysicianTab from "./bulletinBoard/Physician/PhysicianTab";
import SalesTab from "./bulletinBoard/Sales/SalesTab";
import { Nav } from "./Nav";
import useLang from "Shared/hooks/useLanguage";

/* TABS STARTS */

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

/* TABS END */

export const BulletinBoard: React.FC<{}> = () => {
  // TABS STATES START
  const { t } = useLang();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  // TABS STATES END

  return (
    <>
      <Nav />
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
                label={t("Physician")}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id={`Physician`}
              />
              <TabSelected
                label={t("Sales")}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`Sales`}
              />
            </Tabs>
            <div className="card rounded-top-0 shadow-none tab-content-card">
              <div className="card-body py-2">
                <TabPanel value={value} index={0}>
                  <PhysicianTab />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <SalesTab />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulletinBoard;
