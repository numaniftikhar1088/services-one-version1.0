





import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper, Table } from "@mui/material";

const FamilyHistory = ({ fieldsData }: any) => {
  return (
    <>
      <h6 className="text-primary">Family History</h6>
      <Box sx={{ height: "auto", width: "100%" }}>
        {Array.isArray(fieldsData?.fieldValue) && (
          <div className="table_bordered table-responsive overflow-hidden">
            <TableContainer
              sx={{
                maxHeight: "calc(100vh - 100px)",
                "&::-webkit-scrollbar": { width: 7 },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "var(--kt-dark)",
                },
                "&:hover": {
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "var(--kt-dark)",
                    borderRadius: 2,
                  },
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "var(--kt-dark)",
                  borderRadius: 2,
                },
              }}
              component={Paper}
              className="shadow-none"
            >
              <Table
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0"
              >
                <TableHead className="h-40px">
                  <TableRow>
                    {fieldsData?.fieldValue?.[0]?.fields?.map(
                      (i: any, index: number) => (
                        <TableCell key={index} className="min-w-150px w-150px">
                          {i.displayName}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fieldsData.fieldValue.map((item: any, idx: number) => (
                    <TableRow
                      key={idx}
                      sx={{ "& > *": { borderBottom: "unset" } }}
                    >
                      {item.fields.map((field: any, i: number) => (
                        <TableCell key={i}>
                          <span className="fw-bold">
                            {field.fieldValue === true
                              ? "Yes"
                              : field.fieldValue}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </Box>
    </>
  );
};

export default FamilyHistory;






// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import { Box, Paper, Table } from "@mui/material";

// const FammilyHistory = ({ fieldsData }: any) => {
//   return (
    
//       <>
//         <h6 className="text-primary">Family History</h6>
//         <Box
//           sx={{
//             height: "auto",
//             width: "100%",
//           }}
//         >
//           {Array.isArray(fieldsData?.fieldValue) && (
//             <div className="table_bordered table-responsive overflow-hidden">
//               <TableContainer
//                 sx={{
//                   maxHeight: "calc(100vh - 100px)",
//                   "&::-webkit-scrollbar": {
//                     width: 7,
//                   },
//                   "&::-webkit-scrollbar-track": {
//                     backgroundColor: "var(--kt-dark)",
//                   },
//                   "&:hover": {
//                     "&::-webkit-scrollbar-thumb": {
//                       backgroundColor: "var(--kt-dark)",
//                       borderRadius: 2,
//                     },
//                   },
//                   "&::-webkit-scrollbar-thumb": {
//                     backgroundColor: "var(--kt-dark)",
//                     borderRadius: 2,
//                   },
//                 }}
//                 component={Paper}
//                 className="shadow-none"
//               >
//                 <Table
//                   aria-label="sticky table collapsible"
//                   className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0"
//                 >
//                   <TableHead className="h-40px">
//                     <TableRow>
//                       {Array.isArray(fieldsData?.fieldValue) &&
//                         fieldsData?.fieldValue[0]?.fields?.map((i: any) => (
//                           <TableCell className="min-w-150px w-150px">
//                             {i.displayName}
//                           </TableCell>
//                         ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {Array.isArray(fieldsData?.fieldValue) &&
//                       fieldsData?.fieldValue.map((item: any) => (
//                         <TableRow
//                           sx={{
//                             "& > *": {
//                               borderBottom: "unset",
//                             },
//                           }}
//                         >
//                           {relationItem.fields.map((field: any, i: number) => (
//                             <TableCell key={i}>
//                               <span className="fw-bold">
//                                 {field.fieldValue === true
//                                   ? "Yes"
//                                   : field.fieldValue}
//                               </span>
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </div>

//                 {/* Show <hr> only if it's not the last item */}
//                 {index !== fieldsData.fieldValue.length - 1 && (
//                   <hr className="my-5" />
//                 )}
//               </div>
//             ))}
//         </Box>
//       </>
    
//   );
// };

// export default FammilyHistory;
