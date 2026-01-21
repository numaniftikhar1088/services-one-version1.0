import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Loader } from "../../../Shared/Common/Loader";
import GridNavbar, { LinksArray } from "../../../Shared/Compendium/GridNavbar";
import { ReactState } from "../../../Shared/Type";
import { PanelGroupInputs } from "../../../Utils/Compendium/Inputs";
import useLang from "Shared/hooks/useLanguage";
interface Props {
  rows: {
    id: number;
    name: string;
    displayName: string;
    isActive: boolean;
  }[];
  NavigatorsArray: LinksArray[];
  setValues: any;
  setOpenModal: ReactState;
  statusChange: Function;
  setEditGridHeader: any;
  searchRequest: any;
  setSearchRequest: any;
  loadData: any;
  loading: boolean;
}

const Compendium: React.FC<Props> = ({
  rows,
  NavigatorsArray,
  setValues,
  setOpenModal,
  statusChange,
  setEditGridHeader,
  searchRequest,
  setSearchRequest,
  loadData,
  loading,
}) => {
  const { t } = useLang()
  const columns: GridColDef[] = [
    {
      field: "Actions",
      headerName: "ACTIONS",
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const Edit = () => {
          setOpenModal(true);
          setValues(params?.row);
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
                <>
                  <Dropdown.Item eventKey="3">
                    <div onClick={Edit} className="menu-item px-3">
                      <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                      {t("Edit")}
                    </div>
                  </Dropdown.Item>
                </>
              ) : null}
              <Dropdown.Item eventKey="2">
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
                      className="fa fa-key text-secondary mr-2"
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
      headerName: t("GROUP NAME"),
      width: 250,
    },
    {
      field: "displayName",
      headerName: t("GROUP DISPLAY NAME"),
      type: "string",
      width: 300,
    },
    {
      field: "isActive",
      headerName: t("STATUS"),
      type: "number",
      width: 100,
      flex: 0.25,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.value ? (
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
        AddBtnText={t("Add Group")}
        setOpenModal={setOpenModal}
        Inputs={PanelGroupInputs}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        loadData={loadData}
        statusDropDownName={t("isActive")}
      />
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body px-3 px-md-8">
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[7]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                  loading={loading}
                  components={{
                    //NoRowsOverlay: Loader,
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

export default Compendium;
