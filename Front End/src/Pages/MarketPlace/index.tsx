import _ from "lodash";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { getMarketPlaceGetAll } from "Services/MarketPlace";
import usePagination from "Shared/hooks/usePagination";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { sortByCreationDate } from "Utils/consts";
import { IntegrationCard } from "./components/IntegrationCard";
import { MarketplaceSidebar } from "./components/MarketplaceSidebar";
import CustomPagination from "Shared/JsxPagination";

export default function MarketplacePage() {
  const [cards, setCards] = useState<any>([]);
  const [initialRender, setInitialRender] = useState(false);
  const initialSearchValue = { searchString: "", integrationType: "" };
  const [searchRequest, setSearchRequest] = useState(initialSearchValue);

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
      loadData(false);
    } else {
      setInitialRender(true);
    }
  }, [curPage, pageSize]);

  const loadData = async (loader: boolean, payload?: any) => {
    getMarketPlaceGetAll({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: payload ?? searchRequest,
      sortColumn: sortByCreationDate?.clickedIconData,
      sortDirection: sortByCreationDate?.sortingOrder,
    })
      .then((res: any) => {
        setCards(res?.data?.data);
        setTotal(res?.data?.total);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const onInputChangeSearch = (event: any) => {
    setSearchRequest((prev) => ({
      ...prev,
      searchString: event.target.value,
    }));
    handleSearch(event.target.value);
  };

  const handleSearch = useCallback(
    _.debounce((searchTerm) => {
      const payload = {
        searchString: searchTerm.trim(),
        integrationType: "",
      };
      loadData(false, payload);
    }, 500),
    []
  );

  useEffect(() => {
    loadData(true);
  }, []);

  useLayoutEffect(() => {
    let elem = document.getElementById("kt_app_main");
    console.log(elem, "elem");

    elem?.style.setProperty("overflow", "hidden", "important");

    return () => {
      elem?.style.removeProperty("overflow");
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="d-flex">
            {/* Fixed Sidebar */}
            <div style={{ width: "20%" }}>
              <MarketplaceSidebar
                loadData={loadData}
                setSearchRequest={setSearchRequest}
              />
            </div>
            <div className="min-vh-100" style={{ width: "80%" }}>
              <div className="container-fluid">
                <div className="position-relative mb-5">
                  <IoSearchOutline
                    className="position-absolute top-50 start-0 translate-middle-y ms-2"
                    size={17}
                    color="green"
                  />
                  <input
                    type="text"
                    name="itemName"
                    className="form-control bg-white h-30px rounded-2 fs-8 ps-4 border-0 ps-10"
                    placeholder={"Search Product"}
                    value={searchRequest.searchString}
                    onChange={onInputChangeSearch}
                  />
                </div>

                <div
                  className="row"
                  style={{
                    height: `calc(100vh - 100px)`,
                    overflowY: "auto",
                  }}
                >
                  {cards.map((card: any, index: number) => (
                    <div
                      key={index}
                      className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 mb-4"
                    >
                      <IntegrationCard card={card} />
                    </div>
                  ))}
                  {/* Pagination */}
                  {totalPages > 1 && (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
