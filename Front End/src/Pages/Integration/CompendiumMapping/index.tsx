import React, { useEffect, useMemo, useState } from "react";
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
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import CompendiumMappingRow from "./row";
import InsuranceRow from "./insuranceRow";
import CompendiumRow from "./compendiumRow";
import { Loader } from "Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";
import {
  getCompendiumData,
  facilityLookup,
  getInsuranceTypes,
  getInsuranceNames,
  postFacilities,
  putFacilities,
  deleteFacility,
  postInsurance,
  putInsurance,
  deleteInsurance,
} from "Services/HL7Integration";

const CompendiumMappingTab = () => {
  const { t } = useLang();
  const { id } = useParams();
  const masterIntegrationId = id ? parseInt(id, 10) : null;
  const queryClient = useQueryClient();

  // ===== React Query: Facility lookup for dropdown =====
  const { data: facilityLookupData } = useQuery(
    ["facilityLookup"],
    () => facilityLookup(),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      select: (response) => {
        const payload = response?.data ?? {};
        const facilities =
          payload?.data?.facilities ??
          payload?.facilities ??
          payload?.data ??
          [];

        return Array.isArray(facilities) ? facilities : [];
      },
      onError: (error: any) => {
        console.error("Error fetching facility lookup:", error);
        toast.error(
          error?.response?.data?.message || t("Error fetching facilities")
        );
      },
    }
  );

  // Transform facilities data for react-select dropdown
  const facilityOptions = useMemo(() => {
    if (!Array.isArray(facilityLookupData) || !facilityLookupData.length) {
      return [];
    }

    return facilityLookupData.map((facility: any) => ({
      value: facility.facilityId,
      label: facility.facilityName,
    }));
  }, [facilityLookupData]);

  const formatFacilities = (facilities: any[]) =>
    facilities.map((facility) => ({
      ...facility,
      rowStatus: false,
      isNew: false,
    }));

  const formatInsurances = (insurances: any[]) =>
    insurances.map((insurance, idx) => ({
      ...insurance,
      id: insurance.id ?? idx + 1,
      rowStatus: false,
      isNew: false,
      // externalInsCode from backend is our mappedInsurance
      mappedInsurance:
        insurance.mappedInsurance ?? insurance.externalInsCode ?? "",
      // insuranceTypeId will be resolved later using the type lookup
      insuranceTypeId: insurance.insuranceTypeId ?? null,
      insuranceType: insurance.insuranceType ?? "",
      // insuranceID from backend is actually the insurance name ID,
      // so store it on insuranceId so the dropdown can select the current name
      insuranceId: insurance.insuranceID ?? insurance.insuranceId ?? null,
      name: insurance.name ?? insurance.insuranceName ?? "",
    }));

  const formatCompendiums = (compendiums: any[]) =>
    compendiums.map((compendium, idx) => ({
      ...compendium,
      id: compendium.id ?? idx + 1,
      rowStatus: false,
      isNew: false,
      panelName: compendium.panelName ?? "",
      panelNameId: compendium.panelNameId ?? null,
      externalPanelName: compendium.externalPanelName ?? "",
      externalPanelCode: compendium.externalPanelCode ?? "",
      testName: compendium.testName ?? "",
      testNameId: compendium.testNameId ?? null,
      externalTestName: compendium.externalTestName ?? "",
      externalTestCode: compendium.externalTestCode ?? "",
      requisitionType: compendium.requisitionType ?? "",
    }));

  const [rows, setRows] = useState<any[]>([]);
  const [insuranceRows, setInsuranceRows] = useState<any[]>([]);
  const [compendiumRows, setCompendiumRows] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("facilities");

  // React Query: Fetch compendium data (facilities + compendiums)
  const {
    data: compendiumData,
    isLoading: compendiumLoading,
    isFetching: isCompendiumFetching,
  } = useQuery(
    ["compendium", masterIntegrationId],
    () => {
      if (!masterIntegrationId) {
        throw new Error("Master Integration ID is required");
      }
      return getCompendiumData(masterIntegrationId);
    },
    {
      enabled: !!masterIntegrationId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      select: (response) => {
        const data = response?.data?.data || response?.data || {};
        // Extract all properties dynamically from backend response
        const result: Record<string, any[]> = {};
        
        // Get all keys from backend response and include them
        Object.keys(data).forEach((key) => {
          if (Array.isArray(data[key])) {
            result[key] = data[key];
          }
        });
        
        return result;
      },
      onError: (error: any) => {
        console.error("Error fetching compendium data:", error);
        toast.error(
          error?.response?.data?.message || t("Error fetching compendium data")
        );
      },
      
    }
  );

  // Tab key to label mapping for known tabs
  const tabLabelMap: Record<string, string> = useMemo(
    () => ({
      facilities: t("Facilities"),
      insurances: t("Insurances"),
      compendiums: t("Compendiums"),
    }),
    [t]
  );

  // Dynamic tabs based on backend response - extract all keys from backend
  const availableTabs = useMemo(() => {
    if (!compendiumData) return [];
    
    // Get all keys from backend response
    const backendKeys = Object.keys(compendiumData);
    
    // Create tabs dynamically
    return backendKeys.map((key) => ({
      key,
      label: tabLabelMap[key] || key.charAt(0).toUpperCase() + key.slice(1), // Use mapped label or capitalize key
    }));
  }, [compendiumData, tabLabelMap]);

  const headerCellStyles = {
    fontWeight: 600,
  };

  const getRowKey = (row: any) => row.id ?? row.tempId;
  const [rowDrafts, setRowDrafts] = useState<Record<string | number, any>>({});
  const [rowErrors, setRowErrors] = useState<
    Record<string | number, { facilityName?: string; emrId?: string }>
  >({});
  const [savingRowId, setSavingRowId] = useState<string | number | null>(null);

  const [insuranceRowDrafts, setInsuranceRowDrafts] = useState<
    Record<
      string | number,
      {
        insuranceTypeId?: number | null;
        insuranceId?: number | null;
        mappedInsurance?: string;
      }
    >
  >({});
  const [insuranceRowErrors, setInsuranceRowErrors] = useState<
    Record<
      string | number,
      {
        insuranceType?: string;
        insuranceName?: string;
        mappedInsurance?: string;
      }
    >
  >({});
  const [savingInsuranceRowId, setSavingInsuranceRowId] = useState<
    string | number | null
  >(null);

  const [compendiumRowDrafts, setCompendiumRowDrafts] = useState<
    Record<string | number, any>
  >({});
  const [compendiumRowErrors, setCompendiumRowErrors] = useState<
    Record<
      string | number,
      {
        panelName?: string;
        externalPanelName?: string;
        externalPanelCode?: string;
        testName?: string;
        externalTestName?: string;
        externalTestCode?: string;
      }
    >
  >({});
  const [savingCompendiumRowId, setSavingCompendiumRowId] = useState<
    string | number | null
  >(null);

  const hasEditableFacilityRow = useMemo(
    () => rows.some((row) => row.rowStatus),
    [rows]
  );
  const hasEditableInsuranceRow = useMemo(
    () => insuranceRows.some((row) => row.rowStatus),
    [insuranceRows]
  );
  const hasEditableCompendiumRow = useMemo(
    () => compendiumRows.some((row) => row.rowStatus),
    [compendiumRows]
  );


  //  React Query: Insurance types for dropdown
  const { data: insuranceTypesData } = useQuery(
    ["insuranceTypes"],
    () => getInsuranceTypes(),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      select: (response) => {
        const data = response?.data?.data || response?.data || {};
        return data.insuranceTypes ?? data ?? [];
      },
      onError: (error: any) => {
        console.error("Error fetching insurance types:", error);
        toast.error(
          error?.response?.data?.message || t("Error fetching insurance types")
        );
      },
    }
  );

  const insuranceTypeOptions = useMemo(() => {
    if (!Array.isArray(insuranceTypesData) || !insuranceTypesData.length) {
      return [];
    }
    return insuranceTypesData.map((type: any) => ({
      value: type.insuranceID,
      label: type.insuranceType,
    }));
  }, [insuranceTypesData]);

  const [insuranceNameOptions, setInsuranceNameOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [isLoadingInsuranceNames, setIsLoadingInsuranceNames] = useState(false);

  const fetchInsuranceNames = async (insuranceType: string) => {
    setInsuranceNameOptions([]);
    setIsLoadingInsuranceNames(true);
    try {
      const response = await getInsuranceNames(insuranceType);
      const data = response?.data?.data || response?.data || {};
      const insurances = data.insurances ?? data ?? [];
      const options = (insurances as any[]).map((insurance: any) => ({
        value: insurance.insuranceID,
        label: insurance.providerDisplayName,
      }));
      setInsuranceNameOptions(options);
    } catch (error: any) {
      console.error("Error fetching insurance names:", error);
      toast.error(
        error?.response?.data?.message || t("Error fetching insurance names")
      );
      setInsuranceNameOptions([]);
    } finally {
      setIsLoadingInsuranceNames(false);
    }
  };

  useEffect(() => {
    if (compendiumData) {
      // Handle known tabs with their formatters
      if ("facilities" in compendiumData) {
        setRows(formatFacilities(compendiumData.facilities ?? []));
      } else {
        setRows([]);
      }
      if ("insurances" in compendiumData) {
        setInsuranceRows(formatInsurances(compendiumData.insurances ?? []));
      } else {
        setInsuranceRows([]);
      }
      if ("compendiums" in compendiumData) {
        setCompendiumRows(formatCompendiums(compendiumData.compendiums ?? []));
      } else {
        setCompendiumRows([]);
      }
      // Note: New tabs from backend will be handled in the render section
    }
  }, [compendiumData]);

  // Set default active tab when tabs are available
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(t => t.key === activeTab)) {
      setActiveTab(availableTabs[0].key);
    }
  }, [availableTabs, activeTab]);


  const handleAddFacilityRow = () => {
    if (hasEditableFacilityRow) {
      toast.info(t("Finish editing the current row first"));
      return;
    }

    setRows((prev) => [
      {
        tempId: `temp-fac-${Date.now()}`,
        id: 0,
        facilityId: null,
        facilityName: "",
        emrId: "",
        rowStatus: true,
        isNew: true,
      },
      ...prev,
    ]);
  };

  const handleAddInsuranceRow = () => {
    if (hasEditableInsuranceRow) {
      toast.info(t("Finish editing the current row first"));
      return;
    }

    setInsuranceRows((prev) => [
      {
        tempId: `temp-ins-${Date.now()}`,
        id: 0,
        insuranceTypeId: null,
        insuranceType: "",
        insuranceId: null,
        name: "",
        mappedInsurance: "",
        rowStatus: true,
        isNew: true,
      },
      ...prev,
    ]);
  };

  const handleAddCompendiumRow = () => {
    if (hasEditableCompendiumRow) {
      toast.info(t("Finish editing the current row first"));
      return;
    }

    setCompendiumRows((prev) => [
      {
        tempId: `temp-comp-${Date.now()}`,
        id: 0,
        panelName: "",
        panelNameId: null,
        externalPanelName: "",
        externalPanelCode: "",
        testName: "",
        testNameId: null,
        externalTestName: "",
        externalTestCode: "",
        requisitionType: "",
        rowStatus: true,
        isNew: true,
      },
      ...prev,
    ]);
  };

  const handleRowFieldChange = (
    rowKey: string | number,
    name: string,
    value: string | number,
    label?: string
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        getRowKey(row) === rowKey
          ? {
              ...row,
              [name]: value,
              ...(name === "facilityId" && label
                ? { facilityName: label }
                : {}),
            }
          : row
      )
    );
    setRowErrors((prev) => ({
      ...prev,
      [rowKey]: {
        ...(prev[rowKey] || {}),
        [name === "facilityId" ? "facilityName" : name]: "",
      },
    }));
  };

  const handleInsuranceRowChange = (
    rowKey: string | number,
    name: string,
    value: string | number,
    label?: string
  ) => {
    setInsuranceRows((prev) =>
      prev.map((row) => {
        if (getRowKey(row) !== rowKey) return row;
        const updated: any = { ...row };
        updated[name] = value;

        if (name === "insuranceTypeId") {
          updated.insuranceType = label || "";
          updated.insuranceId = null;
          updated.name = "";
        }
        if (name === "insuranceId") {
          updated.name = label || "";
        }
        return updated;
      })
    );
    if (name === "insuranceTypeId" && label) {
      fetchInsuranceNames(label);
    }

    setInsuranceRowErrors((prev) => {
      // Map field changes to error fields that should be cleared
      const clearMap: Record<string, Record<string, string>> = {
        insuranceTypeId: { insuranceType: "", insuranceName: "" },
        insuranceId: { insuranceName: "" },
        mappedInsurance: { mappedInsurance: "" },
      };

      return {
        ...prev,
        [rowKey]: {
          ...(prev[rowKey] || {}),
          ...(clearMap[name] || {}),
        },
      };
    });
  };

  const handleCompendiumRowChange = (
    rowKey: string | number,
    name: string,
    value: string | number,
    label?: string
  ) => {
    setCompendiumRows((prev) =>
      prev.map((row) => {
        if (getRowKey(row) !== rowKey) return row;
        const updated: any = { ...row };
        updated[name] = value;
        // When panel name is selected, auto-populate requisition type with the same label
        if (name === "panelNameId" && label) {
          updated.panelName = label;
          updated.requisitionType = label; // Auto-populate requisition type
        }
        // When test name is selected, update the testName field
        if (name === "testNameId" && label) {
          updated.testName = label;
        }
        return updated;
      })
    );

    setCompendiumRowErrors((prev) => ({
      ...prev,
      [rowKey]: {
        ...(prev[rowKey] || {}),
        [name]: "",
      },
    }));
  };

  const handleEditRow = (row: any) => {
    if (hasEditableFacilityRow) {
      toast.info(t("Finish editing the current row first"));
      return;
    }

    const rowKey = getRowKey(row);
    // Save complete snapshot of the row for cancel functionality
    setRowDrafts((prev) => ({
      ...prev,
      [rowKey]: { ...row },
    }));
    setRows((prev) =>
      prev.map((r) => (getRowKey(r) === rowKey ? { ...r, rowStatus: true } : r))
    );
  };

  const handleEditInsuranceRow = (row: any) => {
    if (hasEditableInsuranceRow) {
      toast.info(t("Finish editing the current row first"));
      return;
    }

    const rowKey = getRowKey(row);

    // Preload insurance names for the existing row's type when editing
    if (row.insuranceType) {
      fetchInsuranceNames(row.insuranceType);
    }

    // Save complete snapshot of the row for cancel functionality
    setInsuranceRowDrafts((prev) => ({
      ...prev,
      [rowKey]: { ...row },
    }));
    setInsuranceRows((prev) =>
      prev.map((r) => (getRowKey(r) === rowKey ? { ...r, rowStatus: true } : r))
    );
  };

  const handleEditCompendiumRow = (row: any) => {
    if (hasEditableCompendiumRow) {
      toast.info(t("Finish editing the current row first"));
      return;
    }

    const rowKey = getRowKey(row);

    // Save complete snapshot of the row for cancel functionality
    setCompendiumRowDrafts((prev) => ({
      ...prev,
      [rowKey]: { ...row },
    }));
    setCompendiumRows((prev) =>
      prev.map((r) => (getRowKey(r) === rowKey ? { ...r, rowStatus: true } : r))
    );
  };

  const handleCancelRow = (row: any) => {
    const rowKey = getRowKey(row);
    if (row.isNew) {
      setRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
    } else {
      const snapshot = rowDrafts[rowKey];
      if (snapshot) {
        // Restore the entire row from the snapshot, ensuring rowStatus is false
        setRows((prev) =>
          prev.map((r) =>
            getRowKey(r) === rowKey
              ? { ...snapshot, rowStatus: false, id: r.id, tempId: r.tempId }
              : r
          )
        );
      }
    }
    setRowDrafts((prev) => {
      const { [rowKey]: _, ...rest } = prev;
      return rest;
    });
    setRowErrors((prev) => {
      const { [rowKey]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleCancelInsuranceRow = (row: any) => {
    const rowKey = getRowKey(row);
    if (row.isNew) {
      setInsuranceRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
    } else {
      const snapshot = insuranceRowDrafts[rowKey];
      if (snapshot) {
        // Restore the entire row from the snapshot, ensuring rowStatus is false
        setInsuranceRows((prev) =>
          prev.map((r) =>
            getRowKey(r) === rowKey
              ? { ...snapshot, rowStatus: false, id: r.id, tempId: r.tempId }
              : r
          )
        );
      }
    }
    setInsuranceRowDrafts((prev) => {
      const { [rowKey]: _, ...rest } = prev;
      return rest;
    });
    setInsuranceRowErrors((prev) => {
      const { [rowKey]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleCancelCompendiumRow = (row: any) => {
    const rowKey = getRowKey(row);
    if (row.isNew) {
      setCompendiumRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
    } else {
      const snapshot = compendiumRowDrafts[rowKey];
      if (snapshot) {
        // Restore the entire row from the snapshot, ensuring rowStatus is false
        setCompendiumRows((prev) =>
          prev.map((r) =>
            getRowKey(r) === rowKey
              ? { ...snapshot, rowStatus: false, id: r.id, tempId: r.tempId }
              : r
          )
        );
      }
    }
    setCompendiumRowDrafts((prev) => {
      const { [rowKey]: _, ...rest } = prev;
      return rest;
    });
    setCompendiumRowErrors((prev) => {
      const { [rowKey]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleDeleteRow = (row: any) => {
    const rowKey = getRowKey(row);

    // If it's a new row not yet saved, just remove locally
    if (row.isNew || !row.id) {
      setRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
      toast.success(t("Deleted successfully"));
      return;
    }

    // Existing row - call backend delete
    deleteFacility(row.id)
      .then(() => {
        toast.success(t("Deleted successfully"));
        queryClient.invalidateQueries(["compendium", masterIntegrationId]);
        setRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
      })
      .catch((error: any) => {
        console.error("Error deleting facility:", error);
        toast.error(
          error?.response?.data?.message || t("Error deleting facility")
        );
      });
  };

  const handleDeleteInsuranceRow = (row: any) => {
    const rowKey = getRowKey(row);

    // If it's a new row not yet saved, just remove locally
    if (row.isNew || !row.id) {
      setInsuranceRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
      toast.success(t("Deleted successfully"));
      return;
    }

    // Existing row - call backend delete
    deleteInsurance(row.id)
      .then(() => {
        toast.success(t("Deleted successfully"));
        queryClient.invalidateQueries(["compendium", masterIntegrationId]);
        setInsuranceRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
      })
      .catch((error: any) => {
        console.error("Error deleting insurance:", error);
        toast.error(
          error?.response?.data?.message || t("Error deleting insurance")
        );
      });
  };

  const handleDeleteCompendiumRow = (row: any) => {
    const rowKey = getRowKey(row);

    // If it's a new row not yet saved, just remove locally
    if (row.isNew || !row.id) {
      setCompendiumRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
      toast.success(t("Deleted successfully"));
      return;
    }

    // Existing row - call backend delete (placeholder - update when endpoint is available)
    // deleteCompendium(row.id)
    //   .then(() => {
    //     toast.success(t("Deleted successfully"));
    //     queryClient.invalidateQueries(["compendium", masterIntegrationId]);
    //     setCompendiumRows((prev) => prev.filter((r) => getRowKey(r) !== rowKey));
    //   })
    //   .catch((error: any) => {
    //     console.error("Error deleting compendium:", error);
    //     toast.error(
    //       error?.response?.data?.message || t("Error deleting compendium")
    //     );
    //   });
    toast.info(t("Delete functionality will be available when endpoint is ready"));
  };

  const validateRow = (row: any) => {
    const rowKey = getRowKey(row);
    const errors: { facilityName?: string; emrId?: string } = {};
    if (!row.facilityId) {
      errors.facilityName = t("Select facility");
    }
    if (!row.emrId?.trim()) {
      errors.emrId = t("Enter EMR Id");
    }

    setRowErrors((prev) => ({
      ...prev,
      [rowKey]: errors,
    }));

    return Object.keys(errors).length === 0;
  };

  const validateInsuranceRow = (row: any) => {
    const rowKey = getRowKey(row);
    const errors: {
      insuranceType?: string;
      insuranceName?: string;
      mappedInsurance?: string;
    } = {};
    if (!row.insuranceTypeId) {
      errors.insuranceType = t("Select insurance type");
    }
    if (!row.insuranceId) {
      errors.insuranceName = t("Select insurance");
    }
    if (!row.mappedInsurance?.trim()) {
      errors.mappedInsurance = t("Enter mapped insurance");
    }

    setInsuranceRowErrors((prev) => ({
      ...prev,
      [rowKey]: errors,
    }));

    return Object.keys(errors).length === 0;
  };

  const validateCompendiumRow = (row: any) => {
    const rowKey = getRowKey(row);
    const errors: {
      panelName?: string;
      externalPanelName?: string;
      externalPanelCode?: string;
      testName?: string;
      externalTestName?: string;
      externalTestCode?: string;
    } = {};
    if (!row.panelNameId) {
      errors.panelName = t("Select panel name");
    }
    if (!row.externalPanelName?.trim()) {
      errors.externalPanelName = t("Enter external panel name");
    }
    if (!row.externalPanelCode?.trim()) {
      errors.externalPanelCode = t("Enter external panel code");
    }
    if (!row.testNameId) {
      errors.testName = t("Select test name");
    }
    if (!row.externalTestName?.trim()) {
      errors.externalTestName = t("Enter external test name");
    }
    if (!row.externalTestCode?.trim()) {
      errors.externalTestCode = t("Enter external test code");
    }

    setCompendiumRowErrors((prev) => ({
      ...prev,
      [rowKey]: errors,
    }));

    return Object.keys(errors).length === 0;
  };

  const handleSaveRow = async (row: any) => {
    const rowKey = getRowKey(row);
    if (!validateRow(row)) {
      return;
    }

    setSavingRowId(rowKey);
    try {
      if (!masterIntegrationId) {
        throw new Error(t("Master Integration ID is required"));
      }

      const payload = {
        masterIntegrationId,
        facilityId: row.facilityId,
        facilityName: row.facilityName,
        externalCode: row.emrId ?? null,
      };

      if (row.isNew || !row.id) {
        await postFacilities(payload);
      } else {
        await putFacilities(row.id, payload);
      }

      toast.success(t("Saved successfully"));

      queryClient.invalidateQueries(["compendium", masterIntegrationId]);

      setRows((prev) =>
        prev.map((r) =>
          getRowKey(r) === rowKey
            ? {
                ...r,
                rowStatus: false,
                isNew: false,
              }
            : r
        )
      );
      setRowDrafts((prev) => {
        const { [rowKey]: _, ...rest } = prev;
        return rest;
      });
      setRowErrors((prev) => {
        const { [rowKey]: _, ...rest } = prev;
        return rest;
      });
    } catch (error: any) {
      toast.error(error?.message || t("Error saving data"));
    } finally {
      setSavingRowId(null);
    }
  };

  const handleSaveInsuranceRow = async (row: any) => {
    console.log("row", row);
    const rowKey = getRowKey(row);
    if (!validateInsuranceRow(row)) {
      return;
    }

    setSavingInsuranceRowId(rowKey);
    try {
      if (!masterIntegrationId) {
        throw new Error(t("Master Integration ID is required"));
      }
      // If insuranceTypeId is not set (e.g., when editing without changing dropdown), look up from insuranceType name
      let insuranceTypeId = row.insuranceTypeId;
      if (!insuranceTypeId && row.insuranceType && insuranceTypesData?.length) {
        const matchedType = insuranceTypesData.find(
          (type: any) => type.insuranceType === row.insuranceType
        );
        insuranceTypeId = matchedType?.insuranceID ?? null;
      }

      const payload = {
        insuranceId: row.insuranceId,
        masterIntegrationId,
        insuranceName: row.name,
        mappedInsurance: row.mappedInsurance,
        insuranceTypeId: insuranceTypeId,
        InsuranceType: row.insuranceType,
      };

      if (row.isNew || !row.id) {
        await postInsurance(payload);
      } else {
        await putInsurance(row.id, payload);
      }

      toast.success(t("Saved successfully"));

      // Refresh compendium data from backend
      queryClient.invalidateQueries(["compendium", masterIntegrationId]);

      setInsuranceRows((prev) =>
        prev.map((r) =>
          getRowKey(r) === rowKey
            ? {
                ...r,
                rowStatus: false,
                isNew: false,
              }
            : r
        )
      );
      setInsuranceRowDrafts((prev) => {
        const { [rowKey]: _, ...rest } = prev;
        return rest;
      });
      setInsuranceRowErrors((prev) => {
        const { [rowKey]: _, ...rest } = prev;
        return rest;
      });
    } catch (error: any) {
      toast.error(error?.message || t("Error saving data"));
    } finally {
      setSavingInsuranceRowId(null);
    }
  };

  const handleSaveCompendiumRow = async (row: any) => {
    const rowKey = getRowKey(row);
    if (!validateCompendiumRow(row)) {
      return;
    }

    setSavingCompendiumRowId(rowKey);
    try {
      if (!masterIntegrationId) {
        throw new Error(t("Master Integration ID is required"));
      }

      const payload = {
        masterIntegrationId,
        panelNameId: row.panelNameId,
        panelName: row.panelName,
        externalPanelName: row.externalPanelName,
        externalPanelCode: row.externalPanelCode,
        testNameId: row.testNameId,
        testName: row.testName,
        externalTestName: row.externalTestName,
        externalTestCode: row.externalTestCode,
        requisitionType: row.requisitionType,
      };

      // Placeholder - update when endpoints are available
      // if (row.isNew || !row.id) {
      //   await postCompendium(payload);
      // } else {
      //   await putCompendium(row.id, payload);
      // }

      toast.info(t("Save functionality will be available when endpoint is ready"));

      // Refresh compendium data from backend
      // queryClient.invalidateQueries(["compendium", masterIntegrationId]);

      setCompendiumRows((prev) =>
        prev.map((r) =>
          getRowKey(r) === rowKey
            ? {
                ...r,
                rowStatus: false,
                isNew: false,
              }
            : r
        )
      );
      setCompendiumRowDrafts((prev) => {
        const { [rowKey]: _, ...rest } = prev;
        return rest;
      });
      setCompendiumRowErrors((prev) => {
        const { [rowKey]: _, ...rest } = prev;
        return rest;
      });
    } catch (error: any) {
      toast.error(error?.message || t("Error saving data"));
    } finally {
      setSavingCompendiumRowId(null);
    }
  };
  return (
    <>
      <div className="d-flex gap-2 flex-wrap"></div>
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center gap-3">
            {availableTabs.map((tab) => (
              <div
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                }}
                style={{
                  backgroundColor:
                    activeTab === tab.key ? "#69A54B" : "rgba(105,165,75,0.2)",
                  padding: "6px 15px",
                  borderRadius: "80px",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{ color: activeTab === tab.key ? "#fff" : "#305314" }}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Dynamic button based on active tab - only show for known tabs */}
        {activeTab === "facilities" && (
          <button
            id="CompendiumAddNew"
            onClick={handleAddFacilityRow}
            className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
            disabled={hasEditableFacilityRow}
          >
            {t("Add New Facility")}
          </button>
        )}
        {activeTab === "insurances" && (
          <button
            id="CompendiumAddNewInsurance"
            onClick={handleAddInsuranceRow}
            className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
            disabled={hasEditableInsuranceRow}
          >
            {t("Add New Insurance")}
          </button>
        )}
        {activeTab === "compendiums" && (
          <button
            id="CompendiumAddNewCompendium"
            onClick={handleAddCompendiumRow}
            className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
            disabled={hasEditableCompendiumRow}
          >
            {t("Add New Compendium")}
          </button>
        )}
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
              {activeTab === "facilities" && (
                <Table
                  aria-label="sticky table collapsible"
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
                      <TableCell sx={headerCellStyles} className="min-w-50px">
                        {t("Actions")}
                      </TableCell>

                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        <div className="d-flex justify-content-between cursor-pointer">
                          <div style={{ width: "max-content" }}>
                            {t("Name")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                        </div>
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        <div className="d-flex justify-content-between cursor-pointer">
                          <div style={{ width: "max-content" }}>
                            {t("EMR Id")}
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
                    {compendiumLoading || isCompendiumFetching ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="py-2">
                            <Loader />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : rows.length ? (
                      rows.map((row: any, index: number) => (
                        <CompendiumMappingRow
                          row={row}
                          key={row.id ?? row.tempId ?? index}
                          index={index}
                          onSave={handleSaveRow}
                          onChange={(rowKey, name, value) =>
                            handleRowFieldChange(
                              rowKey,
                              name,
                              value,
                              name === "facilityId"
                                ? facilityOptions.find(
                                    (option) => option.value === value
                                  )?.label
                                : undefined
                            )
                          }
                          onCancel={handleCancelRow}
                          onEdit={handleEditRow}
                          onDelete={handleDeleteRow}
                          validationErrors={rowErrors[getRowKey(row)]}
                          savingRowId={savingRowId}
                          disableActions={
                            hasEditableFacilityRow && !row.rowStatus
                          }
                          facilityOptions={facilityOptions}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          {t("No records found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              {activeTab === "insurances" && (
                <Table
                  aria-label="insurance table"
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
                    <TableRow className="h-30px">
                      <TableCell sx={headerCellStyles} className="min-w-50px">
                        {t("Actions")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("Insurance Type")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("Insurance Name")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("Mapped Insurance")}
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
                    {compendiumLoading || isCompendiumFetching ? (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <div className="py-2">
                            <Loader />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : insuranceRows.length ? (
                      insuranceRows.map((row: any, index: number) => (
                        <InsuranceRow
                          key={row.id ?? row.tempId ?? index}
                          row={row}
                          index={index}
                          onSave={handleSaveInsuranceRow}
                          onChange={handleInsuranceRowChange}
                          onCancel={handleCancelInsuranceRow}
                          onEdit={handleEditInsuranceRow}
                          onDelete={handleDeleteInsuranceRow}
                          validationErrors={insuranceRowErrors[getRowKey(row)]}
                          savingRowId={savingInsuranceRowId}
                          disableActions={
                            hasEditableInsuranceRow && !row.rowStatus
                          }
                          insuranceTypeOptions={insuranceTypeOptions}
                          insuranceNameOptions={insuranceNameOptions}
                          isLoadingInsuranceNames={isLoadingInsuranceNames}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          {t("No records found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              {activeTab === "compendiums" && (
                <Table
                  aria-label="compendium table"
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
                    <TableRow className="h-30px">
                      <TableCell sx={headerCellStyles} className="min-w-50px">
                        {t("Actions")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("Panel Name")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("External Panel Name")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("External Panel Code")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("Test Name")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("External Test Name")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("External Test Code")}
                      </TableCell>
                      <TableCell
                        sx={{ ...headerCellStyles, width: "max-content" }}
                      >
                        {t("Requisition Type")}
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
                    {compendiumLoading || isCompendiumFetching ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <div className="py-2">
                            <Loader />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : compendiumRows.length ? (
                      compendiumRows.map((row: any, index: number) => (
                        <CompendiumRow
                          key={row.id ?? row.tempId ?? index}
                          row={row}
                          index={index}
                          onSave={handleSaveCompendiumRow}
                          onChange={handleCompendiumRowChange}
                          onCancel={handleCancelCompendiumRow}
                          onEdit={handleEditCompendiumRow}
                          onDelete={handleDeleteCompendiumRow}
                          validationErrors={compendiumRowErrors[getRowKey(row)]}
                          savingRowId={savingCompendiumRowId}
                          disableActions={
                            hasEditableCompendiumRow && !row.rowStatus
                          }
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          {t("No records found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              {/* Fallback for unknown/new tabs from backend */}
              {activeTab !== "facilities" &&
                activeTab !== "insurances" &&
                activeTab !== "compendiums" && (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "300px" }}
                  >
                    <div className="text-center">
                      <i
                        className="fas fa-info-circle text-muted mb-3"
                        style={{ fontSize: "3rem" }}
                      ></i>
                      <h5 className="text-dark fw-semibold mb-2">
                        {t("Tab Under Development")}
                      </h5>
                      <p className="text-muted mb-0">
                        {t("We are working on this tab. Please check back later.")}
                      </p>
                    </div>
                  </div>
                )}
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
    </>
  );
};

export default CompendiumMappingTab;
