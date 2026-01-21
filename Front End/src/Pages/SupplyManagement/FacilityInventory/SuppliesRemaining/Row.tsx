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
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import { AddIcon, RemoveICon } from "../../../../Shared/Icons";
import ExpandableRow from "./ExpandableRow";

function Row(props: { row: any }) {
  const { row } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facilityBalance, setFacilityBalance] = useState<any>(null);

  const GetInventoryBalanceById = async () => {
    setLoading(true);
    await InsuranceService.GetInventoryBalanceByFacilityId(row?.value).then(
      (res: AxiosResponse) => {
        setFacilityBalance(res?.data?.data);
        setLoading(false);
      }
    );
  };

  return (
    <>
      <TableRow className="h-30px">
        <TableCell width={50} align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
          >
            {open ? (
              <button
                id={`FacilityInventoryCloseExpand_${row.value}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                <RemoveICon />
              </button>
            ) : (
              <button
                id={`FacilityInventoryOpenExpand_${row.value}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                onClick={GetInventoryBalanceById}
              >
                <AddIcon />
              </button>
            )}
          </IconButton>
        </TableCell>
        <TableCell
          id={`FacilityInventoryItemName_${row.value}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.label}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={2} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-10 bg-white">
                    <ExpandableRow
                      facilityBalance={facilityBalance}
                      loading={loading}
                    />
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
