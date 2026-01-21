import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { toast } from "react-toastify";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import { LoaderIcon } from "../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
const InnerSectionTemplateSetting = (props: {
  innerRow: any;
  setOpen: any;
  loadGridData: any;
}) => {
  const { t } = useLang();

  let { innerRow, setOpen, loadGridData } = props;
  const [request, setRequest] = useState<any>(false);
  const [data, setData] = useState(innerRow);
  const ArrayOfObjects = async (row: any, check: any) => {
    const index = innerRow.findIndex((roww: any) => roww.id === row.id);
    if (index !== -1) {
      const updatedInnerRow = [...data];
      updatedInnerRow[index].isActive = check ? false : true;
      setData(updatedInnerRow);
    }
  };
  const handleChangeInput1 = async (id: number, e: any) => {
    const index = innerRow.findIndex((roww: any) => roww.id === id);
    if (index !== -1) {
      const updatedInnerRow = [...data];
      updatedInnerRow[index].customCellName = e.target.value;
      setData(updatedInnerRow);
    }
  };
  const handleChangeInput2 = async (id: number, e: any) => {
    const index = innerRow.findIndex((row: any) => row.id === id);
    const updatedInnerRow = [...data];
    if (e.target.value === "") {
      e.target.value = 0;
    }
    updatedInnerRow[index].customCellOrder = parseInt(e.target.value);
    setData(updatedInnerRow);
  };
  const handleSubmit = async () => {
    setRequest(true);
    try {
      const res = await FacilityService.SaveCells(data);

      if (res?.data.statusCode === 200) {
        toast.success(t(res?.data?.message));
        setRequest(false);
        setOpen(false);
        loadGridData(true, true);
      }
    } catch (err) {
      console.trace(err);
    }
  };

  return (
    <>
      <div className="py-2">
        <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2">
          <button
            id={`ToxResultPreConfigurationExpandCancel`}
            className=" btn btn-secondary btn-sm btn-secondary--icon fw-bold py-2 rounded-3"
            onClick={() => setOpen(false)}
          >
            {t("Cancel")}
          </button>

          <button
            id={`ToxResultPreConfigurationExpandSave`}
            className="btn btn-primary btn-sm fw-500 py-2 rounded-3"
            onClick={handleSubmit}
          >
            {request ? <LoaderIcon /> : null}
            <span>{t("Save")}</span>
          </button>
        </div>
        <div className="table_bordered overflow-hidden">
          <TableContainer className="shadow-none">
            <Table
              // stickyHeader
              aria-label="sticky table collapsible"
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              <TableHead>
                <TableRow>
                  <TableCell className="min-w-200px w-200px">
                    {t("System Cell Name")}
                  </TableCell>
                  <TableCell className="min-w-200px w-200px">
                    {t("Custom Cell Name")}
                  </TableCell>
                  <TableCell className="min-w-200px w-200px">
                    {t("Custom Cell ID")}
                  </TableCell>
                  <TableCell className="min-w-50px w-50px">
                    {t("Exclude/Include")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row: any) => (
                  <TableRow>
                    <TableCell
                      id={`PreConfigurationExpandSysTemCellName_${row.id}`}
                    >
                      {row.systemCellName}
                    </TableCell>
                    <TableCell>
                      <input
                        id={`PreConfigurationExpandCustomCellName_${row.id}`}
                        type="text"
                        className="form-control bg-white h-25px rounded-2 py-0 line-height-0 fs-8 fw-500 px-2"
                        placeholder={t("Custom Cell Name")}
                        name="customCellName"
                        value={row.customCellName}
                        onChange={(event: any) =>
                          handleChangeInput1(row.id, event)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`PreConfigurationExpandCustomCellOrder_${row.id}`}
                        type="text"
                        className="form-control bg-white h-25px rounded-2 py-0 line-height-0 fs-8 fw-500 px-2"
                        placeholder={t("Custom Cell Order")}
                        value={row.customCellOrder}
                        name="customCellOrder"
                        onChange={(event: any) =>
                          handleChangeInput2(row.id, event)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="d-flex justify-content-center">
                        <div className="form-check form-switch">
                          <input
                            id={`PreConfigurationExpandSwitchButton_${row.id}`}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            name="isActive"
                            checked={row.isActive}
                            onChange={() => ArrayOfObjects(row, row.isActive)}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default InnerSectionTemplateSetting;
