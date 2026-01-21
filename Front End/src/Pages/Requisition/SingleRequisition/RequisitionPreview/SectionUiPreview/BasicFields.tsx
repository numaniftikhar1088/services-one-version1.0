import moment from "moment";
const BasicFields = ({ fieldsData }: any) => {
  const SplitStringByDollarSign = (inputString: any) => {
    if (typeof inputString !== "string") {
      return <span>{String(inputString)}</span>; // Convert non-string values to a string representation
    }

    const splitIndex = inputString.indexOf("$");
    if (splitIndex === -1) {
      return <span>{inputString}</span>;
    } else {
      const part1 = inputString.substring(0, splitIndex);
      const part2 = inputString.substring(splitIndex + 1);
      return (
        <>
          <span>{part1}</span>
          <br />
          <span className="text-muted" style={{ fontSize: "11px" }}>
            {part2}
          </span>
        </>
      );
    }
  };

  function isValidDate(dateString: string): boolean {
    const [month, day, year] = dateString.split("/").map(Number);
    const parsedDate = new Date(`${year}-${month}-${day}`);
    return (
      parsedDate instanceof Date &&
      !isNaN(parsedDate.getTime()) &&
      parsedDate.getMonth() + 1 === month &&
      parsedDate.getDate() === day &&
      parsedDate.getFullYear() === year
    );
  }
  return (
    <>
      {fieldsData.systemFieldName === "ConfirmationRequired" ||
      fieldsData.systemFieldName === "ConfirmationRequiredN" ? (
        SplitStringByDollarSign(fieldsData?.fieldValue)
      ) : fieldsData?.selectedText ? (
        <span>{fieldsData.selectedText}</span>
      ) : typeof fieldsData?.fieldValue === "boolean" ? (
        fieldsData.fieldValue ? (
          <span className="badge badge-secondary">Yes</span>
        ) : (
          <span className="badge badge-danger">No</span>
        )
      ) : fieldsData?.fieldValue.includes("data:image/png;base64,") ? (
        <img src={fieldsData?.fieldValue} alt="Image" className="h-px" />
      ) : isValidDate(fieldsData.fieldValue) ? (
        <> {moment(fieldsData.fieldValue).format("MM/DD/YYYY")}</>
      ) : (
        <span>{fieldsData.fieldValue}</span>
      )}
    </>
  );
};

export default BasicFields;
