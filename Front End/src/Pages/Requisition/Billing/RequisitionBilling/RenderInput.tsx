import moment from "moment";
import React from "react";
import Select from "react-select";
import { useBillingDataContext } from "Shared/BillingContext";
import DatePicker from "Shared/Common/DatePicker/DatePicker";
import TimePicker from "Shared/Common/TimePicker/TimePicker";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { upsertArray } from "Utils/Common/Requisition";

const RenderInput = ({
  tabsDetail,
  currentColumnKey,
  setCurrentColumnKey,
}: any) => {
  const { data, filterData, setFilterData, searchValue, setSearchValue } =
    useBillingDataContext();
  const { t } = useLang();
  const handleChange = (e: any) => {
    let value = e.target.value;
    let type = e.target.type;
    if (type === "date") {
      value = moment(value, "YYYY-MM-DD").format("MM/DD/YYYY");
    }
    setSearchValue((preVal: any) => {
      return {
        ...preVal,
        [tabsDetail?.columnKey]: value,
      };
    });
    let filterObj = {
      columnName: tabsDetail.filterColumns,
      filterValue: value,
      columnType: tabsDetail.filterColumnsType,
      label: tabsDetail.columnLabel,
      columnKey: tabsDetail.columnKey,
    };
    filterData.filters = upsertArray(
      filterData.filters,
      filterObj,
      (element: any) => element.columnName === filterObj.columnName
    );
    setFilterData(filterData);
  };

  function getValueLabelPair(
    dataArray: any[],
    searchKey: string,
    searchValue: any
  ) {
    let filteredItem = dataArray.filter(
      (item) => item.value === +searchValue[searchKey]
    );

    return filteredItem;
  }

  let _data = getValueLabelPair(
    data?.facilityLookup,
    "FacilityName",
    searchValue
  );

  return (
    <div>
      {tabsDetail?.filterColumnsType === "text" && (
        <input
          id={`BillingRequisitionSearch_${tabsDetail?.columnKey}`}
          type="text"
          className="form-control bg-white  mb-lg-0 h-30px rounded-2 fs-8 w-100"
          placeholder={t("Search ...")}
          value={searchValue[tabsDetail?.columnKey]}
          name={tabsDetail?.columnKey}
          onChange={handleChange}
        />
      )}
      {tabsDetail?.filterColumnsType === "dateRange" && (
        <DatePicker
          tabsDetail={tabsDetail}
          columnKey={tabsDetail?.columnKey}
          currentColumnKey={currentColumnKey}
          setCurrentColumnKey={setCurrentColumnKey}
          callFrom="billing"
        />
      )}
      {tabsDetail?.filterColumnsType === "DatePicker" && (
        <input
          id={`BillingRequisitionSearch_${tabsDetail?.columnKey}`}
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
          type="date"
          onChange={handleChange}
          value={moment(
            searchValue[tabsDetail?.columnKey],
            "MM/DD/YYYY"
          ).format("YYYY-MM-DD")}
        />
      )}
      {tabsDetail?.filterColumnsType === "timeRange" && (
        <TimePicker
          columnKey={tabsDetail?.filterColumns}
          tabsDetail={tabsDetail}
        />
      )}
      {tabsDetail?.filterColumnsType === "dropdown" && (
        <Select
          inputId={`BillingRequisitionSearch_${tabsDetail?.columnKey}`}
          menuPortalTarget={document.body}
          options={data?.facilityLookup}
          theme={(theme) => styles(theme)}
          value={_data}
          placeholder={t("Select...")}
          onChange={(e: any) => {
            setSearchValue((preVal: any) => {
              return {
                ...preVal,
                [tabsDetail?.columnKey]: String(e.value),
              };
            });
            let filterObj = {
              columnName: tabsDetail.filterColumns,
              filterValue: String(e.value),
              columnType: tabsDetail.filterColumnsType,
              label: tabsDetail.columnLabel,
              columnKey: tabsDetail.columnKey,
            };
            filterData.filters = upsertArray(
              filterData.filters,
              filterObj,
              (element: any) => element.columnName === filterObj.columnName
            );
            setFilterData(filterData);
          }}
          isSearchable={true}
          styles={reactSelectSMStyle}
        />
      )}
    </div>
  );
};

export default React.memo(RenderInput);
