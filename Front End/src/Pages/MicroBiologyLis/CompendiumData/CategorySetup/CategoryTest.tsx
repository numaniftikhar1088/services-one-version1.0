import { Tooltip } from "@mui/material";
import { AxiosResponse } from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  getPanelTypeLookup,
  getTagsFilterLookup,
  getTestListsLookup,
  SavePanelSetupExpand,
} from "../../../../Services/Compendium/BloodLisCompendium/BloodLisCompendium";
import { reactSelectSMStyle2, styles } from "../../../../Utils/Common";
import { IValues } from "../../../Facility/LabAssignment/FacilitySelection";
import useLang from "./../../../../Shared/hooks/useLanguage";
import {
  PanelTypes,
  ReferenceLab,
  TestLists,
} from "Pages/Blood/BloodCompendium/Panel/Headers";
import FacilityService from "Services/FacilityService/FacilityService";
import {
  getCategoryTagsFilterLookup,
  getCompendiumTestListsLookup,
  MicroBioPanelSetuExpandpSaveData,
} from "Services/MicroBiologyCompendium/MicrobiologyCompendium";

function CategoryTestList({ row, GetAllCategorySetupData, setIsExpand }: any) {
  const [lookup, setLookup] = useState<TestLists[]>([]);
  const [tagsFilterlookup, setTagsFilterLookup] = useState<TestLists[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTests, setSelectedTests] = useState<TestLists[]>([]);
  const [panelTypes, setPanelTypes] = useState<PanelTypes[]>([]);
  const [referenceLab, setReferenceLab] = useState<ReferenceLab[]>([]);
  const [selectedPanelType, setSelectedPanelType] = useState(row.panelTypeId);
  const [isSelectedByDefault, setIsSelectedByDefault] = useState(
    row?.isSelectDefaultOnRequisition
  );
  const [selectedLab, setSelectedLab] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>("");
  const [isTestsLoaded, setIsTestsLoaded] = useState(false);
  const [searchQueries, setSearchQueries] = useState<{
    searchQuery: string;
    searchQuery2: string;
  }>({
    searchQuery: "",
    searchQuery2: "",
  });

  const { t } = useLang();

  const panelTypeLookup = async () => {
    try {
      const res = await getPanelTypeLookup();
      setPanelTypes(res?.data);
    } catch (error) {
      console.error("Error fetching panel types:", error);
    }
  };

  const fetchReferenceLab = async () => {
    try {
      const res: AxiosResponse = await FacilityService.referenceLabLookup();
      const referenceArray: ReferenceLab[] =
        res?.data?.data?.map((val: any) => ({
          value: val?.labId,
          label: val?.labDisplayName,
        })) || [];
      setReferenceLab(referenceArray);
    } catch (err: any) {
      console.error("Error fetching reference labs:", err.message);
    }
  };

  // TEST LISTS AGAINST LAB ID EXPAND LOOKUP
  const testListsLookup = async () => {
    try {
      setLoading(true);
      const obj = {
        labId: selectedLab,
        tag: "",
        isMultiRange: null,
      };
      const res: AxiosResponse = await getCompendiumTestListsLookup(obj);
      // Filter out the tests already in the 'Selected Test List'
      const filteredLookUp: any = res?.data
        .filter((test: any) => {
          return !selectedTests.some(
            (selectedTest) => selectedTest.testID === test.testID
          );
        })
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
      const res: AxiosResponse = await getCategoryTagsFilterLookup(selectedLab); // This should be the API call function
      console.log(res, "resresresresres");

      setTagsFilterLookup(res.data);
    } catch (error) {
      console.error(t("Error fetching TEST LISTS LOOKUP:"), error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsExpand(false);
  };

  const handleSubmitExpand = async (data: any) => {
    try {
      if (!selectedTests.length) {
        toast.error("No tests selected");
        return;
      }
      const API_OBJ = {
        panelId: row.id,
        groupId: 0,
        panelTypeId: selectedPanelType ?? 0,
        tests: selectedTests.map((test) => ({
          testId: test.testID,
          testConfigId: test.testConfigID,
          isGroupTest: test.isGroupTest,
        })),
        isSelectDefaultOnRequisition: isSelectedByDefault,
      };
      const res: AxiosResponse =
        await MicroBioPanelSetuExpandpSaveData(API_OBJ);

      if (res?.data?.httpStatusCode === 200) {
        toast.success(t(res?.data?.message));
        handleCancel();
        GetAllCategorySetupData();
      } else if (res?.data?.httpStatusCode == 400) {
        toast.error(t(res?.data?.status));
      }
    } catch (err: any) {
      console.trace(err);
    }
  };

  useEffect(() => {
    if (selectedLab) {
      testListsLookup();
    }
  }, [isTestsLoaded, selectedTag, selectedLab]);

  const [dragOverItemIndex, setDragOverItemIndex] = useState<IValues>({
    listone: "",
    listtwo: "",
  });

  const handleTestSelection = (test: TestLists, isSelected: boolean) => {
    if (isSelected) {
      // Move the test from 'All Test Assignments' to 'Selected Test List'
      setLookup((prevLookup) =>
        prevLookup.filter((item) => item.testID !== test.testID)
      );
      setSelectedTests((prevSelected) => [...prevSelected, test]);
    } else {
      // Move the test from 'Selected Test List' back to 'All Test Assignments'
      setSelectedTests((prevSelected) =>
        prevSelected.filter((item) => item.testID !== test.testID)
      );
      setLookup((prevLookup) => [...prevLookup, test]);
    }
  };

  const handleSelectChange = (value: any, name: string) => {
    if (!value) {
      setLookup([]);
    }

    if (name === "performingLab") {
      setSelectedLab(value);
    } else {
      setSelectedTag(value);
    }
  };

  useEffect(() => {
    panelTypeLookup();
    fetchReferenceLab();
  }, []);

  useEffect(() => {
    if (selectedLab) {
      tagsFilterLookup();
    } else {
      setTagsFilterLookup([]);
      setSelectedTag("");
    }
  }, [selectedLab]);

  const handleSearchChange =
    (queryType: "searchQuery" | "searchQuery2") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQueries((prev) => ({ ...prev, [queryType]: e.target.value }));
    };

  useEffect(() => {
    if (referenceLab.length === 1) {
      setSelectedLab(referenceLab[0].value);
    }
  }, []);
  console.log(referenceLab, "referenceLab");

  //   useEffect(() => {
  //     setSelectedPanelType(item.panelTypeId);
  //   }, [item.panelTypeId]);

  useEffect(() => {
    setSelectedTests(row.tests.map((test: any) => test));
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
      {/* <div className="card rounded" style={{ border: "2px solid orange" }}>
        <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
          <h6 className="mb-0" style={{ color: "orange" }}>
            {t("Test Assignment")}
          </h6>
        </div>
        <div className="card-body py-md-4 py-3 px-4">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
            <div className="row gap-lg-0 gap-md-5">
              <div className="col-lg-6 col-md-12 col-sm-12">
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
              <div className="mb-2 col-lg-6 col-md-12 col-sm-12 ">
                <input
                  id={`CategorySetupSelectedTestListSearch`}
                  type="text"
                  className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
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
                          ?.includes(searchQueries.searchQuery2?.toLowerCase())
                      )
                      ?.map((test, index) => (
                        <li
                          id={`CategorySetupSelectedTestList_${test.testID}`}
                          key={`${test.testID}-${index}`}
                          className={
                            dragOverItemIndex.listtwo === index
                              ? "list-group-item next-position py-1 px-2 cursor-pointer"
                              : "list-group-item py-1 px-2 border-0 cursor-pointer"
                          }
                          onClick={() => handleTestSelection(test, false)}
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
            </div>
          </div>
        </div>
      </div> */}
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
                          ?.includes(searchQueries.searchQuery2?.toLowerCase())
                      )
                      ?.map((test, index) => (
                        <li
                          id={`CategorySetupSelectedTestList_${test.testID}`}
                          key={`${test.testID}-${index}`}
                          className={
                            dragOverItemIndex.listtwo === index
                              ? "list-group-item next-position py-1 px-2 cursor-pointer"
                              : "list-group-item py-1 px-2 border-0 cursor-pointer"
                          }
                          onClick={() => handleTestSelection(test, false)}
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
}

export default CategoryTestList;
