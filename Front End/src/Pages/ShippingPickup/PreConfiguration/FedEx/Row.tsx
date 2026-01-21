import { TableCell, TableRow } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { toast } from "react-toastify";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import { CrossIcon, DoneIcon } from "../../../../Shared/Icons";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";

interface WorkFlowStatusIProps {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  setSearchQuery: any;
  loadData: (reset: boolean) => void;
  searchQuery: any;
  initialSearchQuery: any;
  setIsAddButtonDisabled: Dispatch<SetStateAction<boolean>>;
}
function Row(props: WorkFlowStatusIProps) {
  const {
    row,
    rows,
    index,
    setRows,
    loadData,
    searchQuery,
    setSearchQuery,
    initialSearchQuery,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };

  const handleChange = (name: string, value: string, id: number) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  const saveUpsPreconfiguration = async (isActive?: boolean, id?: string) => {
    let rowToUpdate: any;
    if (id) {
      rowToUpdate = rows.find((row: any) => row.id === id);
    }

    let response =
      await InsuranceService.saveShippingAndSchedulePreconfiguration(
        row?.rowStatus ? row : { ...rowToUpdate, isActive }
      );
    if (response?.data?.httpStatusCode === 200) {
      setSearchQuery(initialSearchQuery);
      toast.success(response?.data?.message);
      loadData(true);
      setIsAddButtonDisabled(false);
    } else if (response?.data?.httpStatusCode == 400) {
      toast.error(t(response?.data?.error));
      loadData(true);
    }
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="h-30px">
      <TableCell className="text-center">
        <div className="d-flex justify-content-center">
          {row.rowStatus ? (
            <>
              <div className="gap-2 d-flex">
                <button
                  id={`ShippingPreConfigrationFedExSave`}
                  onClick={() => saveUpsPreconfiguration()}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <DoneIcon />
                </button>
                <button
                  id={`ShippingPreConfigrationFedExCancel`}
                  onClick={() => {
                    console.log(row.id, "row.id");

                    if (row.id != 0) {
                      const updatedRows = rows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, rowStatus: false };
                        }
                        return r;
                      });
                      setRows(updatedRows);
                      loadData(true);
                    } else {
                      let newArray = [...rows];
                      newArray.splice(index, 1);
                      setRows(newArray);
                      setIsAddButtonDisabled(false);
                    }
                  }}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <CrossIcon />
                </button>
              </div>
            </>
          ) : (
            <div className="rotatebtnn">
              <DropdownButton
                className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                key="end"
                id={`ShippingPreConfigrationFedEx3Dots_${row.id}`}
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
              >
                <PermissionComponent
                  moduleName="Shipping and Pickup"
                  pageName="Pre-Configuration Setup"
                  permissionIdentifier="Edit"
                >
                  <Dropdown.Item
                    id={`ShippingPreConfigrationFedExEdit`}
                    eventKey="2"
                    onClick={() => getValues(row, "Edit")}
                  >
                    <i className={"fa fa-edit text-primary mr-2"}></i>
                    {t("Edit")}
                  </Dropdown.Item>
                </PermissionComponent>
                {row.isActive ? (
                  <PermissionComponent
                    moduleName="Shipping and Pickup"
                    pageName="Pre-Configuration Setup"
                    permissionIdentifier="Inactive"
                  >
                    <Dropdown.Item
                      id={`ShippingPreConfigrationFedExInactive`}
                      eventKey="2"
                      onClick={() => {
                        saveUpsPreconfiguration(!row.isActive, row.id);
                      }}
                    >
                      <i className={"fa fa-ban text-danger mr-2"}></i>
                      {t("In-Active")}
                    </Dropdown.Item>
                  </PermissionComponent>
                ) : (
                  <PermissionComponent
                    moduleName="Shipping and Pickup"
                    pageName="Pre-Configuration Setup"
                    permissionIdentifier="Active"
                  >
                    <Dropdown.Item
                      id={`ShippingPreConfigrationFedExActive`}
                      eventKey="2"
                      onClick={() => {
                        saveUpsPreconfiguration(!row.isActive, row.id);
                      }}
                    >
                      <i className={"fa fa-circle-check text-success mr-2"}></i>
                      {t("Active")}
                    </Dropdown.Item>
                  </PermissionComponent>
                )}
              </DropdownButton>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell id={`ShippingPreConfigrationFedExAccountNumber_${row.id}`}>
        {row.rowStatus ? (
          <input
            id={`ShippingPreConfigrationFedExAccountNumber`}
            type="text"
            name="accountNumber"
            className="form-control bg-white mb-3 mb-lg-0"
            
            value={row.accountNumber}
            onChange={(e: any) => {
              handleChange(e.target.name, e.target.value, row.id);
            }}
          />
        ) : (
          <span>{row.accountNumber}</span>
        )}
      </TableCell>
      <TableCell id={`ShippingPreConfigrationFedExGrantType_${row.id}`}>
        {row.rowStatus ? (
          <input
            id={`ShippingPreConfigrationFedExGrantType`}
            type="text"
            name="grantType"
            className="form-control bg-white mb-3 mb-lg-0"
            
            value={row.grantType}
            onChange={(e: any) => {
              handleChange(e.target.name, e.target.value, row.id);
            }}
          />
        ) : (
          <span>{row.grantType}</span>
        )}
      </TableCell>
      <TableCell id={`ShippingPreConfigrationFedExAPIKey_${row.id}`}>
        {row.rowStatus ? (
          <input
            id={`ShippingPreConfigrationFedExAPIKey`}
            type="text"
            name="apiKey"
            className="form-control bg-white mb-3 mb-lg-0"
            
            value={row.apiKey}
            onChange={(e: any) => {
              handleChange(e.target.name, e.target.value, row.id);
            }}
          />
        ) : (
          <span>{row.apiKey}</span>
        )}
      </TableCell>
      <TableCell id={`ShippingPreConfigrationFedExClintSecretKey_${row.id}`}>
        {row.rowStatus ? (
          <input
            id={`ShippingPreConfigrationFedExClintSecretKey`}
            type="text"
            name="clientSecretKey"
            className="form-control bg-white mb-3 mb-lg-0"
            
            value={row.clientSecretKey}
            onChange={(e: any) => {
              handleChange(e.target.name, e.target.value, row.id);
            }}
          />
        ) : (
          <span>{row?.clientSecretKey}</span>
        )}
      </TableCell>
      <TableCell id={`ShippingPreConfigrationFedExPathName_${row.id}`}>
        {row.rowStatus ? (
          <input
            id={`ShippingPreConfigrationFedExPathName`}
            type="text"
            name="pathName"
            className="form-control bg-white mb-3 mb-lg-0"
            
            value={row.pathName}
            onChange={(e: any) => {
              handleChange(e.target.name, e.target.value, row.id);
            }}
          />
        ) : (
          <span>{row.pathName}</span>
        )}
      </TableCell>
      <TableCell id={`ShippingPreConfigrationFedExSwitchBox_${row.id}`}>
        {row.rowStatus ? (
          <div className="d-flex justify-content-center form-check form-switch">
            <input
              id={`ShippingPreConfigrationFedExAwitchBox`}
              className="form-check-input"
              type="checkbox"
              role="switch"
              name="isDefault"
              checked={row.isDefault}
              defaultChecked={false}
              onChange={(e: any) => {
                handleChange("isDefault", e.target.checked, row.id);
              }}
            />
          </div>
        ) : (
          <span className="d-flex justify-content-center">
            {row.isDefault ? (
              <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
            ) : (
              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
            )}
          </span>
        )}
      </TableCell>
      <TableCell id={`ShippingPreConfigrationFedExStatusSwitch_${row.id}`}>
        {row.rowStatus ? (
          <div className="d-flex justify-content-center form-check form-switch">
            <input
              id={`ShippingPreConfigrationFedExStatusSwitch`}
              className="form-check-input"
              type="checkbox"
              role="switch"
              name="isActive"
              checked={row.isActive}
              defaultChecked={false}
              onChange={(e: any) => {
                handleChange("isActive", e.target.checked, row.id);
              }}
            />
          </div>
        ) : (
          <span className="d-flex justify-content-center">
            {row.isActive ? (
              <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
            ) : (
              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
            )}
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}

export default Row;
