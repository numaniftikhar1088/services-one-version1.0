import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { AxiosResponse } from "axios";
import CredentialRow from "./row";
import type {
  Credential,
  CredentialResponse,
  CredentialPayload,
} from "./types";
import useLang from "Shared/hooks/useLanguage";

import { Loader } from "Shared/Common/Loader";

import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { getCredentials, postCredentials } from "Services/HL7Integration";

const CredentialTab = () => {
  const { t } = useLang();
  const { id } = useParams(); // masterIntegrationId
  const masterIntegrationId = id ? parseInt(id, 10) : null;
  const queryClient = useQueryClient();

  // React Query Fetch credentials
  const { data: credentialsData, isLoading: loading } = useQuery<
    AxiosResponse<CredentialResponse>,
    Error,
    Credential[]
  >(
    ["credentials", masterIntegrationId],
    () => {
      if (!masterIntegrationId) {
        throw new Error("Master Integration ID is required");
      }
      return getCredentials(masterIntegrationId);
    },
    {
      enabled: !!masterIntegrationId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      onError: (error: any) => {
        console.error("Error fetching credentials", error);
        toast.error(
          error?.response?.data?.message || t("Error fetching credentials")
        );
      },
      select: (response: AxiosResponse<CredentialResponse>) => {
        const credentialResponse = response.data;
        const credentials = credentialResponse?.data?.credentials || [];
        return Array.isArray(credentials) ? credentials : [];
      },
    }
  );

  const saveCredentialMutation = useMutation(
    ({
      assignmentId,
      payload,
    }: {
      assignmentId: number;
      payload: CredentialPayload;
    }) => postCredentials(assignmentId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["credentials", masterIntegrationId]);
        toast.success(t("Saved successfully"));
      },
      onError: (error: any) => {
        console.error("Error saving credential:", error);
        const errorMessage =
          error?.response?.data?.message || t("Error saving credential");
        toast.error(errorMessage);
        throw new Error(errorMessage);
      },
    }
  );

  const headerCellStyles = {
    fontWeight: 600,
  };

  const initialPostData: Credential = {
    integrationConfigurationAssignmentID: 0,
    masterIntegrationID: 0,
    configTemplateName: "API",
    configType: "",
    configKey: "",
    configValue: "",
    controlType: "",
    isRequired: true,
    additionalValue: null,
    defaultValue: "",
    environmentType: "",
    direction: "InBound",
  };

  const [localCredentials, setLocalCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    if (credentialsData) {
      setLocalCredentials(credentialsData);
    }
  }, [credentialsData]);

  const displayData = localCredentials;

  const handleSaveCredential = async (row: Credential): Promise<void> => {
    const assignmentId = row.integrationConfigurationAssignmentID || 0;

    if (!masterIntegrationId && !row.masterIntegrationID) {
      throw new Error(t("Master Integration ID is required"));
    }

    const payload: CredentialPayload = {
      configValue: row.configValue?.trim() || "",
      defaultValue: row.defaultValue?.trim() || "",
      configKey: row.configKey?.trim() || "",
      masterIntegrationID: row.masterIntegrationID || masterIntegrationId!,
      configTemplateName: row.configTemplateName || "",
      configType: row.configType || "",
      controlType: row.controlType || "",
      isRequired: row.isRequired ?? true,
      environmentType: row.environmentType || "",
      additionalValue: row.additionalValue || null,
      direction: row.direction || "InBound",
    };

    await saveCredentialMutation.mutateAsync({ assignmentId, payload });
  };

  return (
    <>
      <div className="d-flex gap-2 flex-wrap"></div>
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center gap-2">
            <PermissionComponent
              moduleName="Integration"
              pageName="Credential"
              permissionIdentifier="Add"
            >
              <button
                id={`BloodLisTubeTypeAddNew`}
                className="btn btn-primary btn-sm btn-primary--icon px-7"
                onClick={() => {
                  const newRow: Credential = {
                    ...initialPostData,
                    masterIntegrationID: masterIntegrationId || 0,
                    integrationConfigurationAssignmentID: 0, // 0 indicates new row
                  };
                  setLocalCredentials((prevRows: Credential[]) => [
                    newRow,
                    ...prevRows,
                  ]);
                }}
                disabled={loading}
              >
                <i className="fa-solid fa-plus"></i>
                <span style={{ fontSize: 11 }}>{t("Add New Credential")}</span>
              </button>
            </PermissionComponent>
          </div>
        </div>
      </div>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

      <div className="card">
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
                // className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                className=" table table-bordered table-sticky-header table-bg table-vertical-center border-0 mb-0"
              >
                <TableHead
                  sx={{
                    "& .MuiTableCell-head": {
                      fontWeight: 500,
                      borderBottom: 0,
                      padding: "15px 19px !important",
                      fontSize: "14px !important",
                      lineHeight: "18px",
                      background: "#F3F6F9",
                      color: "#070910",
                      fontFamily: "Poppins",
                    },
                  }}
                >
                  {/* MuiTableCell-body */}
                  <TableRow className="h-30px">
                    <TableCell sx={headerCellStyles}>{t("Actions")}</TableCell>

                    <TableCell
                      sx={{ ...headerCellStyles, width: "max-content" }}
                    >
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Configuration Key")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ ...headerCellStyles, width: "max-content" }}
                    >
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Configuration Value")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ ...headerCellStyles, width: "max-content" }}
                    >
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Default Value")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ ...headerCellStyles, width: "max-content" }}
                    >
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Direction")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody
                  sx={{
                    "& .MuiTableCell-body": {
                      padding: "6px 16px !important",
                      fontWeight: 400,
                      fontSize: "14px !important",
                      lineHeight: "18px",
                      borderBottom: 0,
                      color: "#3F4254",
                      verticalAlign: "middle",
                    },
                  }}
                >
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="py-2">
                          <Loader />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : displayData.length ? (
                    displayData.map((row: Credential, index: number) => (
                      <CredentialRow
                        row={row}
                        key={
                          row.integrationConfigurationAssignmentID ||
                          `new-${index}`
                        }
                        setApiGetData={setLocalCredentials}
                        onSave={handleSaveCredential}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("No records found")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
    </>
  );
};

export default CredentialTab;
