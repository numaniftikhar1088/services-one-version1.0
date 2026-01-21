import { useState } from "react";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";

function LookupsFunctions() {
  const [labLookup, setLabLookup] = useState([]);
  const [requisitionType, setRequisitionType] = useState([]);
  const [portalType, setPoralType] = useState([]);
  const [workflowStatus, setWorkFlowStatus] = useState([]);

  const getLabLookupWorkflowStatus = async () => {
    let response = await RequisitionType.getLabLookupWorkflowStatus();
    setLabLookup(response.data);
  };

  const getRequisitionTypesLookupWorkflowStatus = async () => {
    let response =
      await RequisitionType.getRequisitionTypesLookupWorkflowStatus();
    setRequisitionType(response.data);
  };

  const getPortalTypesLookupWorkflowStatus = async () => {
    let response = await RequisitionType.getPortalTypesLookupWorkflowStatus();
    setPoralType(response.data);
  };

  const getWorkFlowStatusLookup = async () => {
    let response = await RequisitionType.getWorkFlowStatusLookup();
    setWorkFlowStatus(response.data);
  };

  const ChangeWorkflowStatus = async (workflowStatusId: any) => {
    await RequisitionType.ChangeWorkflowStatus(workflowStatusId);
  };

  const actionPerformedStaticValues = [
    {
      label: "Begin",
      value: "Begin",
    },
    {
      label: "CheckIn",
      value: "CheckIn",
    },
    {
      label: "Closed",
      value: "Closed",
    },
    {
      label: "Continue",
      value: "Continue",
    },

    {
      label: "Processing",
      value: "Processing",
    },
    {
      label: "Remove Hold",
      value: "Remove Hold",
    },
    {
      label: "Sent to Bill",
      value: "Sent to Bill",
    },

    {
      label: "Ship",
      value: "Ship",
    },
    {
      label: "Specimen Collected",
      value: "Specimen Collected",
    },

    {
      label: "Submit",
      value: "Submit",
    },
    {
      label: "Upload Result",
      value: "Upload Result",
    },
    {
      label: "Validate",
      value: "Validate",
    },
    {
      label: "Collected",
      value: "Collected",
    }
  ];

  return {
    getRequisitionTypesLookupWorkflowStatus,
    getPortalTypesLookupWorkflowStatus,
    getLabLookupWorkflowStatus,
    getWorkFlowStatusLookup,
    ChangeWorkflowStatus,
    actionPerformedStaticValues,
    requisitionType,
    workflowStatus,
    portalType,
    labLookup,
  };
}

export default LookupsFunctions;
