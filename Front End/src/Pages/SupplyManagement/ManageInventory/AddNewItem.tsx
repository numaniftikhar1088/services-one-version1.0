import { Collapse } from "@mui/material";
import Select from "react-select";
import Radio from "../../../Shared/Common/Input/Radio";
import LoadButton from "../../../Shared/Common/LoadButton";
import { reactSelectStyle, styles } from "../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";

function AddNewItem(props: {
  modalShow: boolean;
  testingSupplies: any;
  isSubmitting: boolean;
  addTestingSupplies: Function;
  onInputChange: any;
  handleChange: Function;
  dropdown: any;
  reset: Function;
  itemTypes: any;
  register: any;
  handleSubmit: any;
  handleEnterPress: any;
  handleKeyPressed: any;
  errors: any;
}) {
  const {
    modalShow,
    testingSupplies,
    isSubmitting,
    addTestingSupplies,
    onInputChange,
    handleChange,
    dropdown,
    reset,
    itemTypes,
    register,
    handleSubmit,
    handleEnterPress,
    handleKeyPressed,
    errors,
  } = props;
  let {
    id,
    itemName,
    itemDescription,
    itemBarCode,
    itemType,
    quantityPerItemSet,
    isPhlebotomist,
    quantity,
    lowQuantityAlert,
    requisitionTypeId,
    requisitionTypeName,
  } = testingSupplies;

  const { t } = useLang();

  return (
    <Collapse in={modalShow}>
      <form
        onSubmit={handleSubmit(addTestingSupplies)}
        onKeyDown={handleEnterPress}
      >
        <div id="ModalCollapse" className="card mb-5">
          <div className="align-items-center bg-light-warning card-header minh-42px d-flex justify-content-center justify-content-sm-between gap-1 px-5">
            <h4 className="m-1">
              {id === 0 ? t("Testing Supplies") : t("Edit Testing Supplies")}
            </h4>
            <div className="d-flex align-items-center gap-2">
              <button
                id={`ManageInventoryCancel`}
                className="btn btn-secondary btn-sm fw-bold "
                aria-controls="SearchCollapse"
                aria-expanded="true"
                onClick={() => reset()}
                type="button"
              >
                <span>
                  <span>{t("Cancel")}</span>
                </span>
              </button>

              {id === 0 ? (
                <LoadButton
                  id={`ManageInventorySave`}
                  className="btn btn-sm fw-bold btn-primary"
                  loading={isSubmitting}
                  btnText={t("Save")}
                  loadingText={t("Saving")}
                />
              ) : (
                <LoadButton
                  id={`ManageInventoryUpdating`}
                  className="btn btn-sm fw-bold btn-primary"
                  loading={isSubmitting}
                  btnText={t("Update")}
                  loadingText={t("Updating...")}
                />
              )}
            </div>
          </div>

          <div className="card-body px-5 py-2 py-md-3">
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">{t("Item")}</label>
                  <input
                    id={`ManageInventoryItemName`}
                    {...register("itemName", { required: true })}
                    type="text"
                    name="itemName"
                    onChange={(e) => onInputChange(e)}
                    className={`form-control ${
                      id > 0 ? "bg-gray-600" : "bg-transparent"
                    }`}
                    placeholder={t("Item Name")}
                    value={itemName}
                    disabled={id > 0}
                  />
                  {errors.itemName && (
                    <p className="text-danger px-2">
                      {t("Please enter the item name.")}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">
                    {t("Description")}
                  </label>
                  <input
                    id={`ManageInventoryItemDescription`}
                    {...register("itemDescription", { required: true })}
                    type="text"
                    name="itemDescription"
                    onChange={(e) => onInputChange(e)}
                    className="form-control bg-transparent"
                    placeholder={t("Description")}
                    value={itemDescription}
                  />
                  {errors.itemDescription && (
                    <p className="text-danger px-2">
                      {t("Please enter the item description")}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500 required">
                    {t("Item Type")}
                  </label>
                  <Select
                    inputId={`ManageInventoryItemType`}
                    menuPortalTarget={document.body}
                    {...register("itemType", { required: true })}
                    theme={(theme: any) => styles(theme)}
                    options={itemTypes}
                    name="itemType"
                    placeholder={t("Select Item Type")}
                    value={itemTypes.filter(function (option: any) {
                      return option.value === itemType;
                    })}
                    onChange={(event: any) => handleChange(event, "itemType")}
                    isSearchable={true}
                    className="z-index-3"
                  />
                  {errors.itemType && (
                    <p className="text-danger px-2">
                      {t("Please enter the item description")}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <Radio
                    label={t("Phlebotomist Item")}
                    name="isPhlebotomist"
                    onChange={onInputChange}
                    choices={[
                      {
                        id: "0",
                        label: t("Yes"),
                        value: "true",
                      },
                      {
                        id: "1",
                        label: t("No"),
                        value: "false",
                      },
                    ]}
                    // disabled={true}

                    // error={errors.labType}
                    checked={isPhlebotomist.toString()}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">
                    {t("Quantity Per Item Set")}
                  </label>
                  <input
                    id={`ManageInventoryQuantityPerItem`}
                    {...register("quantityPerItemSet", {
                      required: true,
                      pattern: {
                        value: /^\d{1,5}$/,
                      },
                    })}
                    type="text"
                    name="quantityPerItemSet"
                    onChange={(e) => onInputChange(e)}
                    onKeyDown={(e) => handleKeyPressed(e)}
                    className="form-control bg-transparent"
                    placeholder={t("Quantity Per Item Set")}
                    value={quantityPerItemSet}
                  />
                  {errors.quantityPerItemSet && (
                    <p className="text-danger px-2">
                      {t("Please enter less than 6 digits")}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">
                    {t("Quantity")}
                  </label>
                  <input
                    id={`ManageInventoryQuantity`}
                    {...register("quantity", {
                      required: true,
                      pattern: {
                        value: /^\d{1,5}$/,
                      },
                    })}
                    type="text"
                    name="quantity"
                    onChange={(e) => onInputChange(e)}
                    onKeyDown={(e) => handleKeyPressed(e)}
                    className="form-control bg-transparent"
                    placeholder={t("Quantity")}
                    value={quantity}
                  />
                  {errors.quantity && (
                    <p className="text-danger px-2">
                      {t("Please enter less than 6 digits")}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">
                    {t("Minimum Level Alert")}
                  </label>
                  <input
                    id={`ManageInventoryLowQuantityAlert`}
                    {...register("lowQuantityAlert", {
                      required: true,
                      pattern: {
                        value: /^\d{1,5}$/,
                      },
                    })}
                    type="text"
                    name="lowQuantityAlert"
                    onChange={(e) => onInputChange(e)}
                    onKeyDown={(e) => handleKeyPressed(e)}
                    className="form-control bg-transparent"
                    placeholder={t("Minimum Level Alert")}
                    value={lowQuantityAlert as any}
                  />
                  {errors.lowQuantityAlert && (
                    <p className="text-danger px-2">
                      {t("Please enter less than 6 digits")}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">
                    {t("Item Bar Code")}
                  </label>
                  <input
                    id={`ManageInventoryItemBarCode`}
                    {...register("itemBarCode", { required: true })}
                    type="text"
                    name="itemBarCode"
                    onChange={(e) => onInputChange(e)}
                    className="form-control bg-transparent"
                    placeholder={t("Item Bar Code")}
                    value={itemBarCode}
                  />
                  {errors.itemBarCode && (
                    <p className="text-danger px-2">
                      {t("Please enter the item bar code")}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500 required">
                    {t("Requisition Type")}
                  </label>
                  <Select
                    inputId={`ManageInventoryRequisitionType`}
                    menuPortalTarget={document.body}
                    {...register("requisitionTypeId", { required: true })}
                    options={dropdown}
                    theme={(theme: any) => styles(theme)}
                    styles={reactSelectStyle}
                    placeholder={t("Requisition Type")}
                    name="requisitionTypeId"
                    value={dropdown?.filter(
                      (item: any) => item.value == requisitionTypeId
                    )}
                    onChange={(event: any) => {
                      handleChange(event, "requisitionTypeId");
                    }}
                  />
                  {errors.requisitionTypeId && (
                    <p className="text-danger px-2">
                      {t("Please enter the Requisition Type")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Collapse>
  );
}

export default AddNewItem;
