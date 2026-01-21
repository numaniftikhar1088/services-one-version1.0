import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Modal } from "react-bootstrap";

function CorrectiveActionModal({ open, handleClose }: any) {
  return (
    <Modal show={open} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton className="py-4">
        <Modal.Title className="h5">QC Corrective Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TableContainer
          sx={{
            maxHeight: "calc(100vh - 100px)",
            "&::-webkit-scrollbar": {
              width: 7,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#fff",
            },
            "&:hover": {
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "var(--kt-gray-400)",
                borderRadius: 2,
              },
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--kt-gray-400)",
              borderRadius: 2,
            },
          }}
          component={Paper}
          className="shadow-none"
        >
          <Table
            stickyHeader
            aria-label="sticky table collapsible"
            className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center mb-1"
          >
            <TableHead className="h-35px">
              <TableRow>
                <TableCell
                  id={`ManageFacilityAsignUser1stName`}
                  className="min-w-50px"
                >
                  Drug Class
                </TableCell>
                <TableCell
                  id={`ManageFacilityAsignUserLastName`}
                  className="min-w-50px"
                >
                  Result
                </TableCell>
                <TableCell
                  id={`ManageFacilityAsignUserUserRole`}
                  className="min-w-50px"
                >
                  Acceptable Range
                </TableCell>
                <TableCell
                  id={`ManageFacilityAsignUserUserName`}
                  className="min-w-50px"
                >
                  Corrective Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>PCP</TableCell>
                <TableCell>987</TableCell>
                <TableCell>987</TableCell>
                <TableCell>{/* {item?.username} */}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>PCP</TableCell>
                <TableCell>76</TableCell>
                <TableCell>76</TableCell>
                <TableCell>{/* {item?.username} */}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Modal.Body>
      <Modal.Footer className="py-2">
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={handleClose}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CorrectiveActionModal;
