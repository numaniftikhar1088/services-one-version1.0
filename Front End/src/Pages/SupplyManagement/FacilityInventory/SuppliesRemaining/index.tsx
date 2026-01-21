import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomPagination from "../../../../Shared/JsxPagination";
import { StringRecord } from "../../../../Shared/Type";
import useLang from "../../../../Shared/hooks/useLanguage";
import usePagination from "../../../../Shared/hooks/usePagination";
import { SortingTypeI } from "../../../../Utils/consts";
import ManageInventoryGridData from "./ManageInventoryGridData";
import FacilityService from "Services/FacilityService/FacilityService";

function SuppliesRemaining() {
  const initialSearchQuery = {
    name: "",
  };

  const { t } = useLang();

  const queryDisplayTagNames: StringRecord = {
    name: t("Facility Name"),
  };
  const [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>(() => []);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);

  // React hook form end
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
  const {
    curPage,
    pageSize,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setTotal,
    setCurPage,
  } = usePagination();

  useEffect(() => {
    if (initialRender) {
      loadData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  //Sorting Start
  const sortById = {
    clickedIconData: "value",
    sortingOrder: "desc",
  };
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const searchRef = useRef<any>(null);
  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };
  useEffect(() => {
    if (initialRender2) {
      loadData(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);

  useEffect(() => {
    setCurPage(1);
  }, [pageSize]);
  //Sorting End

  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadData(true, true, sortById);
  }

  const loadData = (loader: boolean, reset: boolean, sortingState?: any) => {
    setLoading(loader);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    FacilityService.GetFacilitiesName({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: any) => {
        setRows(res?.data?.data);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData(false, false);
    // reqTypeLookup();
  }, []);

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="d-flex gap-4 flex-wrap mb-2">
          {searchedTags.map((tag) =>
            tag === "isPhlebotomist" ? (
              ""
            ) : (
              <div
                className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light pe-1"
                onClick={() => handleTagRemoval(tag)}
                key={tag + Math.random()}
              >
                <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
                <i className="bi bi-x"></i>
              </div>
            )
          )}
        </div>
        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
          <div className="d-flex gap-2 responsive-flexed-actions">
            <div className="d-flex align-items-center">
              <span className="fw-400 mr-3">{t("Records")}</span>
              <select
                className="form-select w-125px h-33px rounded py-2"
                data-kt-select2="true"
                data-placeholder="Select option"
                data-dropdown-parent="#kt_menu_63b2e70320b73"
                data-allow-clear="true"
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="50" selected>
                  50
                </option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3 mb-sm-0 mb-2">
            <button
              onClick={() => {
                setCurPage(1);
                setTriggerSearchData((prev) => !prev);
              }}
              className="btn btn-linkedin btn-sm fw-500"
              aria-controls="Search"
            >
              {t("Search")}
            </button>
            <button
              onClick={resetSearch}
              type="button"
              className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
              id="kt_reset"
            >
              <span>
                <span>{t("Reset")}</span>
              </span>
            </button>
          </div>
        </div>
        <div className="card">
          <Box sx={{ height: "auto", width: "100%" }}>
            <ManageInventoryGridData
              rows={rows}
              loading={loading}
              sort={sort}
              searchRef={searchRef}
              handleSort={handleSort}
              setRows={setRows}
              searchRequest={searchRequest}
              onInputChangeSearch={onInputChangeSearch}
              handleKeyPress={handleKeyPress}
            />
            {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
            <CustomPagination
              curPage={curPage}
              nextPage={nextPage}
              pageNumbers={pageNumbers}
              pageSize={pageSize}
              prevPage={prevPage}
              showPage={showPage}
              total={total}
              totalPages={totalPages}
            />
            {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
          </Box>
        </div>
      </div>
    </>
  );
}

export default SuppliesRemaining;
