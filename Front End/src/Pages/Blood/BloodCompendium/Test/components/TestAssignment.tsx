import { AxiosResponse } from 'axios';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import Select from 'react-select';
import { IndividualTestsAgainstLabId } from 'Services/Compendium/BloodLisCompendium/BloodLisCompendium';
import useLang from 'Shared/hooks/useLanguage';
import { reactSelectStyle, styles } from 'Utils/Common';
import { ReferenceLab, TestLists } from '../../Panel/Headers';
import { FormData } from '../ExpandRow';
import AdditionalSetupPanel from './AdditionalSetupPanel';

interface TestAssignmentProps {
  formData: FormData;
  selectedLab: number | null;
  referenceLab: ReferenceLab[];
  setFormData: Dispatch<SetStateAction<FormData>>;
  setSelectedLab: Dispatch<SetStateAction<number | null>>;
}

const TestAssignment: React.FC<TestAssignmentProps> = ({
  formData,
  setFormData,
  selectedLab,
  referenceLab,
  setSelectedLab,
}) => {
  const { t } = useLang();

  const [lookup, setLookup] = useState<TestLists[]>([]);
  const [searchQueries, setSearchQueries] = useState<{
    searchQuery: string;
    searchQuery2: string;
  }>({
    searchQuery: '',
    searchQuery2: '',
  });

  //Handle Change Functions
  const handleSelectChange = (value: any) => {
    setSelectedLab(value);
  };

  const handleSearchChange =
    (queryType: 'searchQuery' | 'searchQuery2') =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchQueries(prev => ({ ...prev, [queryType]: e.target.value }));
    };

  const handleTestSelection = (test: TestLists, isSelected: boolean) => {
    if (isSelected) {
      // Move the test from 'All Test Assignments' to 'Selected Test List'
      setLookup(prevLookup =>
        prevLookup.filter(item => item.testID !== test.testID)
      );
      // setSelectedTests((prevSelected) => [...prevSelected, test]);
      setFormData(prevData => ({
        ...prevData,
        groupTests: {
          ...prevData.groupTests,
          groupTestsAssignments: [
            ...prevData.groupTests.groupTestsAssignments,
            {
              testID: test.testID,
              testName: test.testName,
              testConfigId: test.testConfigID,
            },
          ],
        },
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        groupTests: {
          ...prevData.groupTests,
          groupTestsAssignments:
            prevData.groupTests.groupTestsAssignments.filter(
              item => item.testID !== test.testID
            ),
        },
      }));
      setLookup(prevLookup => [...prevLookup, test]);
    }
  };

  // Test list against labId Lookup
  const testListsLookup = async () => {
    if (selectedLab !== null) {
      try {
        const obj = {
          labId: selectedLab,
          tag: '',
          isMultiRange: false,
        };
        const res: AxiosResponse = await IndividualTestsAgainstLabId(obj);
        // Filter out the tests already in the 'Selected Test List'
        const filteredLookUp: any = res?.data
          .filter((test: any) => {
            return !formData.groupTests.groupTestsAssignments.some(
              selectedTest => selectedTest.testID === test.testID
            );
          })
          .map((test: any) => test);
        setLookup(filteredLookUp || []);
      } catch (error) {
        console.error(t('Error fetching TEST LISTS LOOKUP:'), error);
      }
    }
  };

  useEffect(() => {
    if (selectedLab) {
      testListsLookup();
    }
  }, [selectedLab]);

  return (
    <>
      <AdditionalSetupPanel formData={formData} setFormData={setFormData} />
      <div
        className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
        style={{ border: '2px solid orange' }}
      >
        <div className="card-header bg-light-warning d-flex justify-content-between align-items-center px-4 min-h-40px">
          <h5 className="m-0 " style={{ color: 'orange' }}>
            {t('Test Assignment')}
          </h5>
        </div>
        <div className="card-body py-md-4 py-3 px-4">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-sm-12 ">
                <div className="row g-3 flex-wrap justify-content-between align-items-center">
                  <div className="col-xl-4 col-sm-12">
                    <div style={{ minWidth: '100%' }}>
                      {/* Add a wrapper to control width */}
                      <Select
                        inputId={`TestAsignmentSelectLab`}
                        menuPortalTarget={document.body}
                        styles={reactSelectStyle}
                        options={referenceLab}
                        theme={(theme: any) => styles(theme)}
                        placeholder={t('Select Lab')}
                        name="performingLab"
                        isSearchable={true}
                        value={referenceLab?.filter(
                          (data: any) => data.value === selectedLab
                        )}
                        onChange={(event: any) => {
                          handleSelectChange(event.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-xl-8 col-md-12 col-sm-12">
                    <input
                      id={`TestAsignmentSearchTestList`}
                      type="text"
                      className="form-control bg-white mb-3 mb-lg-0 rounded-2 h-37px fs-8 w-100"
                      placeholder={t('Search...')}
                      value={searchQueries.searchQuery}
                      onChange={handleSearchChange('searchQuery')}
                    />
                  </div>
                </div>
                <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                  <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                    <span className="fw-bold">{t('Test List')}</span>
                  </div>
                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {lookup
                      ?.filter(test =>
                        test.testName
                          ?.toLowerCase()
                          .includes(searchQueries.searchQuery?.toLowerCase())
                      )
                      .map((test, index) => (
                        <li
                          id={`TestAsignmentTestList_${test.testID}`}
                          key={`${test.testID}-${index}`}
                          className={
                            'list-group-item py-1 px-2 border-0 cursor-pointer'
                          }
                          onClick={() => handleTestSelection(test, true)} // Move to Selected List
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
                  id={`TestAsignmentSearchSelectedTestList`}
                  type="text"
                  className="form-control bg-white mb-3 mb-lg-0 h-37px rounded-2 fs-8 w-100"
                  placeholder={t('Search...')}
                  value={searchQueries.searchQuery2}
                  onChange={handleSearchChange('searchQuery2')}
                />
                <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                  <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                    <span className="fw-bold">{t('Selected Test List')}</span>
                  </div>
                  <ul className="list-group rounded-0 list-group-even-fill h-225px scroll">
                    {formData.groupTests.groupTestsAssignments
                      ?.filter((test: any) =>
                        test.testName
                          ?.toLowerCase()
                          .includes(searchQueries.searchQuery2?.toLowerCase())
                      )
                      ?.map((test: any, index: number) => (
                        <li
                          id={`TestAsignmentSelectedTestList_${test.testID}`}
                          key={`${test.testID}-${index}`}
                          className={
                            'list-group-item py-1 px-2 border-0 cursor-pointer'
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
    </>
  );
};

export default TestAssignment;
