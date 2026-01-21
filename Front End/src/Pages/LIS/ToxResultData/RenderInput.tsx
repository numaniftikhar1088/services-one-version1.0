import React, { useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import { upsertArray } from "../../../Utils/Common/Requisition";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import LoadButton from "../../../Shared/Common/LoadButton";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { AxiosResponse } from "axios";
import DatePicker from "../../../Shared/Common/DatePickerResultData/DatePicker";
import TimePicker from "../../../Shared/Common/TimePickerResultData/TimePicker";
import { useToxResultDataContext } from "../../../Shared/ToxResultDataContext";
import useLang from "Shared/hooks/useLanguage";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";

const RenderInput = ({
  tabsDetail,
  currentColumnKey,
  setCurrentColumnKey,
  tabValue,
  setCurPage,
  setTriggerSearchData,
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
    lisstatus,
    setSelectedBox,
    loadAllResultData,
  } = useToxResultDataContext();
  function getValueLabelPair(
    dataArray: any[],
    searchKey: string,
    searchValue: any
  ) {
    let filteredItem = dataArray?.find(
      (item) => item.value === +searchValue[searchKey]
    );
    return filteredItem
      ? { label: filteredItem.label, value: searchValue[searchKey] }
      : null;
  }
  let FacilityValue = getValueLabelPair(
    data?.facilityLookup,
    "FacilityName",
    searchValue
  );

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

  const { t } = useLang();
  const [isSubmitting, setisSubmitting] = useState(false);
  const BulkPublishAndValidate = () => {
    let list: any = [];
    if (selectedBox.requisitionId.length) {
      selectedBox?.requisitionId?.map((record: any) => {
        const foundRecord = (() => {
          if (Array.isArray(data?.gridData?.data?.data)) {
            return data.gridData.data.data.find(
              (item: any) => item.RequisitionId === record.RequisitionId
            );
          } else if (Array.isArray(data?.gridData)) {
            return data.gridData.find(
              (item: any) => item.RequisitionId === record.RequisitionId
            );
          } else {
            return null;
          }
        })();
        if (foundRecord?.LISStatus?.toLowerCase() === "pending") {
          list.push(foundRecord);
        }
      });
      if (list?.length > 0) {
        setisSubmitting(false);
        return toast.error(t("Result is not completed in all tests"));
      } else {
        const transformedArray = selectedBox?.requisitionId.map(
          (item: any) => ({
            requisitionId: item.RequisitionId,
            requisitionOrderId: item.RequisitionOrderID,
            isPreview: true,
          })
        );
        setisSubmitting(true);
        RequisitionType.ToxicologyBulkPublishAndValidate(transformedArray)
          .then((res: AxiosResponse) => {
            if (res?.status === 200) {
              toast.success(t(res?.data?.message));
              apiCalls();
              setisSubmitting(false);
              setSelectedBox((prev: any) => ({
                requisitionId: [],
              }));
            } else {
              setisSubmitting(false);
            }
          })
          .catch((err: any) => {
            console.trace(err);
          });
      }
    } else {
      toast.error(t("Please select at least one record"));
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
    ],
  ];
  let lisStatusValue = getValueLabelPair(
    lisStatusDropDown[tabValue],
    "LISStatus",
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
          id={`ToxResultDataSearch_${tabsDetail?.columnKey}`}
          type="text"
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
            inputId={`ToxResultDataSearch_${tabsDetail?.columnKey}`}
            menuPortalTarget={document.body}
            options={panel}
            placeholder={t("Select...")}
            theme={(theme) => styles(theme)}
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
            onKeyDown={(e) => handleKeyPress(e)}
          />
        )}
      {(tabsDetail?.filterColumnsType === "dropdown" &&
        tabsDetail?.columnKey === "lisStatus") ||
        (tabsDetail?.filterColumnsType === "dropdown" &&
          tabsDetail?.columnKey === "LISStatus" && (
            <Select
              inputId={`ToxResultDataSearch_${tabsDetail?.columnKey}`}
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
          ))}
      {(tabsDetail?.filterColumnsType === "dropdown" &&
        tabsDetail?.columnKey === "facilityName") ||
      (tabsDetail?.filterColumnsType === "dropdown" &&
        tabsDetail?.columnKey === "FacilityName") ? (
        <Select
          inputId={`ToxResultDataSearch_${tabsDetail?.columnKey}`}
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
            };
            filterData.filters = upsertArray(
              filterData.filters,
              filterObj,
              (element: any) => element.columnName === filterObj.columnName
            );
            setFilterData(filterData);
          }}
          isSearchable={true}
          value={FacilityValue}
          styles={reactSelectSMStyle}
          onKeyDown={(e) => handleKeyPress(e)}
        />
      ) : null}
      {tabValue === 0 && tabsDetail?.filterColumnsType === "button" && (
        <PermissionComponent
          moduleName="TOX LIS"
          pageName="Result Data"
          permissionIdentifier="BulkpublishandValidate"
        >
          <button
            id={`ToxResultDataBulkPublishAndValidate`}
            className="btn btn-sm fw-bold rounded-3 text-light"
            style={{ background: "#5F11FB" }}
            onClick={() => BulkPublishAndValidate()}
          >
            {isSubmitting ? t("Processing...") : t("Bulk Publish & Validate")}
          </button>
        </PermissionComponent>
      )}
    </div>
  );
};

export default React.memo(RenderInput);
