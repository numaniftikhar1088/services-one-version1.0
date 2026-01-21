import Select from "react-select";
import TableCell from "@mui/material/TableCell";
import { upsertArray } from "../../../Utils/Common/Requisition";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import TimePicker from "../../../Shared/Common/TimePickerResultData/TimePicker";
import { useToxResultDataContext } from "../../../Shared/ToxResultDataContext";
import useLang from "Shared/hooks/useLanguage";
const RenderInput2 = () => {
  const {
    data,
    filterData,
    value,
    setFilterData,
    searchValue,
    setSearchValue,
    loadAllResultData,
  } = useToxResultDataContext();
  const { t } = useLang();
  const handleChange = (e: any, tabsDetail: any) => {
    setSearchValue((preVal: any) => {
      return {
        ...preVal,
        [tabsDetail?.columnKey]: e.target.value,
      };
    });
    let filterObj = {
      columnName: tabsDetail.filterColumns,
      filterValue: e.target.value,
      columnType: tabsDetail.filterColumnsType,
    };
    filterData.filters = upsertArray(
      filterData.filters,
      filterObj,
      (element: any) => element.columnName === filterObj.columnName
    );
    setFilterData(filterData);
  };
  const searchData = (e: any) => {
    e.preventDefault();
    loadAllResultData();
  };
  return (
    <>
      {data.gridHeaders &&
        data.gridHeaders[value]?.tabHeaders.map((tabsDetail: any) => (
          <>
            {tabsDetail?.isShowOnUI && (
              <TableCell sx={{ width: "max-content" }}>
                <div className="d-flex justify-content-center align-items-center">
                  <div style={{ width: "max-content" }}>
                    {
                      <form onSubmit={searchData}>
                        {tabsDetail?.filterColumnsType === "text" && (
                          <input
                            type="text"
                            className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            placeholder=""
                            value={searchValue[tabsDetail?.columnKey]}
                            name={tabsDetail?.columnKey}
                            onChange={(e: any) => handleChange(e, tabsDetail)}
                          />
                        )}
                        {tabsDetail?.filterColumnsType === "dateRange" && (
                          <>{/* <DatePicker tabsDetail={tabsDetail} /> */}</>
                        )}
                        {tabsDetail?.filterColumnsType === "timeRange" && (
                          <TimePicker
                            columnKey={tabsDetail?.columnKey}
                            tabsDetail={tabsDetail}
                          />
                        )}
                        {tabsDetail?.filterColumnsType === "dropdown" && (
                          <Select
                            menuPortalTarget={document.body}
                            options={data?.facilityLookup}
                            //name={props?.name}
                            theme={(theme) => styles(theme)}
                            placeholder={t("Select...")}
                            //value={searchValue[tabsDetail?.columnKey]}
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
                              };
                              filterData.filters = upsertArray(
                                filterData.filters,
                                filterObj,
                                (element: any) =>
                                  element.columnName === filterObj.columnName
                              );
                              setFilterData(filterData);
                            }}
                            isSearchable={true}
                            styles={reactSelectSMStyle}
                          />
                        )}
                      </form>
                    }
                  </div>
                </div>
              </TableCell>
            )}
          </>
        ))}
    </>
  );
};

export default RenderInput2;
