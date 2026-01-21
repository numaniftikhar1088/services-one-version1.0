import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import BootstrapModal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  RemoveICon,
} from "../../../../Shared/Icons";

import { savePanelSetup } from "../../../../Services/Compendium/BloodLisCompendium/BloodLisCompendium";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import useLang from "./../../../../Shared/hooks/useLanguage";
import {
  EventType,
  GroupDetails,
  PanelTypes,
  ReferenceLab,
  RowInterface,
} from "./Headers";
import TestList from "./TestList";

interface RowProps {
  item: any;
  setSearchRequest: any;
  initialSearchQuery: any;
  setIsAddButtonDisabled: any;
  panelTypes: PanelTypes[];
  referenceLab: ReferenceLab[];
  index: number;
  setRows: React.Dispatch<React.SetStateAction<RowInterface[]>>;
  rows: RowInterface[];
  groupLookup: GroupDetails[];
  handleChange: (name: string, value: string, id: number) => void;
  handleChangeGroup: (id: number, event: EventType) => void;
  getPanelData: any;
  isAdmin: boolean;
}

const Row = ({
  item,
  panelTypes,
  referenceLab,
  index,
  setRows,
  rows,
  handleChange,
  groupLookup,
  handleChangeGroup,
  setIsAddButtonDisabled,
  getPanelData,
  initialSearchQuery,
  setSearchRequest,
  isAdmin,
}: RowProps) => {
  const { t } = useLang();

  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [showDuplicateError, setShowDuplicateError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorStatus, setErrorStatus] = useState<string>('');

  const showExpand = () => {
    setIsExpand(!isExpand);
  };

  const getValues = (r: any) => {
    const updatedRows = rows.map((row: any) => {
      if (row.id === r.id) {
        return { ...row, rowStatus: true };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const handleSubmit = async (item: any) => {
    try {
      const API_OBJ = {
        id: item.id ? item.id : 0,
        panelName: item.panelName,
        groupId: item.groupId,
        groupName: item.groupName,
        sortOrder: isAdmin ? (item.sortOrder || null) : null,
      };
      if (item.panelName && item.groupId) {
        const res: AxiosResponse = await savePanelSetup(API_OBJ);

        if (res?.data?.httpStatusCode === 200) {
          setSearchRequest(initialSearchQuery);
          toast.success(t(res?.data?.message));
          setIsAddButtonDisabled(false);
          getPanelData(true, true);
        } else if (res?.data?.httpStatusCode == 409) {
          // Check if the error is related to duplicate sort order/sequence
          setErrorMessage(res?.data?.error || "An error occurred");
          setShowDuplicateError(true);
        } else {
          toast.error(t(res?.data?.error || "An error occurred"));
        }
      } else {
        toast.error(t("Please fill all the required fields"));
      }
    } catch (err: any) {
      if (err?.response?.data?.httpStatusCode === 409) {
        setErrorMessage(err?.response?.data?.error || "An error occurred");
        setShowDuplicateError(true);
      }
    }
  };

  return (
    <>
      <TableRow className="h-30px" key={item.id}>
        <TableCell>
          {item.rowStatus ? null : (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={showExpand}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
            >
              {isExpand ? (
                <button
                  id={`BloodCompendiumDataCategorySetupExpandClose_${item.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`BloodCompendiumDataCategorySetupExpandOpen_${item.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          )}
        </TableCell>
        <TableCell className="text-center">
          <div className="d-flex justify-content-center">
            {item.rowStatus ? (
              <div className="gap-2 d-flex">
                <button
                  id={`BloodCompendiumDataCategorySetupSave`}
                  onClick={() => handleSubmit(item)}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <DoneIcon />
                </button>
                <button
                  id={`BloodCompendiumDataCategorySetupCancel`}
                  onClick={() => {
                    if (item.id != 0) {
                      const updatedRows = rows.map((r: any) => {
                        if (r.id === item.id) {
                          return { ...r, rowStatus: false };
                        }
                        return r;
                      });
                      setRows(updatedRows);
                      getPanelData(true, true);
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
            ) : (
              <div className="rotatebtnn">
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id={`BloodCompendiumDataCategorySetup3Dots_${item.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <Dropdown.Item
                    id={`BloodCompendiumDataCategorySetupEdit`}
                    className="w-auto"
                    eventKey="2"
                    onClick={() => getValues(item)}
                  >
                    <i className={"fa fa-edit text-primary mr-2"}></i>
                    {t("Edit")}
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`BloodCompendiumDataCategorySetupCategoryName_${item.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {item.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`BloodCompendiumDataCategorySetupCategoryName`}
                  type="text"
                  name="panelName"
                  className="form-control bg-white mb-3 mb-lg-0 h-33px rounded-2 fs-8 w-100"
                  placeholder={t("Title")}
                  value={item.panelName}
                  onChange={(e: any) =>
                    handleChange("panelName", e.target.value, item.id)
                  }
                />
              </div>
            </div>
          ) : (
            item?.panelName
          )}
        </TableCell>
        <TableCell
          id={`BloodCompendiumDataCategorySetupGroup_${item.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {item.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`BloodCompendiumDataCategorySetupGroup`}
                  menuPortalTarget={document.body}
                  theme={(theme) => styles(theme)}
                  options={groupLookup}
                  name="groupNames"
                  styles={reactSelectSMStyle}
                  placeholder={t("Group")}
                  value={groupLookup.find((i: any) => i.value === item.groupId)}
                  // value={groupLookup.filter((i: any) =>
                  //   item.groupId.includes(i.value)
                  // )}
                  onChange={(e: any) => handleChangeGroup(item.id, e)}
                />
              </div>
            </div>
          ) : (
            item?.groupName
          )}
        </TableCell>
        {isAdmin && (
          <TableCell
            id={`BloodCompendiumDataCategorySetupSortOrder_${item.id}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item.rowStatus ? (
              <div className="d-flex">
                <div className="w-100">
                  <input
                    id={`BloodCompendiumDataCategorySetupSortOrder`}
                    type="number"
                    name="sortOrder"
                    className="form-control bg-white mb-3 mb-lg-0 h-33px rounded-2 fs-8 w-100"
                    placeholder={t("Sort Order")}
                    value={item.sortOrder || ""}
                    onChange={(e: any) => {
                      handleChange("sortOrder", e.target.value, item.id);
                    }}
                    min="1"
                  />
                </div>
              </div>
            ) : (
              item?.sortOrder || "-"
            )}
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell colSpan={isAdmin ? 10 : 9} className="padding-0">
          <Collapse in={isExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 px-md-10 px-4 pb-6">
                      <TestList
                        item={item}
                        isExpand={isExpand}
                        setIsExpand={setIsExpand}
                        panelTypes={panelTypes}
                        referenceLab={referenceLab}
                        getPanelData={getPanelData}
                      />
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <BootstrapModal
        show={showDuplicateError}
        onHide={() => {
          setShowDuplicateError(false);
          setErrorMessage('');
          setErrorStatus('');
        }}
        backdrop="static"
        keyboard={false}
        className="modal-md text-center"
      >
        <BootstrapModal.Body>
          <div className="mb-3">
            <h1 className="opacity-100">Error!</h1>
            <p className="opacity-75">
              {errorMessage || t("The pre-order sequence you entered is already in use by another user. Please choose a different sequence to proceed.")}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-success py-2"
            onClick={() => {
              setShowDuplicateError(false);
              setErrorMessage('');
              setErrorStatus('');
            }}
          >
            {t("Ok")}
          </button>
        </BootstrapModal.Body>
      </BootstrapModal>
    </>
  );
};

export default Row;
