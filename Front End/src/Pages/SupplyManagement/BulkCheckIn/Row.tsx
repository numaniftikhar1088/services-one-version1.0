import { TableCell, TableRow } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import Select from "react-select";
import InsuranceService from "../../../Services/InsuranceService/InsuranceService";
import { stylesResultData } from "../../../Utils/Common";
import { reactSelectSMStyle } from "../../../Utils/Common/index";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";

export const Rows = ({
  row,
  handleNumberOfRowsAddition,
  isBarCodeActive,
  supplyItemsData,
  setRows,
  rows,
  index,
  setOpenAlert,
  setDeleteIndex,
  handleRemoveRow,
}: any) => {
  const { t } = useLang();
  const handleDescriptionData = async (e: any, srNo: number) => {
    let payload = {
      isBarCode: isBarCodeActive,
      value: e.value.toString(),
    };
    const response = await InsuranceService.getSupplyItemsDescriptionByBarCode(
      payload
    );
    if (response.data.httpStatusCode === 200) {
      setRows((curr: any) =>
        curr.map((x: any) =>
          x.srNo === srNo
            ? {
                ...x,
                id: response?.data?.data?.id,
                itemDescription: response?.data?.data?.itemDescription,
              }
            : x
        )
      );
      toast.success(t(response.data.message));
    } else {
      toast.error(t(response.data.error));
    }
  };

  const handleEnterPress = (event: any, srNo: number) => {
    if (event.key === "Enter") {
      handleDescriptionData({ value: row?.barCode }, srNo);
    }
  };

  const handleChange = (name: string, value: string, srNo: number) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.srNo === srNo
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  const showPopUp = (index: number) => {
    setOpenAlert(true);
    setDeleteIndex(index);
  };

  return (
    <TableRow>
      <TableCell id={`BulkCheckInInvertory_${row.srNo}`}>{row.srNo}</TableCell>
      <TableCell>
        {isBarCodeActive ? (
          <input
            id={`BulkCheckInInvertoryBarCode_${row.srNo}`}
            type="text"
            name="barCode"
            className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-33px"
            onKeyDown={(e) => handleEnterPress(e, row.srNo)}
            onChange={(e) =>
              handleChange(e.target.name, e.target.value, row.srNo)
            }
            value={row?.barCode}
          />
        ) : (
          <Select
            inputId={`BulkCheckInInvertoryInventoryItem_${row.srNo}`}
            menuPortalTarget={document.body}
            styles={reactSelectSMStyle}
            theme={(theme: any) => stylesResultData(theme)}
            placeholder={t("--- Select ---")}
            options={supplyItemsData}
            onChange={(e) => handleDescriptionData(e, row.srNo)}
            menuPosition={"fixed"}
            value={supplyItemsData.filter((item: any) => item.value === row.id)}
          />
        )}
      </TableCell>
      <TableCell>
        <input
          id={`BulkCheckInInvertoryItemDescription_${row.srNo}`}
          type="text"
          disabled
          name="itemDescription"
          value={row?.itemDescription}
          onChange={(e) =>
            handleChange(e.target.name, e.target.value, row.srNo)
          }
          className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-33px"
        />
      </TableCell>
      <TableCell>
        <input
          id={`BulkCheckInInvertoryLotSerialNumber_${row.srNo}`}
          type="text"
          name="lotSerialNumber"
          className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-33px"
          onChange={(e) =>
            handleChange(e.target.name, e.target.value, row.srNo)
          }
          value={row.lotSerialNumber}
        />
      </TableCell>
      <TableCell>
        <input
          id={`BulkCheckInInvertoryQuantity_${row.srNo}`}
          type="number"
          name="quantity"
          className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-33px"
          style={{
            border:
              row.id > 0 && (row.quantity <= 0 || row.quantity === "")
                ? "1px solid red"
                : "",
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 6) {
              handleChange(e.target.name, value, row.srNo);
            }
          }}
          value={row.quantity}
          onKeyDown={(e) =>
            rows.length - 1 === index &&
            e.key === "Enter" &&
            handleNumberOfRowsAddition(1)
          }
        />
      </TableCell>
      <TableCell id={`BulkCheckInInvertoryCroseRow_${row.srNo}`}>
        <RxCross2
          id={`BulkCheckInInvertoryCroseRow_${row.srNo}`}
          color="red"
          size={25}
          onClick={() =>
            row.id > 0 ? showPopUp(index) : handleRemoveRow(index)
          }
          style={{ cursor: "pointer" }}
        />
      </TableCell>
    </TableRow>
  );
};
