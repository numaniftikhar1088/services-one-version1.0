// ✅ Row.tsx - Updated for dynamic rendering and selection

import { TableCell, TableRow } from "@mui/material";

// Define props expected from parent
interface Props {
  data: {
    id: number;
    facilityName: string;
    serviceDate: string;
    receiveDate: string;
    orderNumber: string;
    accessionNumber: string;
    accessionStatus: string;
    patientId: string;
    billingType: string;
    totalAmount: string;
    addedDate: string;
  };
  selected: boolean;
  onSelect: () => void;
}

const CreatInvoiceRow = ({ data, selected, onSelect }: Props) => {
  return (
    <TableRow
      className={selected ? "table-active h-30px" : "h-30px"}
      onClick={onSelect}
      selected={selected}
      style={{ cursor: "pointer" }}
    >
      <TableCell>
        <input type="checkbox" checked={selected} readOnly />
      </TableCell>
      <TableCell>{data.facilityName}</TableCell>
      <TableCell>{data.serviceDate}</TableCell>
      <TableCell>{data.receiveDate}</TableCell>
      <TableCell>{data.orderNumber}</TableCell>
      <TableCell>{data.accessionNumber}</TableCell>
      <TableCell>{data.accessionStatus}</TableCell>
      <TableCell>{data.patientId}</TableCell>
      <TableCell>{data.billingType}</TableCell>
      <TableCell>{data.totalAmount}</TableCell>
      <TableCell>{data.addedDate}</TableCell>
    </TableRow>
  );
};

export default CreatInvoiceRow;
