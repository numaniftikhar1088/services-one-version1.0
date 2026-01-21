import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper } from "@mui/material";
import Base64Image from "../../../Shared/Base64toImage";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { extractDatePattern } from "../../Facility/FacilityApproval/FacilityListExpandableTable";
import PanelCode from "./PanelCode";

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
function parseJsonString(jsonString: string) {
  try {
    const jsonObject = JSON.parse(jsonString);
    return jsonObject;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
interface SectionConfig {
  title: string;
  fields?: Array<{
    label: string;
    value: string | any;
    className: string;
  }>;
  className?: string;
  sections?: SectionConfig[];
  classNameinnerSec: string;
  check: string;
  fieldvalue: string | undefined;
}
export interface DynamicSectionProps {
  config: SectionConfig;
}
const DynamicSection: React.FC<DynamicSectionProps> = ({ config }) => {
  

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  function Parseastring(): any[] | null {
    if (config.fieldvalue === "files") {
      return parseJsonString(config.check);
    }
    return null;
  }
  const parsedObject: any = Parseastring();

  return (
    <div className={config.className}>
      <div className="card shadow mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="m-0">{config.title}</h3>
        </div>

        <div className="card-body py-md-4 py-3">
          {config.title === "Diagnosis/ICD10 Codes" ? (
            <>
              <h6 className="text-primary">Diagnosis Code(s)</h6>
              <PanelCode dataArray={config.fields} />
            </>
          ) : config.title === "Physician Signature" ||
            config.title === "Patient Signature" ? (
            <>
              <Base64Image base64String={config.fieldvalue} />
            </>
          ) : config.fieldvalue === "files" ? (
            <>
              <ThemeProvider theme={theme}>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab label="Uploaded Files" sx={tabStyles} />
                    </Tabs>
                  </Box>
                  <CustomTabPanel value={value} index={0}>
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
                                  File
                                </TableCell>
                                <TableCell className="min-w-150px w-150px">
                                  Document Type
                                </TableCell>
                                <TableCell className="min-w-150px w-150px">
                                  Date & Time
                                </TableCell>
                                <TableCell className="min-w-150px w-150px">
                                  Email
                                </TableCell>
                                <TableCell className="min-w-150px w-150px">
                                  Resend Result
                                </TableCell>
                                <TableCell className="min-w-150px w-150px">
                                  SMS
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {parsedObject.map((p: any) => (
                                <TableRow
                                  sx={{ "& > *": { borderBottom: "unset" } }}
                                >
                                  <TableCell>
                                    <a href={p.FilePath} target="_blank">
                                      {p.Name}
                                    </a>
                                  </TableCell>
                                  <TableCell>{p.FileType}</TableCell>
                                  <TableCell>
                                    {extractDatePattern(p.CreateDate)}
                                  </TableCell>
                                  <TableCell>
                                    <a
                                      href={p.FilePath}
                                      className="btn btn-sm fw-bold btn-info rounded-3"
                                    >
                                      <span>Resend &amp; Email</span>
                                    </a>
                                  </TableCell>
                                  <TableCell>
                                    <a
                                      href={p.FilePath}
                                      className="btn btn-success btn-sm fw-bold search d-block"
                                    >
                                      <span>Resend &amp; Fax</span>
                                    </a>
                                  </TableCell>
                                  <TableCell>
                                    <a
                                      href={p.FilePath}
                                      className="btn btn-success btn-sm fw-bold search d-block"
                                    >
                                      <span>Resend &amp; SMS</span>
                                    </a>
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
            </>
          ) : (
            <>
              {config.fields &&
                config.fields.map((field, index) => (
                  <div key={index}>
                    <div className={field.className}>
                      <span>{field.label === "Panel" ? "" : field.label}</span>
                      <span
                        className={
                          config.check === "Panel"
                            ? config.classNameinnerSec
                            : "fw-500 row"
                        }
                      >
                        {field.value}
                      </span>
                    </div>
                  </div>
                ))}
            </>
          )}
          <div className="row">
            {config.sections &&
              config.sections.map((section, index) => (
                <DynamicSection key={index} config={section} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DynamicSection;
