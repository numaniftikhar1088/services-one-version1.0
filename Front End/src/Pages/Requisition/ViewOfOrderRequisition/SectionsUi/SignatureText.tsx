import { useSelector } from "react-redux";
const SignatureText = (props: any) => {
  const user = useSelector((state: any) => state?.Reducer);
  if (
    props.fieldsInfo.systemFieldName === "PatientSignature" ||
    props.fieldsInfo.systemFieldName === "PhysicianSignature"
  ) {
    return (
      <>
        <img
          src={props?.fieldsInfo?.fieldValue}
          alt={user?.selectedTenantInfo?.name}
          style={{ width: "300px", height: "auto" }}
        />
      </>
    );
  } else return null;
};

export default SignatureText;
