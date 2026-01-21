import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AxiosResponse } from "axios";
import FacilityService from "Services/FacilityService/FacilityService";
import { Loader } from "Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";

interface AssignedSalesRepProps {
  id: any;
}

const AssignedSalesRep: React.FC<AssignedSalesRepProps> = ({ id }) => {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);

  const fetchAssignedUsers = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse =
        await FacilityService.getSalesRepAssignedToFacility(id);
      setAssignedUsers(response?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" className="app-content flex-column-fluid pb-3">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <h6 className="my-2 mt-0 text-primary">{t("Assigned Sales Reps")}</h6>

          <div className="table_bordered overflow-hidden">
            <TableContainer
              component={Paper}
              className="shadow-none"
              sx={{
                maxHeight: "calc(100vh - 100px)",
                "&::-webkit-scrollbar": { width: 7 },
                "&::-webkit-scrollbar-track": { backgroundColor: "#fff" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "var(--kt-gray-400)",
                  borderRadius: 2,
                },
                "&:hover::-webkit-scrollbar-thumb": {
                  backgroundColor: "var(--kt-gray-400)",
                },
              }}
            >
              <Table
                stickyHeader
                aria-label="assigned users table"
                className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
              >
                <TableHead className="h-35px">
                  <TableRow>
                    {[
                      "First Name",
                      "Last Name",
                      "UserName",
                      "Email",
                      "Phone#",
                      "Sales Group",
                    ].map((label, idx) => (
                      <TableCell key={idx} className="min-w-200px">
                        {t(label)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Loader />
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignedUsers.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user?.firstName}</TableCell>
                        <TableCell>{user?.lastName}</TableCell>
                        <TableCell>{user?.userName}</TableCell>
                        <TableCell>{user?.email}</TableCell>
                        <TableCell>{user?.phoneNumber}</TableCell>
                        <TableCell>{user?.salesGroupName}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedSalesRep;
