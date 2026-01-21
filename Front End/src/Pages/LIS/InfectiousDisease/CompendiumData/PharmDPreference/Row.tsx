import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { SavePharmDPreference } from "Services/InfectiousDisease/PharmDPreference";
import useLang from "Shared/hooks/useLanguage";
import { styles } from "Utils/Common";
import React, { memo } from "react";
import { Dropdown } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import { toast } from "react-toastify";
import { defaultSearchQuery } from ".";
import PermissionComponent from "../../../../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon } from "../../../../../Shared/Icons";
import { validateFields } from "Pages/LIS/Toxicology/CommonFunctions";

export interface PharmDPreferenceRow {
  pharmD: string;
  pharmDId: number;
  panels: Object[];
  facility: string;
  facilityId: number;
  rowStatus: boolean;
  preferenceId: number;
  performingLab: string;
  performingLabId: number;
}

const Row = (props: {
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  PanelLookUp: Function;
  setDropDownValues: any;
  loadGridData: Function;
  FacilityLookUp: Function;
  row: PharmDPreferenceRow;
  queryDisplayTagNames: any;
  setIsAddButtonDisabled: any;
  PharmDSelectionLookUp: Function;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    PanelLookUp,
    loadGridData,
    FacilityLookUp,
    dropDownValues,
    setDropDownValues,
    queryDisplayTagNames,
    PharmDSelectionLookUp,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      FacilityLookUp(row.performingLabId);
      PanelLookUp(row.performingLabId, row.facilityId);
      PharmDSelectionLookUp(row.facilityId);
      const updatedRows = rows.map((row: any) => {
        if (row.preferenceId === r.preferenceId) {
          return {
            ...row,
            rowStatus: true,
          };
        }
        return row;
      });

      setRows(updatedRows);
    }
  };

  const handleSubmit = async () => {
    const { isValid, invalidField } = validateFields({
      performingLab: row.performingLabId,
      facility: row.facilityId,
      panelName: row.panels.length,
      pharmD: row.pharmDId,
    });

    if (isValid) {
      const submittedResults = {
        preferenceId: row.preferenceId,
        panelIds: row.panels.map((item: any) => item.panelId),
        performingLabId: row.performingLabId,
        facilityId: row.facilityId,
        pharmDOptionId: row.pharmDId,
      };

      try {
        const response = await SavePharmDPreference(submittedResults);

        if (response?.data?.httpStatusCode === 200) {
          toast.success(response?.data?.message);
          loadGridData(true, false);
          setDropDownValues((prev: any) => ({
            ...prev,
            FacilityList: [],
            PanelList: [],
            PharmDSelectionList: [],
          }));
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(t("Something went wrong while saving data."));
      }
    } else {
      const errorMessage = invalidField
        ? `Please Fill ${queryDisplayTagNames[invalidField] ?? ""} field`
        : "Invalid field found";
      toast.error(errorMessage);
    }
  };

  const handleChange = (name: string, value: any, id: number) => {
    if (name === "performingLabId") {
      FacilityLookUp(value);
    }

    if (name === "facilityId" && row.performingLabId) {
      PanelLookUp(row.performingLabId, value);
      PharmDSelectionLookUp(value);
    }

    setRows((curr: any) =>
      curr.map((x: any) => {
        if (x.preferenceId !== id) return x;

        if (name === "panels") {
          const selectedPanels = value.map((item: any) => ({
            panelId: item.value,
            panelName: item.label,
          }));

          return {
            ...x,
            panels: selectedPanels,
          };
        }

        return {
          ...x,
          [name]: value,
        };
      })
    );
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  <button
                    id={`IDCompendiumDataPharmDPreferenceSaveRow`}
                    onClick={handleSubmit}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <DoneIcon />
                  </button>
                  <button
                    id={`IDCompendiumDataPharmDPreferenceCancelSaveRow`}
                    onClick={() => {
                      if (row.preferenceId != 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.preferenceId === row.preferenceId) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        loadGridData(true, false);
                      } else {
                        let newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setIsAddButtonDisabled(false);
                      }
                      setDropDownValues((prev: any) => ({
                        ...prev,
                        FacilityList: [],
                        PanelList: [],
                        PharmDSelectionList: [],
                      }));
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
                  id={`IDCompendiumDataPharmDPreference3Dots_${row.preferenceId}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`IDCompendiumDataPharmDPreferenceEdit`}
                      eventKey="2"
                      onClick={() => getValues(row, "Edit")}
                      className="w-auto"
                    >
                      <span className="menu-item px-3">
                        <i
                          className="fa fa-edit"
                          style={{ fontSize: "16px", color: "green" }}
                        ></i>
                        {t("Edit")}
                      </span>
                    </Dropdown.Item>
                  </PermissionComponent>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPharmDPreferencePerformingLab_${row.preferenceId}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataPharmD_performingLab"
                  menuPortalTarget={document.body}
                  options={dropDownValues.PerformingLabList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Performing Lab")}
                  name="performingLabId"
                  value={dropDownValues.PerformingLabList?.filter(
                    (item: any) => item?.value == row?.performingLabId
                  )}
                  onChange={(event: any) => {
                    handleChange(
                      "performingLabId",
                      event.value,
                      row.preferenceId
                    );
                  }}
                />
              </div>
            </div>
          ) : (
            <span>{row?.performingLab}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPharmDPreferenceFacility_${row.preferenceId}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataPharmD_facility"
                  menuPortalTarget={document.body}
                  options={dropDownValues.FacilityList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Facility")}
                  name="facilityId"
                  value={dropDownValues.FacilityList?.filter(
                    (item: any) => item?.value == row?.facilityId
                  )}
                  onChange={(event: any) => {
                    handleChange("facilityId", event.value, row.preferenceId);
                  }}
                />
              </div>
            </div>
          ) : (
            <span className="text-capitalize">{row?.facility}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPharmDPreferencePanelName_${row.preferenceId}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataPharmD_panelName"
                  menuPortalTarget={document.body}
                  options={dropDownValues.PanelList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Panel Name")}
                  isMulti
                  name="panels"
                  value={dropDownValues.PanelList?.filter((option: any) =>
                    row?.panels?.some((i: any) => option.value === i.panelId)
                  )}
                  onChange={(event: any) => {
                    handleChange("panels", event, row.preferenceId);
                  }}
                />
              </div>
            </div>
          ) : (
            row?.panels.map((item: any, index: number, array: any[]) => (
              <>
                <span key={index}>{item?.panelName}</span>
                {index < array.length - 1 ? ", " : ""}
              </>
            ))
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPharmDPreferencePharmD_${row.preferenceId}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="IDCompendiumDataPharmD_pharmD"
                  menuPortalTarget={document.body}
                  options={dropDownValues.PharmDSelectionList}
                  theme={(theme) => styles(theme)}
                  placeholder={t("PharmD Preference")}
                  name="pharmDId"
                  value={dropDownValues.PharmDSelectionList?.filter(
                    (item: any) => item?.value == row?.pharmDId
                  )}
                  onChange={(event: any) => {
                    handleChange("pharmDId", event.value, row.preferenceId);
                  }}
                />
              </div>
            </div>
          ) : (
            <span>{row?.pharmD}</span>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
