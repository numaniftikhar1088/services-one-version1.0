import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../Shared/Icons";
import { useSelector } from "react-redux";
import { UserType } from "Utils/Common/Enums/Enums";
import { isJson } from "Utils/Common/Requisition";

const Row = (props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  handleChange: Function;
  handleSubmit: Function;
  loadGridData: Function;
  request: any;
  setRequest: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    handleChange,
    handleSubmit,
    loadGridData,
    request,
    setRequest,
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
  const handleChangeRichTextInput = (value: any) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === row.id
          ? {
              ...x,
              configurationValues: value,
            }
          : x
      )
    );
  };

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === row.id
          ? {
              ...x,
              configurationValues: value,
            }
          : x
      )
    );
  };

  function htmlToText(html: any) {
    let plainText = html.replace(/<[^>]+>/g, "");
    const cssRuleRegex =
      /html,\s*body\s*{\s*padding:\s*0;\s*margin:\s*0;\s*}\s*/g;
    plainText = plainText.replace(cssRuleRegex, "");
    return plainText.trim();
  }
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request ? (
                    <button
                      id={`DynamicConfigurationLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`DynamicConfigurationSave`}
                      onClick={() => {
                        handleSubmit(row);
                      }}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`DynamicConfigurationCancel`}
                    onClick={() => {
                      if (row.id !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.id === row.id) {
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
                      }
                      setRequest(false);
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
                  id={`DynamicConfiguration3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    <PermissionComponent
                      moduleName="Setup"
                      pageName="Dynamic Configuration"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        id={`DynamicConfigurationEdit`}
                        className="auto"
                        eventKey="2"
                        onClick={() => getValues(row, "Edit")}
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
                  </>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`DynamicConfigurationConfigIdentifire_${row.id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="w-100">
              <input
                id={`DynamicConfigurationConfigIdentifire`}
                type="text"
                name="configIdentifier"
                className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-33px"
                placeholder={t("Configuration Identifier")}
                value={row?.configIdentifier}
                disabled={true}
              />
            </div>
          ) : (
            <span>{row?.configIdentifier}</span>
          )}
        </TableCell>
        <TableCell id={`DynamicConfigurationConfigValue_${row.id}`} scope="row">
          {row.rowStatus ? (
            row?.configIdentifierType?.toLowerCase() === "template" ? (
              <ReactQuill
                id={`DynamicConfigurationConfigValue`}
                theme="snow"
                value={row?.configurationValues}
                readOnly={false}
                onChange={handleChangeRichTextInput}
              />
            ) : isJson(row?.configurationValues) ? (
              <textarea
                id={`DynamicConfigurationConfigTextarea`}
                name="configurationValues"
                style={{ fontFamily: "monospace", resize: "vertical" }}
                className="form-control bg-white min-w-100px w-100 rounded-2 fs-8"
                placeholder={t("Configuration Value")}
                value={row?.configurationValues}
                draggable={true}
                rows={5}
                onChange={handleInputChange}
              />
            ) : (
              <input
                id={`DynamicConfigurationConfigValueInput`}
                type="text"
                name="configurationValues"
                className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-33px"
                placeholder={t("Configuration Value")}
                value={row?.configurationValues}
                onChange={handleInputChange}
              />
            )
          ) : (
            <>{htmlToText(row?.configurationValues)}</>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
