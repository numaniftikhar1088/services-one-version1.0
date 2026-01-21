import moment from "moment";

export const ViewRequisitionTabsArr = [
  { label: "Open", value: 1 },
  { label: "Completed", value: 3 },
  { label: "Rejected", value: 4 },
  { label: "Deleted", value: 5 },
  { label: "On Hold", value: 2 },
  { label: "All Requisition", value: 0 },
];

export const ResultDataTabsArr = [
  { label: "Panding", value: 1 },
  { label: "Completed", value: 3 },
  { label: "Archived", value: 5 },
];

export const BulkActionArr = {
  StatusArr: [
    { label: "Completed", dropDownValue: "dropdown1", bulkStatus: 3 },
    { label: "Deleted", dropDownValue: "dropdown1", bulkStatus: 5 },
    { label: "On Hold", dropDownValue: "dropdown1", bulkStatus: 2 },
    { label: "Rejected", dropDownValue: "dropdown1", bulkStatus: 4 },
  ],
  PrintArr: [
    { label: "Print Selected Label", dropDownValue: "dropdown1" },
    { label: "Print Selected Records", dropDownValue: "dropdown1" },
    { label: "Print Selected Reports", dropDownValue: "dropdown1" },
  ],
};

export const dateFormatConversion = (RowsData: any, columnKey: string) => {
  if (
    columnKey.toLowerCase() === "addeddate" ||
    columnKey.toLowerCase() === "validatedate" ||
    columnKey.toLowerCase() === "dob" ||
    columnKey.toLowerCase() === "receiveddate" ||
    columnKey.toLowerCase() === "publisheddate" ||
    columnKey.toLowerCase() === "dateofcollection" ||
    columnKey.toLowerCase() === "rejecteddate" ||
    columnKey.toLowerCase() === "collectiondate" ||
    columnKey.toLowerCase() === "recollectdate" ||
    columnKey.toLowerCase() === "createddate"
  ) {
    if (RowsData[columnKey]) {
      return moment(RowsData[columnKey]).format("MM/DD/YYYY");
    } else {
      return "";
    }
  } else {
    return RowsData[columnKey];
  }
};
