import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Loader } from "../../../Shared/Common/Loader";
import GridNavbar, { LinksArray } from "../../../Shared/Compendium/GridNavbar";
import { ReactState } from "../../../Shared/Type";
import { PanelSetUpInputs } from "../../../Utils/Compendium/Inputs";
import { Item } from "./AddPanelSetup";
import useLang from "Shared/hooks/useLanguage";

interface Props {
  rows: {
    id: number;
    name: string;
    displayName: string;
    requisitionType: number;
    requisitionTypeName: string;
    panelType: number;
    tmiT_Code: string;
    isActive: boolean | string;
  }[];
  NavigatorsArray: LinksArray[];
  setOpenModal: ReactState;
  setValues: any;
  setEditGridHeader: any;
  statusChange: Function;
  requisitionList: Item[];
  setSearchRequest: any;
  searchRequest: any;
  loading: boolean;
  loadData: any;
}

const PanelSetup: React.FC<Props> = ({
  rows,
  NavigatorsArray,
  setValues,
  setOpenModal,
  setEditGridHeader,
  statusChange,
  requisitionList,
  setSearchRequest,
  searchRequest,
  loading,
  loadData,
}) => {
  const { t } = useLang()
  const columns: GridColDef[] = [
    {
      field: "Actions",
      headerName: t("ACTIONS"),
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const Edit = () => {
          let filteredObj = requisitionList.filter(
            (items) => items?.value === params.row.requisitionType
          );
          const obj = {
            ...params?.row,
            label: filteredObj[0]?.label,
            requisitionType: filteredObj[0]?.value,
          };
          setOpenModal(true);
          setValues(obj);
          setEditGridHeader(true);
        };
        return (
          <div className="rotatebtnn">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id="dropdown-button-drop-end"
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              {params?.row?.isActive ? (
                <Dropdown.Item eventKey="3">
                  <div onClick={Edit} className="menu-item px-3">
                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                    {t("Edit")}
                  </div>
                </Dropdown.Item>
              ) : null}

              <Dropdown.Item eventKey="4">
                <div
                  onClick={() => {
                    statusChange(params?.row?.id, params?.row?.isActive);
                  }}
                  className="menu-item px-3"
                >
                  {params?.row?.isActive ? (
                    <i
                      className="fa fa-key text-info mr-2"
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      className="fa fa-key text-info mr-2"
                      aria-hidden="true"
                    ></i>
                  )}
                  {params?.row?.isActive ? t("Inactive") : t("Active")}
                </div>
              </Dropdown.Item>
            </DropdownButton>
          </div>
        );
      },
    },
    // { field: "id", headerName: "ID", width: 130 },
    {
      field: "name",
      headerName: t("PANEL NAME"),
      width: 200,
    },
    {
      field: "displayName",
      headerName: t("DISPLAY NAME"),
      type: "string",
      width: 250,
    },
    {
      field: "tmiT_Code",
      headerName: t("TMIT CODE"),
      type: "string",
      width: 150,
    },
    {
      field: "requisitionTypeName",
      headerName: t("REQUISITION TYPE"),
      type: "string",
      width: 150,
    },
    {
      field: "isActive",
      headerName: t("Status"),
      type: "number",
      width: 80,
      flex: 0.25,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.isActive ? (
              <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
            ) : (
              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
            )}
          </>
        );
      },
    },
  ];
  return (
    <>
      <GridNavbar
        NavigatorsArray={NavigatorsArray}
        AddBtnText={t("Add Panel Setup")}
        setOpenModal={setOpenModal}
        Inputs={PanelSetUpInputs}
        setSearchRequest={setSearchRequest}
        searchRequest={searchRequest}
        loadData={loadData}
        statusDropDownName={t("isActive")}
      />
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body px-3 px-md-8">
              <Box sx={{ height: 400 }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  getRowId={(row) => row.id}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  loading={loading}
                  components={{
                    // NoRowsOverlay: Loader,
                    LoadingOverlay: Loader,
                  }}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PanelSetup;
