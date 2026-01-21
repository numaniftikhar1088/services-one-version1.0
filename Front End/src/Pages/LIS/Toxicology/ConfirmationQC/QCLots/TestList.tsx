import React, { ChangeEvent, useState } from "react";
import Select from "react-select";
import { reactSelectSMStyle } from "Utils/Common";

const mockTestList: any[] = [
  { testID: 1, testName: "CBC", testConfigID: 101, isGroupTest: false },
  {
    testID: 2,
    testName: "Liver Function",
    testConfigID: 102,
    isGroupTest: true,
  },
  {
    testID: 3,
    testName: "Kidney Profile",
    testConfigID: 103,
    isGroupTest: false,
  },
  { testID: 4, testName: "Blood Sugar", testConfigID: 104, isGroupTest: false },
];

const referenceLab = [
  { label: "Lab One", value: 1 },
  { label: "Lab Two", value: 2 },
];

const specimenTypes = [
  { label: "Blood", value: "blood" },
  { label: "Urine", value: "urine" },
  { label: "Saliva", value: "saliva" },
];

const TestList: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedSpecimen, setSelectedSpecimen] = useState(null);

  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [searchQueries, setSearchQueries] = useState({
    searchQuery: "",
    searchQuery2: "",
  });

  const handleTestSelection = (test: any, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTests((prev) => [...prev, test]);
    } else {
      setSelectedTests((prev) =>
        prev.filter((item) => item.testID !== test.testID)
      );
    }
  };

  const handleSearchChange =
    (queryType: "searchQuery" | "searchQuery2") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQueries((prev) => ({ ...prev, [queryType]: e.target.value }));
    };

  const availableTests = mockTestList.filter(
    (test) => !selectedTests.some((selected) => selected.testID === test.testID)
  );

  return (
    <>
      <div className="card rounded" style={{ border: "2px solid orange" }}>
        <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
          <h6 className="mb-0" style={{ color: "orange" }}>
            Test Assignment
          </h6>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            padding: 20,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              width: "25%",
              alignItems: "center",
            }}
          >
            <strong>Performing Lab:</strong>
            <Select
              options={referenceLab}
              value={referenceLab.find((lab) => lab.value === selectedLab)}
              onChange={(option) =>
                setSelectedLab((option?.value as any) || null)
              }
              placeholder="Select Lab"
              isClearable
              styles={reactSelectSMStyle}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 4,
              width: "25%",
              alignItems: "center",
            }}
          >
            <strong>Specimen Type:</strong>
            <Select
              options={specimenTypes}
              value={specimenTypes.find((sp) => sp.value === selectedSpecimen)}
              onChange={(option) =>
                setSelectedSpecimen((option?.value as any) || null)
              }
              placeholder="Select Specimen"
              isClearable
              styles={reactSelectSMStyle}
            />
          </div>
        </div>

        <div className="card-body py-md-4 py-3 px-4">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
            <div className="row gap-lg-0 gap-md-5">
              {/* All Tests */}
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="row g-3 flex-wrap justify-content-between align-items-center">
                  <input
                    id={`CategorySetupAllTestListSearch`}
                    type="text"
                    className="form-control bg-white mb-3 mb-lg-0 rounded-2 h-30px fs-8 w-100"
                    placeholder="Search..."
                    value={searchQueries.searchQuery}
                    onChange={handleSearchChange("searchQuery")}
                  />
                </div>
                <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                  <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                    <span className="fw-bold">Test List</span>
                  </div>
                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {availableTests
                      .filter((test) =>
                        test.testName
                          ?.toLowerCase()
                          ?.includes(searchQueries.searchQuery?.toLowerCase())
                      )
                      .map((test, index) => (
                        <li
                          id={`CategorySetupAllTestList_${test.testID}`}
                          key={`${test.testID}-${index}`}
                          onClick={() => handleTestSelection(test, true)} // move to selected
                          className="list-group-item"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex">
                            <span>{test.testName}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Selected Tests */}
              <div className="mb-2 col-lg-6 col-md-12 col-sm-12 ">
                <input
                  id={`CategorySetupSelectedTestListSearch`}
                  type="text"
                  className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                  placeholder="Search..."
                  value={searchQueries.searchQuery2}
                  onChange={handleSearchChange("searchQuery2")}
                />
                <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                  <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                    <span className="fw-bold">Selected Test List</span>
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
                          onClick={() => handleTestSelection(test, false)} // move to all
                          className="list-group-item"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex">
                            <span>{test.testName}</span>
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
    </>
  );
};

export default TestList;
