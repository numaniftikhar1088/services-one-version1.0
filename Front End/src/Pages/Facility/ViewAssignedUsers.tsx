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
import { Loader } from "../../Shared/Common/Loader";

interface Props {
  id: any;
}
const ViewAssignedUsers: React.FC<Props> = ({ id }) => {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [UserList, setUserList] = useState<any>([]);
  const loadData = () => {
    setLoading(true);
    FacilityService.getUsersAssignedToFacility(id).then(
      (result: AxiosResponse) => {
        setUserList(result?.data?.data);
        setLoading(false);
      }
    );
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div id="kt_app_content" className="app-content flex-column-fluid pb-3">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <h6 className="my-2 mt-0 text-primary">{t("Assigned Users")}</h6>
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
                  stickyHeader
                  aria-label="sticky table collapsible"
                  className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                >
                  <TableHead className="h-35px">
                    <TableRow>
                      <TableCell
                        id={`ManageFacilityAsignUser1stName`}
                        className="min-w-200px"
                      >
                        {t("First Name")}
                      </TableCell>
                      <TableCell
                        id={`ManageFacilityAsignUserLastName`}
                        className="min-w-200px"
                      >
                        {t("Last Name")}
                      </TableCell>
                      <TableCell
                        id={`ManageFacilityAsignUserUserRole`}
                        className="min-w-200px"
                      >
                        {t("User Role")}
                      </TableCell>
                      <TableCell
                        id={`ManageFacilityAsignUserUserName`}
                        className="min-w-200px"
                      >
                        {t("UserName")}
                      </TableCell>
                      <TableCell
                        id={`ManageFacilityAsignUserEmail`}
                        className="min-w-200px"
                      >
                        {t("Email")}
                      </TableCell>
                      <TableCell
                        id={`ManageFacilityAsignUserPhoneNumber`}
                        className="min-w-200px"
                      >
                        {t("Phone#")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableCell colSpan={5}>
                        <Loader />
                      </TableCell>
                    ) : (
                      UserList?.users?.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell id={`Expand1stName-${index + 1}`}>
                            {item?.firstName}
                          </TableCell>
                          <TableCell id={`ExpandLastName-${index + 1}`}>
                            {item?.lastName}
                          </TableCell>
                          <TableCell id={`ExpandUserRole-${index + 1}`}>
                            {item?.userRole}
                          </TableCell>
                          <TableCell id={`ExpandUserName-${index + 1}`}>
                            {item?.username}
                          </TableCell>
                          <TableCell id={`ExpandEmail-${index + 1}`}>
                            {item?.email}
                          </TableCell>
                          <TableCell id={`ExpandPhoneNumber-${index + 1}`}>
                            {item?.phoneNo}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <h6 className="my-2 mt-0 text-primary mt-5 mt-md-5">
              {t("Facility Options")}
            </h6>
            <div className="card-body py-md-0 py-0">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                <div className="row mt-3">
                  {UserList?.facilityOptions?.map((item: any) => (
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 ">
                      {item?.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAssignedUsers;
