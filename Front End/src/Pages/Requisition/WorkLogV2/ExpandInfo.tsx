import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import NoRecord from "Shared/Common/NoRecord";
// import { t } from '../../../Shared/hooks/useLanguage'
import useLang from "Shared/hooks/useLanguage";

interface TestingInfo {
  testName: string;
  specimenType: string;
}

function ExpandInfo(props: any) {
  const [data, setData] = useState<any>();
  const { t } = useLang();

  const getPatientReqOrder = async () => {
    const response = await RequisitionType.workLogExpandInfo(props.reqOrderId);
    if (response?.data?.data) {
      setData(response?.data?.data);
    }
  };

  useEffect(() => {
    getPatientReqOrder();
  }, []);
  return (
    <div className="row">
      <div className="col-lg-6 mb-5">
        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header min-h-35px d-flex justify-content-between align-items-center py-3">
            <h6 className="m-0 fs-4">{t("Patient Information")}</h6>
          </div>
          <div className="card-body py-md-4 py-3">
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("First Name")}</p>
              <p>{data?.patientInfo?.firstName}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("Last Name")}</p>
              <p>{data?.patientInfo?.lastName}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("Date of Birth")}</p>
              <p>
                {data?.patientInfo?.dob &&
                  moment(data?.patientInfo?.dob, "YYYY-MM-DD").format(
                    "MM-DD-YYYY"
                  )}
              </p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("Address")}</p>
              <p>{data?.patientInfo?.address}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("City")}</p>
              <p>{data?.patientInfo?.city}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("State")}</p>
              <p>{data?.patientInfo?.state}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("Zip Code")}</p>
              <p>{data?.patientInfo?.zipCode}</p>
            </div>
          </div>
        </div>
      </div>
      <div className=" col-lg-6 mb-5">
        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header min-h-35px d-flex justify-content-between align-items-center py-3">
            <h6 className="m-0 fs-4">{t("Facility Information")}</h6>
          </div>
          <div className="card-body py-md-4 py-3">
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("Name")}</p>
              <p>{data?.facilityInfo?.facilityName}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("Provider")}</p>
              <p>{data?.facilityInfo?.providerName}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("NPI")}</p>
              <p>{data?.facilityInfo?.npi}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("Address")}</p>
              <p>{data?.facilityInfo?.address}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("City")}</p>
              <p>{data?.facilityInfo?.city}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("State")}</p>
              <p>{data?.facilityInfo?.state}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="mb-3">{t("Zip Code")}</p>
              <p>{data?.facilityInfo?.zipCode}</p>
            </div>
          </div>
        </div>
      </div>
      <div className=" col-lg-6 mb-5">
        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header min-h-35px d-flex justify-content-between align-items-center py-3">
            <h6 className="m-0 fs-4">{t("Testing Information")}</h6>
          </div>
          <div className="card-body py-md-4 py-3">
            {data?.testingInfos?.map((info: TestingInfo, index: number) => (
              <div
                className="d-flex justify-content-between gap-10"
                key={index}
              >
                <p className="mb-3">{info.testName}</p>
                <p>{info.specimenType}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" col-lg-6 mb-5">
        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header min-h-35px d-flex justify-content-between align-items-center py-3">
            <h6 className="m-0 fs-4">{t("Status Update")}</h6>
          </div>
          <div className="align-items-center card-header min-h-35px d-flex justify-content-center justify-content-sm-between gap-1 mt-5 pb-5">
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
                  className="shadow-none"
                >
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header plate-mapping-table table-bg table-head-custom table-vertical-center border-0 mb-0 "
                  >
                    <TableHead style={{ zIndex: 0 }}>
                      <TableRow className="h-40px">
                        <TableCell>{t("Status")}</TableCell>
                        <TableCell>{t("Staus Note")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.statusUpdates ? (
                        <TableRow className="h-40px">
                          <TableCell>{data?.statusUpdates.status}</TableCell>
                          <TableCell>{data?.statusUpdates.stausNote}</TableCell>
                        </TableRow>
                      ) : (
                        <NoRecord />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpandInfo;
