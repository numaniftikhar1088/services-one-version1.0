import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { IFormValues } from ".";
import { Loader } from "../../../Shared/Common/Loader";
import GridNavbar, { LinksArray } from "../../../Shared/Compendium/GridNavbar";
import { ReactState } from "../../../Shared/Type";
import { TestSetUpInputs } from "../../../Utils/Compendium/Inputs";
import useLang from "../../../Shared/hooks/useLanguage";

interface Props {
  rows: {
    testId: number;
    testName: string;
    testDisplayName: string;
    tmitCode: string;
    testType: string;
    requsitionType: string;
    testStatus: boolean;
  }[];
  NavigatorsArray: LinksArray[];
  setOpenModal: ReactState;
  values: IFormValues;
  setValues: any;
  statusChange: Function;
  setEditGridHeader: any;
  searchRequest: any;
  setSearchRequest: any;
  loading: boolean;
  loadData: any;
}

const TestSetUp: React.FC<Props> = ({
  rows,
  NavigatorsArray,
  setOpenModal,
  values,
  setValues,
  statusChange,
  setEditGridHeader,
  searchRequest,
  setSearchRequest,
  loading,
  loadData,
}) => {
  const {t} = useLang()
  const columns: GridColDef[] = [
    {
      field: "Actions",
      headerName: t("ACTIONS"),
      minWidth: 50,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const onClick = () => {
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
              {params?.row?.testStatus ? (
                <Dropdown.Item eventKey="3">
                  <div onClick={onClick} className="menu-item px-3">
                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                    {t("Edit")}
                  </div>
                </Dropdown.Item>
              ) : null}

              <Dropdown.Item eventKey="2">
                <div
                  onClick={() => {
                    statusChange(params?.row?.testId, params?.row?.testStatus);
                  }}
                  className="menu-item px-3"
                >
                  {params?.row?.testStatus ? (
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
                  {params?.row?.testStatus ? t("Inactive") : t("Active")}
                </div>
              </Dropdown.Item>
            </DropdownButton>
          </div>
        );
      },
    },

    {
      field: "testName",
      headerName: t("TEST NAME"),
      flex: 0.5,
    },
    {
      field: "testDisplayName",
      headerName: t("DISPLAY NAME"),
      type: "string",
      flex: 0.5,
    },
    {
      field: "tmitCode",
      headerName: t("TMIT CODE"),
      type: "string",
      flex: 0.5,
    },
    {
      field: "requsitionType",
      headerName: t("REQUISITION"),
      type: "string",
      flex: 0.5,
    },
    {
      field: "testStatus",
      headerName: t("STATUS"),
      type: "boolean",
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
        Inputs={TestSetUpInputs}
        NavigatorsArray={NavigatorsArray}
        AddBtnText={t("Add Test SetUp")}
        setOpenModal={setOpenModal}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        loadData={loadData}
        statusDropDownName="status"
      />
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body px-3 px-md-8">
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  getRowId={(row) => row.testId}
                  pageSize={10}
                  rowsPerPageOptions={[5]}
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

export default TestSetUp;
