import React, { useEffect } from "react";
import useLang from "Shared/hooks/useLanguage";
import { Loader } from "../../../../Shared/Common/Loader";
import useIsMobile from "Shared/hooks/useIsMobile";

// Define interface for Facility
interface Facility {
  value: number;
  label: string;
}

// Define interface for Form data
interface FormData {
  title: string;
  description: string;
  urgent: boolean;
  selectedFacilities: Facility[];
}

interface CreatePostProps {
  setShowCreatePost: React.Dispatch<React.SetStateAction<boolean>>;
  loadingLookup: boolean;
  lookup: Facility[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedFacilities: Facility[];
  selectedSearchTerm: string;
  setSelectedSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  formData: FormData;
  getBulletinFacilityLookup: () => Promise<void>;
  handleSave: any;
  handleFacilitySelected: (facility: Facility) => void;
  handleFacilityBack: (facility: Facility) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetFormData: () => void;
  error: string | null;
  handleSelectAll: any;
  handleDeselectAll: any;
}

const CreatePost: React.FC<CreatePostProps> = ({
  setShowCreatePost,
  loadingLookup,
  lookup,
  searchTerm,
  setSearchTerm,
  selectedFacilities,
  selectedSearchTerm,
  setSelectedSearchTerm,
  formData,
  getBulletinFacilityLookup,
  handleSave,
  handleFacilitySelected,
  handleFacilityBack,
  handleInputChange,
  resetFormData,
  error,
  handleSelectAll,
  handleDeselectAll,
}) => {
  
  

  
  const isMobile = useIsMobile();
  
  
  
  const { t } = useLang();
  /* ##############------------ <<<FACILITIES SEARCH STARTS>>>  ---------############## */

  /* ##############------------ <<<ON CHANGE STARTS>>>  ---------############## */

  // ?  HANDLE CHANGE ALL FACILITIES
  const handleFacilitiesSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  // ?  HANDLE CHANGE [---SELECTED FACILITIES---] FACILITIES
  const handleSelectedSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSearchTerm(event.target.value);
  };

  /* ##############------------ <<<ON CHANGE END>>>  ---------############## */

  const filteredLookup = lookup.filter((facility) =>
    facility?.label
      ?.toLowerCase()
      .startsWith(searchTerm ? searchTerm?.toLowerCase() : "")
  );

  const filteredSelectedFacilities = selectedFacilities.filter((facility) =>
    facility.label.toLowerCase().startsWith(selectedSearchTerm?.toLowerCase())
  );

  // Setting the state to empty/null, So that whenever user mounts on it again
  // calling lookups fn on change
  // Rendering API calls on DOM
  useEffect(() => {
    // Function to fetch facilities lookup
    const fetchFacilitiesLookup = async () => {
      await getBulletinFacilityLookup();
    };
    // Call functions to fetch facilities lookup and reset form data
    fetchFacilitiesLookup();
    resetFormData();
  }, []);

  const handleArrowClick = () => {
    if (lookup.length > 0) {
      handleFacilitySelected(lookup[0]); // Select the top-most facility
    }
  };

  const handleLeftArrowClick = () => {
    if (selectedFacilities.length > 0) {
      handleFacilityBack(selectedFacilities[0]);
    }
  };

  return (
    <>
      <div className=" d-flex justify-content-between align-items-center mt-0 ">
        <div className="m-0 fs-4 lead fw-500"></div>
        <div className="d-flex align-items-center justify-content-end mb-2">
          <button
            id={`BulletinBoardPhysicianCancel`}
            className="btn btn-secondary btn-sm btn-secondary--icon mr-3"
            aria-controls="Search"
            onClick={() => {
              setShowCreatePost(false);
            }}
          >
            {t("Cancel")}
          </button>
          <button
            id={`BulletinBoardPhysicianSave`}
            className="btn btn-primary btn-sm fw-500"
            aria-controls="Search"
            onClick={() => {
              handleSave();
            }}
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
              id={`BulletinBoardPhysicianTitle`}
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
              id={`BulletinBoardPhysicianDescription`}
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
                id={`BulletinBoardPhysicianUrgent`}
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
            <h6 className="text-warning mb-0">{t("Facilities")}</h6>
          </div>
          <div className="card-body py-md-4 py-3 px-4">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                <div className="d-flex align-items-center">
                  {isMobile ? (
                    // MOBILE LAYOUT
                    <div className="w-100">
                      {/* Buttons on top */}
                      <div className="d-flex justify-content-center mb-2" style={{ gap: 12 }}>
                        <span
                          id={`BulletinBoardPhysicianSelectAll`}
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
                          id={`BulletinBoardPhysicianDeselectAll`}
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
                      {/* All Facilities List */}
                      <div style={{ width: "100%" }}>
                        <span className="fw-bold">{t("All Facilities")}</span>
                        <input
                          id={`BulletinBoardPhysicianAllFacilitySearch`}
                          className="form-control bg-transparent mb-2"
                          value={searchTerm}
                          onChange={handleFacilitiesSearch}
                          placeholder={t("Search ...")}
                          type="text"
                        />
                        <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                          <div className="align-items-center bg-secondary d-flex h-40px justify-content-between px-4 rounded">
                            <span className="fw-bold">{t("All List")}</span>
                          </div>
                          {loadingLookup ? (
                            <Loader />
                          ) : error ? (
                            <div className="error">{error}</div>
                          ) : (
                            <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                              {filteredLookup.length ? (
                                filteredLookup.map((facility) => (
                                  <li
                                    id={`BulletinBoardPhysicianAllFacility_${facility.value}`}
                                    key={facility.value}
                                    onClick={() => handleFacilitySelected(facility)}
                                    className="list-group-item px-2 py-1 border-0 cursor-pointer"
                                  >
                                    <div className="d-flex">{facility.label}</div>
                                  </li>
                                ))
                              ) : (
                                <li className="list-group-item px-2 py-1 border-0 text-center text-muted"></li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                      {/* Vertical gap between lists */}
                      <div style={{ height: 12 }} />
                      {/* Selected Facilities List */}
                      <div style={{ width: "100%" }}>
                        <span className="fw-bold required">
                          {t("Selected Facilities")}
                        </span>
                        <input
                          id={`BulletinBoardPhysicianSelectedFacilitySearch`}
                          className="form-control bg-transparent mb-2"
                          placeholder={t("Search ...")}
                          type="text"
                          value={selectedSearchTerm}
                          onChange={handleSelectedSearch}
                        />
                        <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                          <div className="align-items-center bg-secondary d-flex h-40px justify-content-between px-4 rounded">
                            <span
                              className="fw-bold"
                              onClick={handleLeftArrowClick}
                              style={{ cursor: "pointer" }}
                            >
                              {t("Selected List")}
                            </span>
                          </div>
                          <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                            {filteredSelectedFacilities.map((facility) => (
                              <li
                                id={`BulletinBoardPhysicianSelectedFacility_${facility.value}`}
                                key={facility.value}
                                onClick={() => handleFacilityBack(facility)}
                                className="list-group-item next-position px-2 py-1 cursor-pointer"
                              >
                                <div className="d-flex">{facility.label}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // DESKTOP LAYOUT (unchanged)
                    <>
                      <div className="col-lg-5 col-md-12 col-sm-12">
                        <span className="fw-bold">{t("All Facilities")}</span>
                        <input
                          id={`BulletinBoardPhysicianAllFacilitySearch`}
                          className="form-control bg-transparent mb-5 mb-sm-0"
                          value={searchTerm}
                          onChange={handleFacilitiesSearch}
                          placeholder={t("Search ...")}
                          type="text"
                        />
                        <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                          <div className="align-items-center bg-secondary d-flex h-40px justify-content-between px-4 rounded">
                            <span className="fw-bold">{t("All List")}</span>
                            <span
                              className="fw-bold"
                              style={{ cursor: "pointer" }}
                            ></span>
                          </div>
                          {loadingLookup ? (
                            <Loader />
                          ) : error ? (
                            <div className="error">{error}</div>
                          ) : (
                            <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                              {filteredLookup.length ? (
                                filteredLookup.map((facility) => (
                                  <li
                                    id={`BulletinBoardPhysicianAllFacility_${facility.value}`}
                                    key={facility.value}
                                    onClick={() => handleFacilitySelected(facility)}
                                    className="list-group-item px-2 py-1 border-0 cursor-pointer"
                                  >
                                    <div className="d-flex">{facility.label}</div>
                                  </li>
                                ))
                              ) : (
                                <li className="list-group-item px-2 py-1 border-0 text-center text-muted">
                                  {/* Optional empty space or message */}
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Center Column - Buttons */}
                      <div className="align-items-center d-flex flex-column h-90px justify-content-between px-3">
                        <span
                          id={`BulletinBoardPhysicianSelectAll`}
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
                          id={`BulletinBoardPhysicianDeselectAll`}
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
                          {t("Selected Facilities")}
                        </span>
                        <input
                          id={`BulletinBoardPhysicianSelectedFacilitySearch`}
                          className="form-control bg-transparent mb-5 mb-sm-0"
                          placeholder={t("Search ...")}
                          type="text"
                          value={selectedSearchTerm}
                          onChange={handleSelectedSearch}
                        />
                        <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                          <div className="align-items-center bg-secondary d-flex h-40px justify-content-between px-4 rounded">
                            <span
                              className="fw-bold"
                              onClick={handleLeftArrowClick}
                              style={{ cursor: "pointer" }}
                            >
                              {t("Selected List")}
                            </span>
                            <span
                              className="fw-bold"
                              style={{ cursor: "pointer" }}
                            ></span>
                          </div>

                          <ul className="list-group rounded-0 list-group-even-fill h-325px scroll">
                            {filteredSelectedFacilities.map((facility) => (
                              <li
                                id={`BulletinBoardPhysicianSelectedFacility_${facility.value}`}
                                key={facility.value}
                                onClick={() => handleFacilityBack(facility)}
                                className="list-group-item next-position px-2 py-1 cursor-pointer"
                              >
                                <div className="d-flex">{facility.label}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
