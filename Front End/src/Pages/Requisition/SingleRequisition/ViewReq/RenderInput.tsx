import moment from "moment";
import React from "react";
import Select from "react-select";
import DatePicker from "../../../../Shared/Common/DatePicker/DatePicker";
import TimePicker from "../../../../Shared/Common/TimePicker/TimePicker";
import { useReqDataContext } from "./RequisitionContext/useReqContext";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import { upsertArray } from "../../../../Utils/Common/Requisition";
import useLang from "Shared/hooks/useLanguage";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";

const RenderInput = ({
  tabsDetail,
  currentColumnKey,
  setCurrentColumnKey,
}: any) => {
  const {
    data,
    filterData,
    setFilterData,
    searchValue,
    setSearchValue,
    requisitionStatuses,
    requisitionTypes,
  } = useReqDataContext();
  const { t } = useLang();
  const handleChange = (e: any) => {
    let value = e.target.value;
    let type = e.target.type;
    if (type === "date" && value) {
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

    const newFilters = filterData.filters.filter(
      (element: any) => element.filterValue !== ""
    );
    setFilterData({ ...filterData, filters: newFilters });
  };

  function getValueLabelPair(
    dataArray: any[],
    searchKey: string,
    searchValue: any
  ) {
    if (
      searchKey.toLowerCase() === "requisitionstatus" &&
      typeof searchValue[searchKey] === "string"
    ) {
      // Convert the comma-separated string back to an array
      const selectedValues = searchValue[searchKey]
        .split(",")
        .map((val: any) => val.trim());

      console.log(selectedValues, "selectedValues");

      return dataArray.filter(
        (item) =>
          selectedValues.includes(String(item.value)) ||
          selectedValues.includes(item.label)
      );
    }

    return dataArray.filter(
      (item) =>
        item.value === Number(searchValue[searchKey]) ||
        item.label === searchValue[searchKey]
    );
  }

  let _data =
    tabsDetail?.columnKey.toLowerCase() === "facilityname"
      ? getValueLabelPair(data?.facilityLookup, "FacilityName", searchValue)
      : tabsDetail?.columnKey.toLowerCase() === "requisitionstatus"
        ? getValueLabelPair(
            requisitionStatuses,
            "RequisitionStatus",
            searchValue
          )
        : tabsDetail?.columnKey.toLowerCase() === "requisitiontype"
          ? getValueLabelPair(requisitionTypes, "RequisitionType", searchValue)
          : [];

  let lookupData = [];

  if (tabsDetail?.columnKey.toLowerCase() === "facilityname") {
    lookupData = data?.facilityLookup;
  } else if (tabsDetail?.columnKey.toLowerCase() === "requisitionstatus") {
    lookupData = requisitionStatuses;
  } else if (tabsDetail?.columnKey.toLowerCase() === "requisitiontype") {
    lookupData = requisitionTypes;
  } else {
    lookupData = [];
  }

  return (
    <div>
      {tabsDetail?.filterColumnsType === "text" && (
        <input
          id={`ViewRequisitionSearch_${tabsDetail?.columnKey}`}
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
          callFrom="requisition"
        />
      )}
      {tabsDetail?.filterColumnsType === "DatePicker" && (
        <SearchDatePicker
          value={searchValue[tabsDetail?.columnKey]}
          onChange={handleChange}
        />
      )}
      {tabsDetail?.filterColumnsType === "multiselect" && (
        <Select
          id={`ViewRequisitionSearch_${tabsDetail?.columnKey}`}
          menuPortalTarget={document.body}
          options={lookupData}
          theme={(theme) => styles(theme)}
          placeholder={t("Select...")}
          value={_data} // Ensure _data is an array
          isMulti={true}
          onChange={(selectedOptions: any) => {
            // Convert selected values to a comma-separated string
            let selectedValues = selectedOptions
              .map((option: any) => option.value)
              .join(",");

            // Update searchValue properly
            setSearchValue((preVal: any) => ({
              ...preVal,
              [tabsDetail?.columnKey]: selectedValues, // Store as a comma-separated string
            }));

            let filterObj = {
              columnName: tabsDetail.filterColumns,
              filterValue: selectedValues, // Store as a comma-separated string
              columnType: tabsDetail.filterColumnsType,
              label: tabsDetail.columnLabel,
              columnKey: tabsDetail.columnKey,
            };

            filterData.filters = upsertArray(
              filterData.filters,
              filterObj,
              (element: any) => element.columnName === filterObj.columnName
            );

            const newFilters = filterData.filters.filter(
              (element: any) => element.filterValue !== ""
            );
            setFilterData({ ...filterData, filters: newFilters });
          }}
          isSearchable={true}
          styles={reactSelectSMStyle}
        />
      )}

      {tabsDetail?.filterColumnsType === "timeRange" && (
        <TimePicker
          columnKey={tabsDetail?.filterColumns}
          tabsDetail={tabsDetail}
          callFrom="requisition"
        />
      )}
      {tabsDetail?.filterColumnsType === "dropdown" && (
        <Select
          inputId={`ViewRequisitionSearch_${tabsDetail?.columnKey}`}
          menuPortalTarget={document.body}
          options={lookupData}
          theme={(theme) => styles(theme)}
          placeholder={t("Select...")}
          value={_data}
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
