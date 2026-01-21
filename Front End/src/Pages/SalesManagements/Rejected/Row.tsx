import { TableCell, TableRow } from '@mui/material';

function Row({
  item,
}: any) {

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} key={item.id}>
      <TableCell align="left" scope="row">
        <span>{item.firstName}</span>
      </TableCell>
      <TableCell align="left" scope="row">
        <span>{item.lastName}</span>
      </TableCell>
      <TableCell align="left" scope="row">
        <span>{item.positionTitle}</span>
      </TableCell>
      <TableCell align="left" scope="row">
        <span>{item.salesRepNumber}</span>
      </TableCell>
      <TableCell align="left" scope="row">
        <span>{item.email}</span>
      </TableCell>
      <TableCell align="left" scope="row">
        <span>{item.phoneNumber}</span>
      </TableCell>
      <TableCell align="left" scope="row">
        <span>{item.actionBy}</span>
      </TableCell>
      <TableCell align="left" scope="row">
        <span>{new Date(item.actionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
      </TableCell>
    </TableRow >


  )
}

export default Row
{ }