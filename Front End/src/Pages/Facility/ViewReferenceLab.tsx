import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import useLang from "Shared/hooks/useLanguage";
import FacilityService from "../../Services/FacilityService/FacilityService";

interface Props {
  id: any;
}

const ViewReferenceLab: React.FC<Props> = ({ id }) => {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [UserList, setUserList] = useState([]);

  const loadData = () => {
    setLoading(true);
    FacilityService.getAssignedLabsagainstId(id).then(
      (result: AxiosResponse) => {
        setUserList(result?.data?.data);
        setLoading(false);
      }
    );
  };
  console.log(UserList, "UserList");

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" className="app-content flex-column-fluid pb-3">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <h6 className="my-2 mt-0 text-primary">{t("Assigned Labs")}</h6>
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
              // sx={{ maxHeight: 'calc(100vh - 100px)' }}
            >
              <Table
                stickyHeader
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
              >
                <TableHead className="h-35px">
                  <TableRow>
                    <TableCell
                      id={`ExpandManageFacilityProfileName`}
                      className="min-w-60px"
                    >
                      {t("Profile Name")}
                    </TableCell>
                    <TableCell
                      id={`ExpandManageFacilityLabName`}
                      className="min-w-60px"
                    >
                      {t("Lab Name")}
                    </TableCell>
                    <TableCell
                      id={`ExpandManageFacilityRequisitionType`}
                      className="min-w-60px"
                    >
                      {t("Requisition Type")}
                    </TableCell>
                    <TableCell
                      id={`ExpandManageFacilityGroups`}
                      className="min-w-60px"
                    >
                      {t("Groups")}
                    </TableCell>
                    <TableCell
                      id={`ExpandManageFacilityIsDefault`}
                      className="min-w-60px"
                    >
                      {t("IsDefault")}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {
                    // loading ? (
                    //   <TableCell colSpan={5} className="">
                    //     <Loader />
                    //   </TableCell>
                    // ) : (
                    UserList?.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell id={`ExpandprofileName-${index + 1}`}>
                          {item?.profileName}
                        </TableCell>
                        <TableCell id={`ExpandreferenceLabName-${index + 1}`}>
                          {item?.referenceLabName}
                        </TableCell>
                        <TableCell
                          id={`ExpandrequisitionTypeName-${index + 1}`}
                        >
                          {item?.requisitionTypeName}
                        </TableCell>
                        <TableCell id={`ExpandgroupNames-${index + 1}`}>
                          {item?.groupNames}
                        </TableCell>
                        <TableCell id={`ExpandisDefault-${index + 1}`}>
                          {item?.isDefault === true ? (
                            <i
                              className="fa fa-circle-check text-success mr-2 w-20px px-3"
                              aria-hidden="true"
                            ></i>
                          ) : (
                            <i
                              className="fa fa-ban text-danger mr-2 w-20px px-3"
                              aria-hidden="true"
                            ></i>
                          )}
                        </TableCell>
                      </TableRow>
                    ))

                    // )
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReferenceLab;
