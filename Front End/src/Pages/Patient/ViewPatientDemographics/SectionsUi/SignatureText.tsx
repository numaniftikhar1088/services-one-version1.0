import React from "react";
import Base64Image from "../../../../Shared/Base64toImage";

const SignatureText = (props: any) => {
  return (
    <>
      <Base64Image base64String={props.fieldsInfo.fieldValue} />
    </>
  );
};

export default SignatureText;
