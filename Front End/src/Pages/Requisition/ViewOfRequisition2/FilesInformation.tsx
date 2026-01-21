import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UploadedFiles from "./UploadedFiles";
import DeleatedFiles from "./DeleatedFiles";
import { Tooltip, styled } from "@mui/material";
const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
    },
  },
});
const tabStyles = {
  textTransform: "capitalize",
  fontWeight: "bold",
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const Files = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="m-0">Files</h3>
            <div>
              <div>
                <Tooltip title="upload" arrow placement="top">
                  <button
                    className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                    aria-label="Download"
                    data-mui-internal-clone-element="true"
                  >
                    <i className="bi bi-upload"></i>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="card-body py-md-4 py-3">
            <ThemeProvider theme={theme}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Uploaded Files" sx={tabStyles} />
                    <Tab label="Deleted Files" sx={tabStyles} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <UploadedFiles />
                </CustomTabPanel>
              </Box>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Files;
