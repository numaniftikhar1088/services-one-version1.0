import { showFieldValue } from "../../../../Utils/Requisition/OrderView";

const RequisitionFields = (props: any) => {
  const { fieldsInfo, fieldData } = props;
  return <>{showFieldValue(fieldsInfo, fieldData)}</>;
};

export default RequisitionFields;
