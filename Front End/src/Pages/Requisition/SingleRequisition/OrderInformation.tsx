import React, { useState } from "react";
import Radio from "../../../Shared/Common/Input/Radio";
import NormalOrder from "../OrderInformation/NormalOrder";
import CollectionRequest from "../OrderInformation/CollectionRequest";

const OrderInformation = () => {
  const [RadioValues, setRadioValues] = useState("0");
  const handleChange = (e: any) => {
    const value = e.target.value;
    setRadioValues(value);
  };
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="m-0">Order information</h3>
      </div>
      <div className="card-body py-md-4 py-3">
        <div className="row">
          <div className="mb-5 col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <label>Order Type</label>
            <div className="row m-0">
              <Radio
                name="accountActivationType"
                onChange={handleChange}
                choices={[
                  {
                    id: "Normal",
                    label: "Normal",
                    value: "0",
                  },
                  {
                    id: "CollectionRequest",
                    label: "Collection Request",
                    value: "1",
                  },
                ]}
                checked={RadioValues}
              />
            </div>
          </div>
          {RadioValues == "0" ? <NormalOrder /> : null}
          {RadioValues == "1" ? <CollectionRequest /> : null}
        </div>
      </div>
    </div>
  );
};

export default OrderInformation;
