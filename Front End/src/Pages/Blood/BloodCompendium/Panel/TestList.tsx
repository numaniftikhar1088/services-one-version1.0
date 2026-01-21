import { Tooltip } from "@mui/material";
import { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  getTagsFilterLookup,
  getTestListsLookup,
  SavePanelSetupExpand,
} from "../../../../Services/Compendium/BloodLisCompendium/BloodLisCompendium";
import { reactSelectSMStyle2, styles } from "../../../../Utils/Common";
import { IValues } from "../../../Facility/LabAssignment/FacilitySelection";
import useLang from "./../../../../Shared/hooks/useLanguage";
import { PanelTypes, ReferenceLab, TestLists } from "./Headers";
import useIsMobile from "Shared/hooks/useIsMobile";

interface TestListProps {
  isExpand: boolean;
  panelTypes: PanelTypes[];
  referenceLab: ReferenceLab[];
  item: any;
  getPanelData: any;
  setIsExpand: any;
}

const TestList: React.FC<TestListProps> = ({
  isExpand,
  panelTypes,
  referenceLab,
  item,
  getPanelData,
  setIsExpand,
}) => {
  const [lookup, setLookup] = useState<TestLists[]>([]);
  const isMobile = useIsMobile();
  const [tagsFilterlookup, setTagsFilterLookup] = useState<TestLists[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTests, setSelectedTests] = useState<TestLists[]>([]);
  console.log(selectedTests, "selectedTests");

  const [selectedPanelType, setSelectedPanelType] = useState(item.panelTypeId);
  const [isSelectedByDefault, setIsSelectedByDefault] = useState(
    item?.isSelectDefaultOnRequisition
  );
  const [multiRangePanel, setMultiRangePanel] = useState<boolean>(false);
  const [selectedLab, setSelectedLab] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>("");
  const [isTestsLoaded, setIsTestsLoaded] = useState(false);

  const { t } = useLang();

  const [searchQueries, setSearchQueries] = useState({
    searchQuery: "",
    searchQuery2: "",
  });

  // ---------------------------------------------
  // DRAG & DROP STATES (CLEAN – NO CONFLICT)
  // ---------------------------------------------
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // ORIGINAL STATE ALREADY IN FILE
  const [dragOverItemIndex, setDragOverItemIndex] = useState<IValues>({
    listone: "",
    listtwo: "",
  });

  // ---------------------------------------------
  // DRAG HANDLERS FOR SELECTED LIST
  // ---------------------------------------------
  const handleDragStart = (index: number) => {
    setDragStartIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);

    setDragOverItemIndex((prev: any) => ({
      ...prev,
      listtwo: index,
    }));
  };

  const handleDrop = () => {
    if (dragStartIndex === null || dragOverIndex === null) return;

    const updated = [...selectedTests];
    const draggedItem = updated[dragStartIndex];

    updated.splice(dragStartIndex, 1);
    updated.splice(dragOverIndex, 0, draggedItem);

    setSelectedTests(updated);

    setDragStartIndex(null);
    setDragOverIndex(null);

    setDragOverItemIndex((prev) => ({ ...prev, listtwo: "" }));
  };

  // -------------------------------------------------
  // API & OTHER ORIGINAL LOGIC (NO CHANGE)
  // -------------------------------------------------
  const testListsLookup = async () => {
    try {
      setLoading(true);
      const obj = {
        labId: selectedLab,
        tag: selectedTag,
        isMultiRange: multiRangePanel,
      };
      const res: AxiosResponse = await getTestListsLookup(obj);

      const filteredLookUp: any = res?.data
        .filter(
          (test: any) =>
            !selectedTests.some(
              (selectedTest) => selectedTest.testID === test.testID
            )
        )
        .map((test: any) => test);

      setLookup(filteredLookUp || []);
    } catch (error) {
      console.error(t("Error fetching TEST LISTS LOOKUP:"), error);
    } finally {
      setLoading(false);
    }
  };

  const tagsFilterLookup = async () => {
    if (!selectedLab) return;
    try {
      setLoading(true);
      const res: AxiosResponse = await getTagsFilterLookup(selectedLab);
      setTagsFilterLookup(res.data);
    } catch (error) {
      console.error(t("Error fetching TAGS LOOKUP:"), error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => setIsExpand(false);

  const handleSubmitExpand = async () => {
    try {
      if (selectedPanelType && selectedTests.length) {
        const API_OBJ = {
          panelId: item.id,
          groupId: item.groupId,
          panelTypeId: selectedPanelType ?? 0,
          tests: selectedTests.map((test) => ({
            testId: test.testID,
            testConfigId: test.testConfigID,
            isGroupTest: test.isGroupTest,
          })),
          isSelectDefaultOnRequisition: isSelectedByDefault,
        };

        const res: AxiosResponse = await SavePanelSetupExpand(API_OBJ);

        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          handleCancel();
          getPanelData();
        } else {
          toast.error(res?.data?.message);
        }
      } else {
        toast.error(t("Please select display type and test to proceed."));
      }
    } catch (err) {
      console.trace(err);
    }
  };

  useEffect(() => {
    if (selectedLab) {
      testListsLookup();
    }
  }, [isTestsLoaded, selectedTag, selectedLab]);

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedPanelType(Number(e.target.value));
  };

  const handleCheckBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSelectedByDefault(e.target.checked);
  };

  const handleTestSelection = (test: TestLists, isSelected: boolean) => {
    if (isSelected) {
      setLookup((prev) => prev.filter((item) => item.testID !== test.testID));
      setSelectedTests((prev) => [...prev, test]);
    } else {
      setSelectedTests((prev) =>
        prev.filter((item) => item.testID !== test.testID)
      );
      setLookup((prev) => [...prev, test]);
    }
  };

  const handleSelectChange = (value: any, name: string) => {
    if (!value) setLookup([]);

    if (name === "performingLab") setSelectedLab(value);
    else setSelectedTag(value);
  };

  useEffect(() => {
    if (selectedLab) tagsFilterLookup();
    else {
      setTagsFilterLookup([]);
      setSelectedTag("");
    }
  }, [selectedLab]);

  const handleSearchChange =
    (query: "searchQuery" | "searchQuery2") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQueries((prev) => ({
        ...prev,
        [query]: e.target.value,
      }));
    };

  useEffect(() => {
    if (referenceLab.length === 1) {
      setSelectedLab(referenceLab[0].value);
    }
  }, []);

  useEffect(() => {
    setSelectedPanelType(item.panelTypeId);
  }, [item.panelTypeId]);

  useEffect(() => {
    setSelectedTests(item.tests.map((test: any) => test));
    setIsTestsLoaded(true);
  }, []);

  const moveAllToAvailable = () => {
    if (Array.isArray(selectedTests) && selectedTests.length > 0) {
      const filteredTests = selectedTests.filter((test) =>
        test.testName
          ?.toLowerCase()
          ?.includes(searchQueries.searchQuery2?.toLowerCase())
      );
      setLookup((prev) => [...prev, ...filteredTests]);
      setSelectedTests((prev) =>
        prev.filter(
          (test) =>
            !filteredTests.some((filtered) => filtered.testID === test.testID)
        )
      );
    }
  };

  const moveAllToSelected = () => {
    if (Array.isArray(lookup) && lookup.length > 0) {
      const filteredTests = lookup.filter((test) =>
        test.testName
          ?.toLowerCase()
          ?.includes(searchQueries.searchQuery?.toLowerCase())
      );
      setSelectedTests((prev) => [...prev, ...filteredTests]);
      setLookup((prev) =>
        prev.filter(
          (test) =>
            !filteredTests.some((filtered) => filtered.testID === test.testID)
        )
      );
    }
  };

  return (
    <>
      <div className="row py-4 py-md-3 row">
        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 d-flex">
          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-6">
            <div className="fv-row mb-4 ">
              <label className="mb-2 fw-700 required">
                {t("Display Type:")}
              </label>
              <div className="align-items-sm-center d-flex flex-column flex-sm-row flex-wrap gap-4 justify-content-md-start justify-content-start">
                {panelTypes?.map((panelType) => (
                  <div
                    key={panelType.id}
                    className="d-flex align-items-center gap-3"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      id={`radioButton_${panelType.id}_${item.id}`}
                      value={panelType.id}
                      name={`resultType-${item.id}`}
                      checked={selectedPanelType === panelType.id}
                      onChange={handleRadioChange}
                    />
                    <Tooltip
                      title={
                        <span style={{ fontSize: "1.1rem" }}>
                          {panelType.description}
                        </span>
                      }
                      arrow
                      placement="top"
                    >
                      <label
                        className="form-check-label fw-500"
                        htmlFor={`radioButton_${panelType.id}_${item.id}`}
                      >
                        {t(panelType.name)}
                      </label>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-6">
            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
              <input
                className="form-check-input h-20px w-20px"
                type="checkbox"
                name="isSelectDefaultOnRequisition"
                checked={isSelectedByDefault}
                onChange={handleCheckBoxChange}
              />
              <span className="fw-bold">
                {t("Default Selection On Requisition")}
              </span>
            </label>
          </div>
        </div>
      </div>
      <div className="card rounded" style={{ border: "2px solid orange" }}>
        <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
          <h6 className="mb-0" style={{ color: "orange" }}>
            {t("Test Assignment")}
          </h6>
        </div>

        <div className="card-body py-md-4 py-3 px-4">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="row g-3">
              {/* LEFT COLUMN - Available Tests */}
              <div className="col-lg-5 col-md-12 col-sm-12 pe-2">
                <div className="row g-3 flex-wrap justify-content-between align-items-center">
                  <div className="col-xl-3 col-md-6 col-sm-12">
                    <div className="w-100">
                      <Select
                        inputId={`CategorySetupSelectLabs`}
                        menuPortalTarget={document.body}
                        styles={reactSelectSMStyle2()}
                        options={referenceLab}
                        theme={(theme: any) => styles(theme)}
                        placeholder={t("Select Lab")}
                        name="performingLab"
                        isSearchable={true}
                        isClearable
                        value={referenceLab?.filter(
                          (data: any) => data.value == selectedLab
                        )}
                        onChange={(event: any) => {
                          handleSelectChange(
                            event ? event.value : null,
                            "performingLab"
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-6 col-sm-12">
                    <div className="w-100">
                      <Select
                        inputId={`CategorySetupSelectTags`}
                        menuPortalTarget={document.body}
                        styles={reactSelectSMStyle2()}
                        options={tagsFilterlookup}
                        theme={(theme: any) => styles(theme)}
                        placeholder={t("Select Tags")}
                        name="tagsFilter"
                        isSearchable={true}
                        isClearable={true}
                        value={tagsFilterlookup?.filter(
                          (item: any) => item.value == selectedTag
                        )}
                        onChange={(event: any) => {
                          handleSelectChange(
                            event ? event.value : null,
                            "tagsFilter"
                          );
                        }}
                      />
                    </div>
                  </div>

                  {isMobile && (
                    <div className="col-lg-1 col-md-12 col-sm-12 d-flex flex-row align-items-center justify-content-center gap-3 px-2">
                      <span
                        className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                        onClick={moveAllToSelected}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          id="LabAsignmenSelectFacility"
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf101;
                        </i>
                      </span>
                      <span
                        className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1"
                        onClick={moveAllToAvailable}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          id="LabAsignmenDeselectFacility"
                          style={{ fontSize: "20px", color: "white" }}
                          className="fa"
                        >
                          &#xf100;
                        </i>
                      </span>
                    </div>
                  )}
                  <div className="col-xl-6 col-md-12 col-sm-12">
                    <div className="w-100">
                      <input
                        id={`CategorySetupAllTestListSearch`}
                        type="text"
                        className="form-control bg-white mb-3 mb-lg-0 rounded-2 h-30px fs-8 w-100"
                        placeholder={t("Search...")}
                        value={searchQueries.searchQuery}
                        onChange={handleSearchChange("searchQuery")}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                  <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                    <span className="fw-bold">{t("Test List")}</span>
                  </div>
                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {lookup
                      ?.filter((test) =>
                        test.testName
                          ?.toLowerCase()
                          ?.includes(searchQueries.searchQuery?.toLowerCase())
                      )
                      .map((test, index) => (
                        <li
                          id={`CategorySetupAllTestList_${test.testID}`}
                          key={`${test.testID}-${index}`}
                          className={
                            dragOverItemIndex.listone === index
                              ? "list-group-item next-position py-1 px-2 cursor-pointer"
                              : "list-group-item py-1 px-2 border-0 cursor-pointer"
                          }
                          onClick={() => handleTestSelection(test, true)}
                        >
                          <div className="d-flex">
                            <React.Fragment key={`${test.testID}-${index}`}>
                              {test.testName}
                            </React.Fragment>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* CENTER COLUMN - Action Buttons */}

              {!isMobile && (
                <div className="col-lg-1 col-md-12 col-sm-12 d-flex flex-column align-items-center justify-content-center gap-3 px-2">
                  <span
                    className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                    onClick={moveAllToSelected}
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      id="LabAsignmenSelectFacility"
                      style={{ fontSize: "20px", color: "white" }}
                      className="fa"
                    >
                      &#xf101;
                    </i>
                  </span>
                  <span
                    className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1"
                    onClick={moveAllToAvailable}
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      id="LabAsignmenDeselectFacility"
                      style={{ fontSize: "20px", color: "white" }}
                      className="fa"
                    >
                      &#xf100;
                    </i>
                  </span>
                </div>
              )}

              {/* RIGHT COLUMN - Selected Tests */}
              <div className="col-lg-5 col-md-12 col-sm-12 ps-2">
                <input
                  id={`CategorySetupSelectedTestListSearch`}
                  type="text"
                  className="form-control bg-white mb-3 rounded-2 h-30px fs-8 w-100"
                  placeholder={t("Search...")}
                  value={searchQueries.searchQuery2}
                  onChange={handleSearchChange("searchQuery2")}
                />
                <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                  <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                    <span className="fw-bold">{t("Selected Test List")}</span>
                  </div>
                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {selectedTests
                      ?.filter((test) =>
                        test.testName
                          ?.toLowerCase()
                          ?.includes(searchQueries.searchQuery2.toLowerCase())
                      )
                      .map((test, index) => (
                        <li
                          id={`CategorySetupSelectedTestList_${test.testID}`}
                          key={`${test.testID}-${index}`}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragEnter={() => handleDragEnter(index)}
                          onDragEnd={handleDrop}
                          className={
                            dragOverItemIndex.listtwo === index
                              ? "list-group-item next-position py-1 px-2 cursor-pointer d-flex align-items-center"
                              : "list-group-item py-1 px-2 border-0 cursor-pointer d-flex align-items-center"
                          }
                          onClick={() => handleTestSelection(test, false)}
                        >
                          <span
                            style={{ marginRight: "8px", cursor: "grab" }}
                            className="fas fa-grip-vertical"
                          >
                            {/* <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                            </svg> */}
                          </span>
                          <span>{test.testName}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <button
          id={`CategorySetupTestListCancel`}
          className="btn btn-warning btn-sm fw-bold mr-3 px-5 text-capitalize text-white h-30px"
          onClick={handleCancel}
        >
          {t("Cancel")}
        </button>
        <button
          id={`CategorySetupTestListSave`}
          className="btn btn-primary btn-sm fw-bold mr-3 px-5 text-capitalize h-30px"
          onClick={handleSubmitExpand}
        >
          {t("Save")}
        </button>
      </div>
    </>
  );
};

export default TestList;
