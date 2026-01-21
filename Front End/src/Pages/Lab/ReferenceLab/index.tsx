import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import LabManagementService from "../../../Services/LabManagement/LabManagementService";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { setShowColumn } from "../../../Redux/Actions/Pages/Lab/ReferenceLab";
import { formValidation } from "../../../Utils/Lab/ReferenceLabValidation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { AxiosError, AxiosResponse } from "axios";
import { GridColDef } from "@mui/x-data-grid";
import { IGridData } from "../../../Interface/Lab";
import useLang from "Shared/hooks/useLanguage";

const ReferenceLab = () => {
  const { t } = useLang()
  const [RowsData, setRowsData] = useState<any>([]);
  const [editableRowId, setEditableRowId] = useState<string | undefined>();
  const [search, setSearch] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const newId = Number(id);
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    Actions: true,
  });
  const [gridData, setGridData] = useState<IGridData>({
    referenceLabAssignmentsData: [{}],
    referenceLabDropDownGetObj: {
      pageNumber: 1,
      pageSize: 200,
      queryModel: null,
    },
    requsitionTypeDropdownGetObj: {
      pageNumber: 1,
      pageSize: 200,
      queryModel: null,
    },
    referenceLabDropDownOptions: [],
    requsitionTypeDropdownOptions: [],
    getRefLabAssigmentsDataObj: {
      pageNumber: 1,
      pageSize: 200,
      queryModel: {
        name: "",
        labType: null,
        labApprovementStatus: null,
        facilityIds: [newId],
      },
    },
  });
  useEffect(() => {
    dispatch(
      setShowColumn({
        Actions: true,
        reference_lab: true,
        code: true,
        requisition_type: true,
        status: true,
      })
    );
    getDropDownsData();
  }, []);
  // let { columnStatus } = labReducer; for future use
  useEffect(() => {
    loadReferenceLabAssignments();
  }, []);

  const loadReferenceLabAssignments = async () => {
    const response = await LabManagementService.loadReferenceLabAssignments(
      gridData.getRefLabAssigmentsDataObj
    );
    setRowsData(
      response?.data?.data?.data.map((data: any) => {
        return {
          ...data,
          id: Math.random(),
          labType: data?.reqTypeId,
          primaryLabId: data?.referenceLabId,
          new: false,
        };
      })
    );
  };

  const getDropDownsData = async () => {
    LabManagementService.getRequsitionTypeDropdownValues(
      gridData.requsitionTypeDropdownGetObj
    )
      .then((res: AxiosResponse) =>
        setGridData((pre: any) => {
          return {
            ...pre,
            requsitionTypeDropdownOptions: res?.data?.data,
          };
        })
      )
      .catch((err: AxiosError) => console.log(err)); 

    LabManagementService.getReferenceLabDropDownValues(
      gridData.referenceLabDropDownGetObj
    )
      .then((res: AxiosResponse) => {
        setGridData((pre: any) => {
          return {
            ...pre,
            referenceLabDropDownOptions: res?.data?.data,
          };
        });
      })
      .catch((err: AxiosError) => console.log(err)); 
  };
  const handleUpdateRow = (dataToBeEdited: any) => {
    setEditableRowId(dataToBeEdited?.id);
  };
  const handleDeleteRow = async (rowData: any) => {
    
    if (rowData?.row?.val?.new) {
      let arrayCopy = [...RowsData];
      arrayCopy = arrayCopy.filter((item) => item.id !== rowData?.id);
      setRowsData(arrayCopy);
    }
    if (!rowData?.new) {
      const response = await LabManagementService.DeleteReferenceLab({
        facilityId: rowData?.row?.val?.facilityId,
        refLabId: rowData?.row?.val?.referenceLabId,
      });
      if (response?.data?.status === 200) {
        toast.success(response?.data?.title);
        loadReferenceLabAssignments();
      }
    }
  };

  const handleAddRow = () => {
    const errorRes: any = formValidation(RowsData);
    setRowsData(errorRes?.data);
    if (!errorRes?.valid) {
      return;
    } else {
      setRowsData((curr: any) => [
        {
          id: Math.floor(Math.random() * 100),
          referenceLabId: "",
          primaryLabId: "",
          labType: "",
          labApprovementStatus: true,
          new: true,
        },
        ...curr,
      ]);
    }
  };
  const handleSubmit = async (index: number) => {
    const errorRes = formValidation(RowsData);
    setRowsData(errorRes?.data);
    if (errorRes.valid) {
      // api call
      const objToSend = RowsData.splice(index, 1);
      try {
        const objToPost = {
          facilityId: id,
          // primaryLabId: 15,
          referenceLabId: objToSend[0]?.referenceLabId,
          reqTypeId: parseInt(objToSend[0]?.labType),
          labApprovementStatus: objToSend[0]?.labApprovementStatus,
        };
        const response = await LabManagementService.addReferenceLab(objToPost);
        if (response?.data?.status === 200) {
          setEditableRowId("");
          toast.success(response?.data?.title);
          loadReferenceLabAssignments();
        }
      } catch (error) {
        console.trace(error);
      }
    }
  };
  const columns: GridColDef[] = [
    {
      field: "Actions",
      headerName: "ACTIONS",
      minWidth: 50,
      renderCell: (params) => {
        return (
          <div className="rotatebtnn">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id="dropdown-button-drop-end"
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              <Dropdown.Item eventKey="3">
                <div
                  onClick={() => handleSubmit(params.row.index)}
                  className="menu-item px-3"
                >
                  <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                  {t("Save")}
                </div>
              </Dropdown.Item>
              {!params?.row?.val?.new ? (
                <>
                  <Dropdown.Item
                    onClick={() => handleUpdateRow(params?.row?.val)}
                    eventKey="3"
                  >
                    <div className="menu-item px-3">
                      <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                      {t("Edit")}
                    </div>
                  </Dropdown.Item>
                </>
              ) : null}
              <Dropdown.Item eventKey="4">
                <div
                  onClick={() => handleDeleteRow(params)}
                  className="menu-item px-3"
                >
                  <i className="fa fa-check-circle text-success mr-2 w-20px"></i>
                  {params?.row?.val?.new ? "Cancel" : "Delete"}
                </div>
              </Dropdown.Item>
            </DropdownButton>
          </div>
        );
      },
    },
    {
      field: "reference_lab",
      headerName: "REFERENCE LAB",
      minWidth: 250,
      renderCell: (params) => {
        return (
          <>
            <select
              className={
                params?.row?.val?.new || editableRowId === params?.row?.val?.id
                  ? "reference-lab-grid-select-focussed"
                  : "reference-lab-grid-select"
              }
              onChange={(e) => {
                setRowsData((curr: any) =>
                  curr?.map((x: any) =>
                    x.id === params.row.id
                      ? {
                          ...x,
                          referenceLabId: parseInt(e.target.value),
                          primaryLabId: parseInt(e.target.value),
                        }
                      : x
                  )
                );
              }}
              value={params?.value}
              disabled={
                params?.row?.val?.new || params?.row?.val?.id === editableRowId
                  ? false
                  : true
              }
              aria-label="Default select example"
            >
              <option value="">{t("Select Option")}</option>
              {gridData?.referenceLabDropDownOptions.map(
                (dropdownData: { id: string; name: string }) => (
                  <option value={dropdownData?.id}>{dropdownData?.name}</option>
                )
              )}
            </select>
            <div style={{ color: "red" }}>
              {params?.row?.val?.referenceLabIdCheck}
            </div>
          </>
        );
      },
    },
    {
      field: "code",
      headerName: "CODE",
      minWidth: 250,
      renderCell: (params) => {
        return (
          <>
            <div>{isNaN(params?.value) ? "" : params?.value}</div>
            <div style={{ color: "red" }}>
              {params?.row?.val?.referenceLabIdCheck}
            </div>
          </>
        );
      },
    },
    {
      field: "requisition_type",
      headerName: "REQUISITION TYPE",
      minWidth: 250,
      renderCell: (params) => {
        return (
          <>
            <select
              className={
                params?.row?.val?.new || editableRowId === params?.row?.val?.id
                  ? "reference-lab-grid-select-focussed"
                  : "reference-lab-grid-select"
              }
              onChange={(e) => {
                setRowsData((curr: any) =>
                  curr.map((x: any) =>
                    x.id === params.row.id
                      ? {
                          ...x,
                          labType: e.target.value,
                        }
                      : x
                  )
                );
              }}
              aria-label="Default select example"
              disabled={
                params?.row?.val?.new || params?.row?.val?.id === editableRowId
                  ? false
                  : true
              }
              value={params?.value}
            >
              <option value="">{t("Select Option")}</option>
              {gridData?.requsitionTypeDropdownOptions?.map(
                (dropdownData: { id: number; name: string; type: string }) => (
                  <option value={dropdownData?.id}>
                    {dropdownData?.name + `(${dropdownData?.type})`}
                  </option>
                )
              )}
            </select>
            <div style={{ color: "red" }}>{params?.row?.val?.labTypeCheck}</div>
          </>
        );
      },
    },
    {
      field: "status",
      headerName: "STATUS",
      minWidth: 250,
      renderCell: (params) => {
        return (
          <>
            {params?.value ? (
              <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
            ) : (
              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
            )}
            {/* <>
              <Checkbox
                onChange={(e) => {
                  setRowsData((curr) =>
                    curr.map((x) =>
                      x.id === params.row.id
                        ? {
                            ...x,
                            labApprovementStatus: e.target.checked,
                          }
                        : x
                    )
                  );
                }}
                checked={params?.value}
                disabled={
                  params?.row?.val?.new ||
                  params?.row?.val?.id === editableRowId
                    ? false
                    : true
                }
              />
            </> */}
            {/* {params?.value && params.new ? (
              <>
                <Checkbox
                  onChange={(e) => {
                    setRowsData((curr) =>
                      curr.map((x) =>
                        x.id === params.row.id
                          ? {
                              ...x,
                              labApprovementStatus: e.target.checked,
                            }
                          : x
                      )
                    );
                  }}
                  checked={params?.value}
                  disabled={
                    params?.row?.val?.new ||
                    params?.row?.val?.id === editableRowId
                      ? false
                      : true
                  }
                />
              </>
            ) : (
              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
            )} for future use */}
          </>
        );
      },
    },
  ];
  const redirectToFacility = () => {
    navigate("/facilitylist");
  };
  const bySearch = (user: any, search: any) => {
    if (search) {
      let filteredArray =
        user?.referenceLabName?.toLowerCase().includes(search?.toLowerCase()) ||
        String(user?.primaryLabId)
          .toLowerCase()
          .includes(search?.toLowerCase());
      return filteredArray;
    } else return user;
  };
  const filteredList = (users: any, search: any) => {
    return users?.filter((user: any) => bySearch(user, search));
  };
  const ColorButton = styled(Button)(() => ({
    color: "#000",
    margin: "0px 5px",
    backgroundColor: "#e4e6ef",
    "&:hover": {
      backgroundColor: "#e4e6ef",
    },
  }));
  return (
    <div className="card">
      <div className="card-body px-3 px-md-8">
        <Box sx={{ width: "96%", mt: 3, textAlign: "end" }}>
          {/* <TextField
            onChange={(e) => setSearch(e.target.value)}
            id="standard-basic"
            label="Search"
            variant="outlined"
          /> */}
          {/* search for future use */}
          <ColorButton onClick={() => redirectToFacility()} variant="contained">
          {t("Cancel")}
          </ColorButton>
          <Button onClick={handleAddRow} variant="contained" color="success">
          {t("Add Reference Lab")} 
          </Button>
          <Box sx={{ height: 400, mt: 1 }}>
            <DataGrid
              rows={
                filteredList
                  ? filteredList(RowsData, search)?.map(
                      (val: any, index: number) => ({
                        id: val?.id,
                        reference_lab: val?.referenceLabId,
                        code: isNaN(val?.primaryLabId) ? "" : val?.primaryLabId,
                        requisition_type: val?.labType,
                        status: val?.labApprovementStatus,
                        index: index,
                        val: val,
                      })
                    )
                  : []
              }
              columns={columns}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={(newModel: any) => {
                setColumnVisibilityModel(newModel);
              }}
            />
          </Box>
        </Box>
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return { labReducer: state.LabReducer };
}
export default connect(mapStateToProps)(ReferenceLab);
