import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ConvertUTCTimeToLocal } from "../../../Facility/FacilityApproval/FacilityListExpandableTable";
import { isJson } from "../../../../Utils/Common/Requisition";
import { Link } from "react-router-dom";
import { savePdfUrls } from "../../../../Redux/Actions/Index";
import { useDispatch } from "react-redux";
import { t } from "i18next";
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
const Files = (props: any) => {
  console.log(props.FileSection.fieldsInfo, "87675yghjk");
  const dispatch = useDispatch();
  const result = isJson(props.FileSection.fieldsInfo.defaultValue);
  let filesData: any;
  if (result) {
    filesData = JSON.parse(props.FileSection.fieldsInfo.defaultValue);
  }

  console.log(filesData, "fillllll");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs aria-label="basic tabs example">
            <Tab label={t("Uploaded Files")} sx={tabStyles} />
          </Tabs>
        </Box>
        <CustomTabPanel value={0} index={0}>
          <Box sx={{ height: "auto", width: "100%" }}>
            <div className="table_bordered overflow-hidden">
              <TableContainer
                sx={{
                  maxHeight: "calc(100vh - 100px)",
                  "&::-webkit-scrollbar": {
                    width: 7,
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#fff",
                  },
                  "&:hover": {
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "var(--kt-gray-400)",
                      borderRadius: 2,
                    },
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "var(--kt-gray-400)",
                    borderRadius: 2,
                  },
                }}
                component={Paper}
                className="shadow-none"
              >
                <Table
                  aria-label="sticky table collapsible"
                  className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                >
                  <TableHead className="h-40px">
                    <TableRow>
                      <TableCell className="min-w-300px w-300px">
                        {t("File")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filesData?.map((p: any) => (
                      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                        <TableCell>
                          <Link
                            to={`/docs-viewer`}
                            target="_blank"
                            onClick={() => {
                              dispatch(savePdfUrls(filesData.fileUrl));
                            }}
                          >
                            {filesData.fileName}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Box>
        </CustomTabPanel>
      </Box>
    </ThemeProvider>
  );
};

export default Files;
