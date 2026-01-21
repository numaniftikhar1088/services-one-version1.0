import { AxiosResponse } from "axios";
import moment from "moment";
import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import DatePicker from "../../../Shared/Common/DatePickerResultData/DatePicker";
import LoadButton from "../../../Shared/Common/LoadButton";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import TimePicker from "../../../Shared/Common/TimePickerResultData/TimePicker";
import { useResultDataContext } from "../../../Shared/ResultDataContext";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import { upsertArray } from "../../../Utils/Common/Requisition";
import useLang from "Shared/hooks/useLanguage";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";

const RenderInput = ({
  tabsDetail,
  currentColumnKey,
  setCurrentColumnKey,
  tabValue,
  setTriggerSearchData,
  setCurPage,
}: any) => {
  const {
    data,
    filterData,
    setFilterData,
    searchValue,
    setSearchValue,
    selectedBox,
    apiCalls,
    panel,
    loadGridData,
  } = useResultDataContext();

  const { t } = useLang();
  const [isSubmitting, setisSubmitting] = useState(false);

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
    const newFilters = filterData.filters.filter(
      (element: any) => element.filterValue !== ""
    );
    setFilterData({ ...filterData, filters: newFilters });
  };

  const BulkPublishAndValidate = () => {
    setisSubmitting(true);
    let list = [];
    if (selectedBox.requisitionOrderId.length) {
      selectedBox?.requisitionOrderId?.map((record: any) => {
        const foundRecord = data?.gridData?.data?.data?.find(
          (item: any) => item.requisitionOrderId == record.requisitionOrderId
        );
        if (foundRecord?.lisStatus?.toLowerCase() === "pending") {
          list.push(foundRecord);
        }
      });
      if (list?.length > 0) {
        setisSubmitting(false);
        return toast.error("Result is not completed in all tests");
      } else {
        RequisitionType.BulkPublishAndValidate(selectedBox.requisitionOrderId)
          .then((res: AxiosResponse) => {
            if (res?.status === 200) {
              toast.success(res?.data?.message);
              apiCalls();
              setisSubmitting(false);
            } else {
              setisSubmitting(false);
            }
          })
          .catch((err: any) => {
            console.trace(err);
          });
      }
    } else {
      toast.error("Please select atleast one record");
      setisSubmitting(false);
    }
  };

  const lisStatusDropDown = [
    [
      {
        value: 1,
        label: "Pending",
      },
      {
        value: 2,
        label: "Ready to Publish",
      },
      {
        value: 10,
        label: "Pending PharmD",
      },
      {
        value: 11,
        label: "Pending ABR",
      },
    ],
    [
      {
        value: 5,
        label: "Amended",
      },
      {
        value: 4,
        label: "Corrected",
      },
      {
        value: 3,
        label: "Final",
      },
    ],
    [
      {
        value: 5,
        label: "Amended",
      },
      {
        value: 4,
        label: "Corrected",
      },
      {
        value: 3,
        label: "Final",
      },
      {
        value: 1,
        label: "Pending",
      },
      {
        value: 2,
        label: "Ready to Publish",
      },
      {
        value: 10,
        label: "Pending PharmD",
      },
      {
        value: 11,
        label: "Pending ABR",
      },
    ],
  ];

  function getValueLabelPair(
    dataArray: any[],
    searchKey: string,
    searchValue: any
  ) {
    const filteredItem = dataArray.find(
      (item) => item.value === +searchValue[searchKey]
    );
    return filteredItem
      ? { label: filteredItem.label, value: searchValue[searchKey] }
      : null;
  }

  const panelSelectValue = getValueLabelPair(panel, "panelName", searchValue);

  const lisStatusValue = getValueLabelPair(
    lisStatusDropDown[tabValue],
    "lisStatus",
    searchValue
  );

  const facilityValue = getValueLabelPair(
    data?.facilityLookup,
    "facilityName",
    searchValue
  );

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };

  return (
    <div>
      {tabsDetail?.filterColumnsType === "text" && (
        <input
          id={`IDResultDataSearch_${tabsDetail?.columnKey}`}
          type="text"
          autoComplete="off"
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
          placeholder={t("Search ...")}
          value={searchValue[tabsDetail?.columnKey]}
          name={tabsDetail?.columnKey}
          onChange={handleChange}
          onKeyDown={(e) => handleKeyPress(e)}
        />
      )}
      {tabsDetail?.filterColumnsType === "dateRange" && (
        <DatePicker
          tabsDetail={tabsDetail}
          columnKey={tabsDetail?.columnKey}
          currentColumnKey={currentColumnKey}
          setCurrentColumnKey={setCurrentColumnKey}
          lisType="ID"
        />
      )}
      {tabsDetail?.filterColumnsType === "DatePicker" && (
        <SearchDatePicker
          value={searchValue[tabsDetail?.columnKey]}
          onChange={handleChange}
        />
      )}
      {tabsDetail?.filterColumnsType === "timeRange" && (
        <TimePicker
          columnKey={tabsDetail?.filterColumns}
          tabsDetail={tabsDetail}
        />
      )}
      {tabsDetail?.filterColumnsType === "dropdown" &&
        tabsDetail?.columnKey === "panelName" && (
          <Select
            inputId={`IDResultDataSearch_${tabsDetail?.columnKey}`}
            menuPortalTarget={document.body}
            options={panel}
            theme={(theme) => styles(theme)}
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
            value={panelSelectValue}
            isSearchable={true}
            styles={reactSelectSMStyle}
            onKeyDown={(e) => handleKeyPress(e)}
          />
        )}
      {tabsDetail?.filterColumnsType === "dropdown" &&
        tabsDetail?.columnKey === "lisStatus" && (
          <Select
            inputId={`IDResultDataSearch_${tabsDetail?.columnKey}`}
            menuPortalTarget={document.body}
            options={lisStatusDropDown[tabValue]}
            theme={(theme) => styles(theme)}
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
            value={lisStatusValue}
            isSearchable={true}
            styles={reactSelectSMStyle}
            onKeyDown={(e) => handleKeyPress(e)}
          />
        )}
      {tabsDetail?.filterColumnsType === "dropdown" &&
        tabsDetail?.columnKey === "facilityName" && (
          <Select
            inputId={`IDResultDataSearch_${tabsDetail?.columnKey}`}
            menuPortalTarget={document.body}
            options={data?.facilityLookup}
            theme={(theme) => styles(theme)}
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
            value={facilityValue}
            isSearchable={true}
            styles={reactSelectSMStyle}
            onKeyDown={(e) => handleKeyPress(e)}
          />
        )}
      {tabValue === 0 && tabsDetail?.filterColumnsType === "button" && (
        <PermissionComponent
          moduleName="ID LIS"
          pageName="Result Data"
          permissionIdentifier="BulkPublishandValidate"
        >
          <LoadButton
            name={`IDResultDataSearch_${tabsDetail?.columnKey}`}
            className="btn btn-sm fw-bold btn-twitter rounded-3"
            // disabled={item.azureLink == null ? true : false}
            onClick={() => BulkPublishAndValidate()}
            loading={isSubmitting}
            btnText={t("Bulk Publish & Validate")}
            loadingText={t("Processing...")}
          />
        </PermissionComponent>
      )}
    </div>
  );
};

export default React.memo(RenderInput);
