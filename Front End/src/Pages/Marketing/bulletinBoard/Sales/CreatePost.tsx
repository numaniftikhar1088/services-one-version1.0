import React, { useEffect } from "react";
import useLang from "Shared/hooks/useLanguage";
import { Loader } from "../../../../Shared/Common/Loader";
import useIsMobile from "Shared/hooks/useIsMobile";


// Define interface for Sales

interface Sales {
  value: number;
  label: string;
}

// Define interface for Form data
interface FormData {
  title: string;
  description: string;
  urgent: boolean;
  selectedSales: Sales[];
}

interface CreatePostProps {
  setShowCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
  lookup: Sales[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedSales: Sales[];
  selectedSearchTerm: string;
  setSelectedSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  formData: FormData;
  getBulletinSalesLookup: () => Promise<void>;
  handleSave: any;
  handleSalesSelected: (facility: Sales) => void;
  handleSalesBack: (facility: Sales) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetFormData: () => void;
  error: string | null;
  loadingLookup: boolean;
  handleSelectAll: any;
  handleDeselectAll: any;
}

const CreatePost: React.FC<CreatePostProps> = ({
  setShowCreatePost,
  lookup,
  searchTerm,
  setSearchTerm,
  selectedSales,
  selectedSearchTerm,
  setSelectedSearchTerm,
  formData,
  getBulletinSalesLookup,
  handleSave,
  handleSalesSelected,
  handleSalesBack,
  handleInputChange,
  resetFormData,
  loadingLookup,
  error,
  handleSelectAll,
  handleDeselectAll,
}) => {
  const { t } = useLang();



  
  const isMobile = useIsMobile();

  /* ##############------------ <<<SALES SEARCH STARTS>>>  ---------############## */

  /* ##############------------ <<<ON CHANGE STARTS>>>  ---------############## */

  // ?  HANDLE CHANGE ALL Sales
  const handleSalesSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // ?  HANDLE CHANGE [---SELECTED SALES---] SALES
  const handleSelectedSalesSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedSearchTerm(event.target.value);
  };

  /* ##############------------ <<<ON CHANGE END>>>  ---------############## */

  // ? CREATE POST / SEARCH BASED LOOKUP

  const filteredLookup = lookup.filter((sale) =>
    sale?.label
      ?.toLowerCase()
      .startsWith(searchTerm ? searchTerm?.toLowerCase() : "")
  );

  // ? CREATE POST / [ SELECTED SALES ] <SEARCH BASED LOOKUP>

  const filteredSelectedSales = selectedSales.filter((sale) =>
    sale.label.toLowerCase().startsWith(selectedSearchTerm?.toLowerCase())
  );

  useEffect(() => {
    // Function to fetch facilities lookup
    const fetchSalesLookup = async () => {
      await getBulletinSalesLookup();
    };
    // Call functions to fetch facilities lookup and reset form data
    fetchSalesLookup();
    resetFormData();
  }, []);

  return (
    <>
      <div className=" d-flex justify-content-between align-items-center mt-0 ">
        <div className="m-0 fs-4 lead fw-500"></div>
        <div className="d-flex align-items-center justify-content-end mb-2">
          <button
            id={`BulletinBoardSalesCancel`}
            className="btn btn-secondary btn-sm btn-secondary--icon mr-3"
            aria-controls="Search"
            onClick={() => {
              setShowCreatePost(false);
            }}
          >
            {t("Cancel")}
          </button>
          <button
            id={`BulletinBoardSalesSave`}
            className="btn btn-primary btn-sm fw-500"
            aria-controls="Search"
            onClick={() => handleSave()}
          >
            {t("Save")}
          </button>
        </div>
      </div>
      <div className="py-0">
        <div className="row">
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-4">
            <label className="required mb-2 fw-500">{t("Title")}</label>
            <input
              id={`BulletinBoardSalesTitle`}
              autoComplete="off"
              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
              name="title"
              placeholder={t("Title")}
              required
              type="text"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-4">
            <label className="required mb-2 fw-500">{t("Description")}</label>
            <input
              id={`BulletinBoardSalesDescription`}
              autoComplete="off"
              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
              name="description"
              placeholder={t("Description")}
              required
              type="text"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 mb-4 d-flex align-items-end">
            <label className="form-check form-check-sm form-check-solid mb-sm-4">
              <input
                id={`BulletinBoardSalesUrgent`}
                name="urgent"
                className="form-check-input"
                type="checkbox"
                checked={formData.urgent}
                onChange={handleInputChange}
              />
              {t("Urgent")}
            </label>
          </div>
        </div>

        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
            <h6 className="text-warning mb-0">{t("SalesRep")}</h6>
          </div>
          <div className="card-body py-md-4 py-3 px-4">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              {isMobile ? (
                // MOBILE LAYOUT: BUTTONS ON TOP, LISTS STACKED
                <>
                  <div className="d-flex justify-content-center mb-3">
                    <span
                      id={`BulletinBoardSalesSelectAll`}
                      className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1 mx-2"
                      onClick={handleSelectAll}
                      style={{ cursor: "pointer" }}
                    >
                      <i style={{ fontSize: "20px", color: "white" }} className="fa">&#xf101;</i>
                    </span>
                    <span
                      id={`BulletinBoardSalesDeselectAll`}
                      className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1 mx-2"
                      onClick={handleDeselectAll}
                      style={{ cursor: "pointer" }}
                    >
                      <i style={{ fontSize: "20px", color: "white" }} className="fa">&#xf100;</i>
                    </span>
                  </div>
                  {/* All SalesRep List */}
                  <div className="mb-3">
                    <span className="fw-bold">{t("All SalesRep")}</span>
                    <input
                      id={`BulletinBoardSalesAllSaleRepSearch`}
                      className="form-control bg-transparent mb-5 mb-sm-0"
                      value={searchTerm}
                      onChange={handleSalesSearch}
                      placeholder={t("Search ...")}
                      type="text"
                    />
                    <div
                      className="mt-2 border-1 border-light-dark border rounded overflow-hidden"
                      style={{ minHeight: 370 }}
                    >
                      <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                        <span className="fw-bold">{t("All List")}</span>
                      </div>
                      <div style={{ minHeight: 325, alignItems: "center", justifyContent: "center" }}>
                        {loadingLookup ? (
                          <Loader />
                        ) : error ? (
                          <div className="error">{error}</div>
                        ) : !filteredLookup.length ? (
                          <div className="no-data">{t("No Sales Rep")}</div>
                        ) : (
                          <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                            {filteredLookup.map((sale) => (
                              <li
                                id={`BulletinBoardSalesAllSaleRep_${sale.value}`}
                                key={sale.value}
                                onClick={() => handleSalesSelected(sale)}
                                className="list-group-item next-position px-2 py-1 cursor-pointer"
                              >
                                <div className="d-flex">{sale.label}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Selected SalesRep List */}
                  <div>
                    <span className="fw-bold required">
                      {t("Selected SalesRep")}
                    </span>
                    <input
                      id={`BulletinBoardSalesSelectedSaleRepSearch`}
                      className="form-control bg-transparent mb-5 mb-sm-0"
                      value={selectedSearchTerm}
                      onChange={handleSelectedSalesSearch}
                      placeholder={t("Search ...")}
                      type="text"
                    />
                    <div
                      className="mt-2 border-1 border-light-dark border rounded overflow-hidden"
                      style={{ minHeight: 370 }}
                    >
                      <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                        <span className="fw-bold">{t("Selected List")}</span>
                      </div>
                      <div style={{ minHeight: 325, alignItems: "center", justifyContent: "center" }}>
                        <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                          {filteredSelectedSales.map((sale) => (
                            <li
                              id={`BulletinBoardSalesSelectedSaleRep_${sale.value}`}
                              key={sale.value}
                              onClick={() => handleSalesBack(sale)}
                              className="list-group-item next-position px-2 py-1 cursor-pointer"
                            >
                              <div className="d-flex">{sale.label}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // DESKTOP LAYOUT: CURRENT SIDE-BY-SIDE
                <div className="row">
                  <div className="d-flex align-items-center">
                    <div className="col-lg-5 col-md-12 col-sm-12 h-100">
                      <span className="fw-bold">{t("All SalesRep")}</span>
                      <input
                        id={`BulletinBoardSalesAllSaleRepSearch`}
                        className="form-control bg-transparent mb-5 mb-sm-0"
                        value={searchTerm}
                        onChange={handleSalesSearch}
                        placeholder={t("Search ...")}
                        type="text"
                      />
                      <div
                        className="mt-2 border-1 border-light-dark border rounded overflow-hidden"
                        style={{ minHeight: 370 }}
                      >
                        <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                          <span className="fw-bold">{t("All List")}</span>
                        </div>
                        <div style={{ minHeight: 325,  alignItems: "center", justifyContent: "center" }}>
                          {loadingLookup ? (
                            <Loader />
                          ) : error ? (
                            <div className="error">{error}</div>
                          ) : !filteredLookup.length ? (
                            <div className="no-data">{t("No Sales Rep")}</div>
                          ) : (
                            <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                              {filteredLookup.map((sale) => (
                                <li
                                  id={`BulletinBoardSalesAllSaleRep_${sale.value}`}
                                  key={sale.value}
                                  onClick={() => handleSalesSelected(sale)}
                                  className="list-group-item next-position px-2 py-1 cursor-pointer"
                                >
                                  <div className="d-flex">{sale.label}</div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Center Column - Buttons */}
                    <div className="align-items-center d-flex flex-column h-90px justify-content-between px-3">
                      <span
                        id={`BulletinBoardSalesSelectAll`}
                        className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                        onClick={handleSelectAll}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf101;
                        </i>
                      </span>
                      <span
                        id={`BulletinBoardSalesDeselectAll`}
                        className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1"
                        onClick={handleDeselectAll}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf100;
                        </i>
                      </span>
                    </div>

                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <span className="fw-bold required">
                        {t("Selected SalesRep")}
                      </span>
                      <input
                        id={`BulletinBoardSalesSelectedSaleRepSearch`}
                        className="form-control bg-transparent mb-5 mb-sm-0"
                        value={selectedSearchTerm}
                        onChange={handleSelectedSalesSearch}
                        placeholder={t("Search ...")}
                        type="text"
                      />
                      <div
                        className="mt-2 border-1 border-light-dark border rounded overflow-hidden"
                        style={{ minHeight: 370 }}
                      >
                        <div className="px-4 h-40px d-flex align-items-center rounded bg-secondary">
                          <span className="fw-bold">{t("Selected List")}</span>
                        </div>
                        <div style={{ minHeight: 325, alignItems: "center", justifyContent: "center" }}>
                          <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                            {filteredSelectedSales.map((sale) => (
                              <li
                                id={`BulletinBoardSalesSelectedSaleRep_${sale.value}`}
                                key={sale.value}
                                onClick={() => handleSalesBack(sale)}
                                className="list-group-item next-position px-2 py-1 cursor-pointer"
                              >
                                <div className="d-flex">{sale.label}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
