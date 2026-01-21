import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import { CrossIcon } from "../../../../Shared/Icons";
import { styles } from "../../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";

function InputsRow(props: {
  itemTypes: any;
  supplyOrders: any;
  i: any;
  setSupplyOrders: any;
  register: any;
  errors: any;
  remove: any;
  field: any;
  clearErrors: any;
  setValue: any;
  handleKeyPress: any;
}) {
  const { t } = useLang();



  
  const {
    itemTypes,
    supplyOrders,
    i,
    setSupplyOrders,
    register,
    errors,
    remove,
    field,
    clearErrors,
    setValue,
    handleKeyPress,
  } = props;
  const [dropdown2, setDropdown2] = useState([]);
  const [itemTypeChanged, setItemTypeChanged] = useState(null);
  const loadItemLookUp = (type: any) => {
    InsuranceService.GetItemLookup(type)
      .then((res: AxiosResponse) => {
        setDropdown2(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  const GetSupplyItemDescriptionById = (
    e: any,
    index: number,
    name: string
  ) => {
    InsuranceService.GetSupplyItemDescriptionById(e.value)
      .then((res: AxiosResponse) => {
        const newSupplyOrders = [...supplyOrders];
        newSupplyOrders[index] = {
          ...newSupplyOrders[index],
          itemDescription: res.data.data,
          [name]: e.label,
          supplyItemId: e.value,
        };
        setSupplyOrders(newSupplyOrders);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const handleChangeSupplyOrder = (e: any, name: string, index: any) => {
    const newSupplyOrders = [...supplyOrders];
    if (name === "itemName") {
      newSupplyOrders[index] = {
        ...newSupplyOrders[index],
        [name]: e.label,
        supplyItemId: e.value,
      };
      GetSupplyItemDescriptionById(e, index, name);
    } else {
      newSupplyOrders[index] = {
        ...newSupplyOrders[index],
        [name]: e.label,
      };
    }
    setSupplyOrders(newSupplyOrders);
    if (name === "itemType") {
      setItemTypeChanged(e.value);
    }

    setValue(`supplyOrder.${index}.${name}`, `supplyOrder.${index}.${e.value}`);
    clearErrors(`supplyOrder.${index}.${name}`);
  };
  const onInputChange = (e: any, index: number) => {
    const newSupplyOrders = [...supplyOrders];
    newSupplyOrders[index] = {
      ...newSupplyOrders[index],
      [e.target.name]: e.target.value,
    };
    setSupplyOrders(newSupplyOrders);
    setValue(
      `supplyOrder.${index}.${e.target.name}`,
      `supplyOrder.${index}.${e.target.value}`
    );
    clearErrors(`supplyOrder.${index}.${e.target.name}`);
  };
  useEffect(() => {
    if (itemTypeChanged !== null) {
      loadItemLookUp(itemTypeChanged);
      setItemTypeChanged(null); // Reset the itemTypeChanged state
    }
  }, [supplyOrders, itemTypeChanged]);

  return (

<>
{/* Remove button */}
  {/* Change postion to top  right */}
 
  <div
    style={{ position: "absolute", top: 0, right: 2, zIndex: 10 }}
    className="p-2"
  >
    <button
      id={`ManageOrderNewOrderRemoveRow`}
      className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-danger h-27px w-30px fas-icon-20px"
      onClick={() => {
        let remainingSupplyOrders = supplyOrders.filter(
          (_: any, index: any) => index !== i
        );
        setSupplyOrders(remainingSupplyOrders);
        remove(i);
      }}
    >
      <CrossIcon />
    </button>
  </div>


    <div className="row" key={field.id}>
      <div className="col-xl-2 col-md-3 col-sm-6 col-12">
        <div className="fv-row mb-4">
          <label className="mb-2 fw-500 required">{t("Item Type")}</label>
          <Select
            inputId={`ManageOrderNewOrderItemType`}
            menuPortalTarget={document.body}
            {...register(`supplyOrder.${i}.itemType`, { required: true })}
            options={itemTypes}
            theme={(theme: any) => styles(theme)}
            placeholder={t("Item Type")}
            name="itemType"
            value={itemTypes?.filter(
              (item: any) => item.label == supplyOrders[i]?.itemType
            )}
            onChange={(event: any) => {
              handleChangeSupplyOrder(event, "itemType", i);
            }}
          />
          {errors.supplyOrder?.[i]?.itemType && (
            <p className="text-danger px-2">
              {t("Please select the Item Type.")}
            </p>
          )}
        </div>
      </div>
      <div className="col-xl-2 col-md-3 col-sm-6 col-12">
        <div className="fv-row mb-4">
          <label className="required mb-2 fw-500">{t("Item")}</label>
          <Select
            inputId={`ManageOrderNewOrderItem`}
            menuPortalTarget={document.body}
            {...register(`supplyOrder.${i}.itemName`, { required: true })}
            options={dropdown2}
            theme={(theme: any) => styles(theme)}
            placeholder={t("Item")}
            name="itemName"
            value={dropdown2?.filter(
              (item: any) => item.label === supplyOrders[i]?.itemName
            )}
            onChange={(event: any) => {
              handleChangeSupplyOrder(event, "itemName", i);
            }}
          />
          {errors.supplyOrder?.[i]?.itemName && (
            <p className="text-danger px-2">
              {t("Please select the Item Name.")}
            </p>
          )}
        </div>
      </div>
      <div className="col-xl-2 col-md-3 col-sm-6 col-12">
        <div className="fv-row mb-4">
          <label className="required mb-2 fw-500">
            {t("Item Description")}
          </label>
          <input
            id={`ManageOrderNewOrderItemDescription`}
            {...register(`supplyOrder.${i}.itemDescriptiona`)}
            type="text"
            name="itemDescription"
            // onChange={(e) => onInputChange(e)}
            className="form-control"
            placeholder={t("Item Description")}
            value={supplyOrders[i]?.itemDescription}
            disabled={true}
          />
        </div>
      </div>
      <div className="col-xl-2 col-md-3 col-sm-6 col-12">
        <div className="fv-row mb-4">
          <label className="required mb-2 fw-500">{t("Order Quantity")}</label>
          <input
            id={`ManageOrderNewOrderOrderQuantity`}
            {...register(`supplyOrder.${i}.orderQuantityRequested`, {
              required: true,
            })}
            type="text"
            name="orderQuantityRequested"
            onChange={(e) => onInputChange(e, i)}
            onKeyDown={(e) => handleKeyPress(e)}
            className="form-control bg-transparent"
            placeholder={t("Order Quantity")}
            inputMode="numeric"
            value={supplyOrders[i]?.orderQuantityRequested}
          />
          {errors.supplyOrder?.[i]?.orderQuantityRequested && (
            <p className="text-danger px-2">
              {t("Please select the order quantity.")}
            </p>
          )}
        </div>
      </div>
      <div className="col-xl-2 col-md-3 col-sm-6 col-12">
        <div className="fv-row mb-4">
          <label className="mb-2 fw-500" style={{ whiteSpace: "nowrap" }}>
            {t("Comment By Order Booker")}
          </label>
          <input
            id={`ManageOrderNewOrderOrderBooker`}
            {...register(`supplyOrder.${i}.comments`)}
            type="text"
            name="comments"
            onChange={(e) => onInputChange(e, i)}
            className="form-control bg-transparent"
            placeholder={t("Comment By Order Booker")}
            value={supplyOrders[i]?.comments}
          />
        </div>
      </div>
      {/* <div className="col-md-1 col-sm-2 col-2 d-flex align-items-end">
        <div className="fv-row mb-4">
          <button
            id={`ManageOrderNewOrderRemoveRow`}
            className="btn btn-icon btn-lg fw-bold btn-table-cancel btn-danger h-35px w-35px fas-icon-20px"
            onClick={() => {
              let remainingSupplyOrders = supplyOrders.filter(
                (_: any, index: any) => index !== i
              );
              setSupplyOrders(remainingSupplyOrders);
              remove(i);
            }}
          >
            <CrossIcon />
          </button>
        </div>
      </div> */}
    </div>
    </>
  );
}

export default InputsRow;
