import { TableCell, TableRow } from "@mui/material";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";

function DownloadRow({ row, ShowBlob }: any) {
  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell id={`FileName_${row.id}`} sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between cursor-pointer">
            <div
              style={{
                width: "max-content",
              }}
            >
              {row.fileName}
            </div>
          </div>
        </TableCell>

        <TableCell
          id={`FileDate_${row.id}`}
          sx={{
            width: "max-content",
          }}
        >
          <div className="d-flex justify-content-between cursor-pointer" >
            {row.fileDate}
          </div>
        </TableCell>
        <TableCell
          sx={{
            width: "max-content",
          }}
        >
          <div className="d-flex justify-content-center">
            <button
            id={`DownloadButton_${row.id}`}
              className="btn btn-icon btn-sm fw-bold btn-success btn-icon-light"
              disabled={row.blobURL == null ? true : false}
              onClick={() => ShowBlob(row.blobURL)}
            >
              <i className="fa fa-download"></i>
            </button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}

export default DownloadRow;
