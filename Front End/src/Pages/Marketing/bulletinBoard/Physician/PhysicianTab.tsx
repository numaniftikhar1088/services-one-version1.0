// IMPORTS
import {
  Box,
  Button,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useLang from 'Shared/hooks/useLanguage';
import {
  deleteRecord,
  getFacilitiesLookup,
  physicianTable,
  savePhysician,
} from '../../../../Services/Marketing/BulletinBoardService';
import { Loader } from '../../../../Shared/Common/Loader';
import NoRecord from '../../../../Shared/Common/NoRecord';
import PermissionComponent from '../../../../Shared/Common/Permissions/PermissionComponent';
import usePagination from '../../../../Shared/hooks/usePagination';
import { ArrowDown, ArrowUp } from '../../../../Shared/Icons';
import { SortingTypeI, sortById } from '../../../../Utils/consts';
import CreatePost from './CreatePost';
import PhysicianTableRow from './PhysicianTableRow';
import  useIsMobile  from 'Shared/hooks/useIsMobile';

/* #############-------------PHYSCIAN SCREEEN-----------################### */

/* #############-------------PHYSCIAN TAB---------------################### */

// ?   interface for the PHYCIAN bulletin items from GET API
interface BulletinItem {
  id: number;
  bulletinTitle: string;
  bulletinDescription: string;
  isUrgent: boolean;
  userType: string;
  isAllUser: boolean;
  bulletinBoardDetails: any[];
}

// ! ------------------------ CREATE POST INTERFACES STARTS ---------------------------

interface Facility {
  value: number;
  label: string;
}

interface FormData {
  title: string;
  description: string;
  urgent: boolean;
  selectedFacilities: Facility[];
}

interface QueryModel {
  bulletinTitle?: string;
  bulletinDescription?: string;
  isUrgent?: boolean;
  userType?: string;
  isAllUser?: boolean;
}

export default function PhysicianTab() {
  const { t } = useLang();
  const isMobile = useIsMobile();

  // ? ############ <<<EDITING CASE STARTS>>>################

  const [editedItem, setEditedItem] = useState({});
  const [editedSelectedFacilities, setEditSelectedFacilities] = useState<any[]>(
    []
  );
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  // ? ############ <<<<EDITING CASE ENDS>>>> ################

  // ! ------------------------ CREATE POST STATES STARTS ---------------------------

  const [lookup, setLookup] = useState<Facility[]>([]);

  // normal case
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSearchTerm, setSelectedSearchTerm] = useState('');

  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);

  // POST REQUEST DATA { THE FORMAT IN WHICH IT IS TO BE SEND}
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    urgent: false,
    selectedFacilities: [],
  });

  /* ----------------******** PHYSCIAN TAB STATES START>>>>>> **********------------------------------  */

  const [loading, setLoading] = useState(true);

  const [loadingLookup, setLoadingLookup] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // SHOW LOADER WHEN TRUE || DELETING IN PROGRESS,
  const [deleting, setDeleting] = useState(false);

  // * RESPONSE STORED / TABLE DATA >>>>
  const [physicianData, setPhysicianData] = useState<BulletinItem[]>([]);

  const [showCreatePost, setShowCreatePost] = useState(false);

  const [titleSearch, setTitleSearch] = useState<string>('');

  const [descriptionSearch, setDescriptionSearch] = useState<string>('');

  // ! ------------------------ CREATE POST API INTEGRATION STARTS ---------------------------

  // * Pagination Hooks
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

  /*#########################----SORT STARTS------########################## */

  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const searchRef = useRef<any>(null);

  /////////////
  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === 'asc'
        ? (searchRef.current.id = 'desc')
        : (searchRef.current.id = 'asc')
      : (searchRef.current.id = 'asc');

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });

    fetchPhysicianTable();
  };

  // * ##################----------------GET API LOOKUP STARTS----------------############################

  const getBulletinFacilityLookup = async () => {
    setLoadingLookup(true);
    setError(null);
    try {
      const res = await getFacilitiesLookup();
      setLookup(res.data);
    } catch (error) {
      console.error(t('Error fetching facilities lookup:'), error);
      setError(t('Failed to fetch facilities'));
    } finally {
      setLoadingLookup(false);
    }
  };

  /* ############################# POST DATA / HANDLE SAVE ################################# */
  const handleSave = async (editedItem?: BulletinItem): Promise<boolean> => {
    if (!editedItem) {
      const { title, description, urgent, selectedFacilities } = formData;

      if (!title) {
        toast.error(t('Title is required.'));
        return false;
      }

      if (!description) {
        toast.error(t('Description is required.'));
        return false;
      }

      if (selectedFacilities.length === 0) {
        toast.error(t('At least one facility must be selected.'));
        return false;
      }

      // Map selectedFacilities to bulletinBoardDetailLists format
      const bulletinBoardDetailLists = selectedFacilities.map(
        (facility: Facility) => ({
          bulletinBoardId: 0,
          facilityId: facility.value,
          salesRepId: '',
        })
      );

      // Create object to send
      const obj = {
        id: 0,
        bulletinTitle: title,
        bulletinDescription: description,
        isUrgent: urgent,
        userType: 'Physician',
        isAllUser: true,
        bulletinBoardDetailLists: bulletinBoardDetailLists,
      };

      try {
        await savePhysician(obj);
        toast.success(t('Record created successfully!'));
        setShowCreatePost(false);
        return true;
      } catch (err) {
        toast.error(t('Error saving data.'));
        console.error(t('Error saving data:'), err);
        return false;
      } finally {
        fetchPhysicianTable();
      }
    } else {
      const { bulletinBoardDetails, ...rest } = editedItem;

      const bulletinBoardDetailLists = editedSelectedFacilities.map(
        (facility: Facility) => ({
          bulletinBoardId: 0,
          facilityId: facility.value,
          salesRepId: '',
        })
      );

      // Validate the edited data
      if (
        !rest.bulletinTitle ||
        !rest.bulletinDescription ||
        editedSelectedFacilities.length === 0
      ) {
        toast.error(t('Please fill in all required fields.'));
        return false; // Return early if validation fails
      }
      try {
        await savePhysician({
          bulletinBoardDetailLists: bulletinBoardDetailLists,
          ...rest,
        }); // Ensure editedItem is properly formatted
        toast.success(t('Record updated successfully!'));
        fetchPhysicianTable();
        return true;
      } catch (err) {
        toast.error(t('Error updating data.'));
        console.error(t('Error updating data:'), err);
        return false;
      }
    }
  };

  /* ############# ONCHANGE FOR FACILITIES LOOKUP  #########################*/
  const handleFacilitySelected = (facility: Facility) => {
    try {
      const updatedLookup = lookup.filter(
        value => value.value !== facility.value
      );
      setLookup(updatedLookup);

      // Add the selected facility to the selectedFacilities array
      const updatedSelectedFacilities = [...selectedFacilities, facility];
      setSelectedFacilities(updatedSelectedFacilities);

      const updateEditedSelectedFacilities = [
        ...editedSelectedFacilities,
        facility,
      ];
      setEditSelectedFacilities(updateEditedSelectedFacilities);

      // Update the formData state with the selected facility
      const updatedFormData = {
        ...formData,
        selectedFacilities: updatedSelectedFacilities,
      };
      setFormData(updatedFormData);
    } catch (error) {
      console.error(t('Error in handleFacilitySelected:'), error);
    }
  };

  /* ############# ONCHANGE FOR SELECTED FACILITIES  #########################*/

  const handleFacilityBack = (facility: Facility) => {
    try {
      // Add the deselected facility back to the lookup array
      const updatedLookup = [...lookup, facility];
      setLookup(updatedLookup);

      // Remove the deselected facility from the selectedFacilities array
      const updatedSelectedFacilities = selectedFacilities.filter(
        item => item.value !== facility.value
      );
      const updatedEditedSelectedFacilities = editedSelectedFacilities.filter(
        item => item.value !== facility.value
      );
      setSelectedFacilities(updatedSelectedFacilities);
      setEditSelectedFacilities(updatedEditedSelectedFacilities);

      // Update the formData state without the deselected facility
      const updatedFormData = {
        ...formData,
        selectedFacilities: updatedSelectedFacilities,
      };
      setFormData(updatedFormData);
    } catch (error) {
      console.error(t('Error in handleFacilityBack:'), error);
    }
  };

  // for all

  const handleSelectAll = () => {
    try {
      if (lookup.length > 0) {
        // Add all lookup facilities to selectedFacilities
        const updatedSelectedFacilities = [...selectedFacilities, ...lookup];
        setSelectedFacilities(updatedSelectedFacilities);

        // Add all lookup facilities to editedSelectedFacilities
        const updatedEditedSelectedFacilities = [
          ...editedSelectedFacilities,
          ...lookup,
        ];
        setEditSelectedFacilities(updatedEditedSelectedFacilities);

        // Clear the lookup array
        setLookup([]);

        // Update the formData state
        const updatedFormData = {
          ...formData,
          selectedFacilities: updatedSelectedFacilities,
        };
        setFormData(updatedFormData);
      }
    } catch (error) {
      console.error(t('Error in handleArrowClick (Select All):'), error);
    }
  };

  const handleDeselectAll = () => {
    try {
      if (selectedFacilities.length > 0) {
        // Add all selectedFacilities back to lookup
        const updatedLookup = [...lookup, ...selectedFacilities];
        setLookup(updatedLookup);

        // Clear the selectedFacilities and editedSelectedFacilities arrays
        setSelectedFacilities([]);
        setEditSelectedFacilities([]);

        // Update the formData state
        const updatedFormData = {
          ...formData,
          selectedFacilities: [],
        };
        setFormData(updatedFormData);
      }
    } catch (error) {
      console.error(t('Error in handleLeftArrowClick (Deselect All):'), error);
    }
  };

  /* ##############------------ <<<FACILITIES SEARCH ENDS>>>  ---------############## */

  // ############### ON CHANGE / CREATE POST #################
  // TO SAVE VALUES FROM INPUTS AND SET TO STATE
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // RESET CREATE POST / ROW  FIELDS
  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      urgent: false,
      selectedFacilities: [], // Reset selectedFacilities to an empty array
    });
    setSelectedFacilities([]); // Also reset selectedFacilities state directly
  };

  // ! ------------------------ CREATE POST API INTEGRATION ENDS ---------------------------

  // * ##################----------------TABLE RESPONSE POST API >>>>----------------#################
  // GET TABLE DATA
  const fetchPhysicianTable = async (queryModel = {}) => {
    setLoading(true);
    try {
      // * obj TO SEND TO RECEIVE RESPONNSE
      // ? GET ALL API

      const obj = {
        pageNumber: curPage,
        pageSize: pageSize,
        queryModel: {
          bulletinTitle:
            typeof titleSearch === 'string' ? titleSearch.trim() : titleSearch,
          bulletinDescription:
            typeof descriptionSearch === 'string'
              ? descriptionSearch.trim()
              : descriptionSearch,
          isUrgent: true,
          userType: 'Physician',
          isAllUser: true,
          ...queryModel,
        },
        sortColumn: sort.clickedIconData || 'Id',
        sortDirection: sort.sortingOrder || 'Desc',
      };

      const res = await physicianTable(obj);
      setPhysicianData(res?.data?.data);

      // ? GETTING TOTAL NUMBER OF RECORDS
      // * FOR PAGINATION
      setTotal(res?.data?.total);
    } catch (error) {
      console.error(t('Error fetching physician table data:'), error);
    } finally {
      // * Set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  // * Use effect hook to fetch data on page size or current page change
  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      await fetchPhysicianTable();
    };

    // Fetch data when the component mounts or when pageSize or curPage changes
    fetchData();
  }, [pageSize, curPage, triggerSearchData]); // Include dependencies that trigger data fetching
  console.log(triggerSearchData, 'triggerSearchData');

  // * ##################----------------DELETE API >>>>----------------#################

  // ? for DELETING RECORDS
  const handleDelete = async (id: number) => {
    try {
      setDeleting(true); // * Set deleting to true when delete operation starts
      await deleteRecord(id); // ! Delete the record with the specified ID
      fetchPhysicianTable(); // After successful deletion, fetch the updated physician table data
      toast.success(t('Record deleted successfully!'));
    } catch (error) {
      toast.error(t('Error deleting record.'));
      console.error(t('Error deleting record:'), error);
    } finally {
      setDeleting(false); // Set deleting to false when delete operation finishes
    }
  };

  // * ##################----------------TABLE RESET >>>>----------------#################
  // ? Handle reset function
  const handleReset = () => {
    setTitleSearch('');
    setDescriptionSearch('');
    setCurPage(1);
    setPageSize(50);

    fetchPhysicianTable({
      bulletinTitle: '',
      bulletinDescription: '',
    });
    setSorting(sortById);
    setSearchRequest(intialSearchQuery);
  };

  // * ##################----------------TABLE SEARCH >>>>----------------#################

  //  ? Handle search function
  const handleSearch = () => {
    setCurPage(1);
    setTriggerSearchData(prev => !prev);
    // const queryModel = {
    //   bulletinTitle: titleSearch,
    //   bulletinDescription: descriptionSearch,
    // };

    // fetchPhysicianTable(queryModel);
  };

  const intialSearchQuery: QueryModel = {
    bulletinTitle: '',
    bulletinDescription: '',
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  let [searchRequest, setSearchRequest] =
    useState<QueryModel>(intialSearchQuery);

  const queryDisplayTagNames: Record<string, string> = {
    bulletinTitle: 'Title',
    bulletinDescription: 'Description',
  };

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest(prevSearchRequest => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (intialSearchQuery as any)[clickedTag],
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
    if (searchedTags.length === 0) handleReset();
  }, [searchedTags.length]);

  useEffect(() => {
    setSearchRequest({
      ...searchRequest,
      bulletinTitle: titleSearch,
      bulletinDescription: descriptionSearch,
    });
  }, [titleSearch, descriptionSearch]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {showCreatePost ? (
        <CreatePost
          setShowCreatePost={setShowCreatePost}
          loadingLookup={loadingLookup}
          lookup={lookup}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFacilities={selectedFacilities}
          selectedSearchTerm={selectedSearchTerm} // Ensure this is being passed
          setSelectedSearchTerm={setSelectedSearchTerm} // Ensure this is being passed
          formData={formData}
          getBulletinFacilityLookup={getBulletinFacilityLookup}
          handleSave={handleSave}
          handleFacilitySelected={handleFacilitySelected}
          handleFacilityBack={handleFacilityBack}
          handleInputChange={handleInputChange}
          resetFormData={resetFormData}
          error={error}
          handleSelectAll={handleSelectAll}
          handleDeselectAll={handleDeselectAll}
        />
      ) : (
        <>
          {/* search YTags */}
          <div className="d-flex gap-4 flex-wrap mb-2">
            {searchedTags.map(tag => (
              <div
                className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                onClick={() => handleTagRemoval(tag)}
              >
                <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
                <i className="bi bi-x"></i>
              </div>
            ))}
          </div>

          <div className="mb-2 gap-2 responsive-flexed-actions align-items-center d-flex flex-wrap justify-content-center justify-content-sm-between">
            <div className="d-flex align-items-center gap-2 responsive-flexed-actions">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t('Records')}</span>
                <select
                  id={`BulletinBoardPhysicianResords`}
                  className="form-select w-125px h-33px rounded py-2"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-allow-clear="true"
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="d-flex align-items-center gap-2">
                <PermissionComponent
                  moduleName="Marketing"
                  pageName="Bulletin Board"
                  permissionIdentifier="Add"
                >
                  <Button
                    id={`BulletinBoardPhysicianAddNew`}
                    onClick={() => setShowCreatePost(true)}
                    variant="contained"
                    color="success"
                    className="btn btn-primary btn-sm text-capitalize fw-400"
                  >
                    <i style={{ fontSize: '15px' }} className="fa">
                      &#xf067;
                    </i>
                    <span>{t('Add new Post')}</span>
                  </Button>
                </PermissionComponent>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 ps-2">
              <button
                id={`BulletinBoardPhysicianSearch`}
                className="btn btn-info btn-sm fw-500"
                aria-controls="Search"
                onClick={() => {
                  handleSearch();
                }}
              >
                {t('Search')}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                id={`BulletinBoardPhysicianReset`}
                onClick={handleReset}
              >
                <span>{t('Reset')}</span>
              </button>
            </div>
          </div>

          <div className="card">
            <Box sx={{ height: 'auto', width: '100%' }}>
              <div className="table_bordered overflow-hidden">
                <TableContainer
                  sx={
                    
                    isMobile ?  {} :
                    
                    {
                    maxHeight: 'calc(100vh - 100px)',
                    '&::-webkit-scrollbar': {
                      width: 7,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#fff',
                    },
                    '&:hover': {
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'var(--kt-gray-400)',
                        borderRadius: 2,
                      },
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'var(--kt-gray-400)',
                      borderRadius: 2,
                    },
                  }}
                  component={Paper}
                  className="shadow-none"
                >
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                  >
                    <TableHead>
                      <TableRow className="h-40px">
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <input
                            id={`BulletinBoardPhysicianSearchTitle`}
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            value={titleSearch}
                            onChange={e => setTitleSearch(e.target.value)}
                            name="Search"
                            placeholder={t('Search ...')}
                            type="text"
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <input
                            id={`BulletinBoardPhysicianSearchDescription`}
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            value={descriptionSearch}
                            onChange={e => setDescriptionSearch(e.target.value)}
                            name="userGroup"
                            placeholder={t('Search ...')}
                            type="text"
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell style={{ width: '50px' }} />
                        <TableCell className="min-w-50px">
                          <div style={{ width: 'max-content' }}>
                            {t('Actions')}
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('bulletinTitle')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Title')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'bulletinTitle'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'bulletinTitle'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('bulletinDescription')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Description')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'bulletinDescription'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'bulletinDescription'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('isUrgent')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {' '}
                              {t('Urgent')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'isUrgent'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'isUrgent'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={5} className="sajawal">
                          <Loader />
                        </TableCell>
                      ) : physicianData.length === 0 ? (
                        <NoRecord colSpan={5} />
                      ) : (
                        physicianData.map((item: BulletinItem) => (
                          <PhysicianTableRow
                            key={item.id}
                            item={item}
                            onDelete={handleDelete}
                            deleting={deleting}
                            handleSave={handleSave}
                            fetchPhysicianTable={fetchPhysicianTable}
                            setEditedItem={setEditedItem}
                            editedItem={editedItem}
                            searchTerm={searchTerm}
                            loadingLookup={loadingLookup}
                            selectedSearchTerm={selectedSearchTerm} // Ensure this is being passed
                            handleFacilitySelected={handleFacilitySelected}
                            handleFacilityBack={handleFacilityBack}
                            resetFormData={resetFormData}
                            setEditSelectedFacilities={
                              setEditSelectedFacilities
                            }
                            getBulletinFacilityLookup={
                              getBulletinFacilityLookup
                            }
                            error={error}
                            setSearchTerm={setSearchTerm}
                            setSelectedSearchTerm={setSelectedSearchTerm}
                            editedSelectedFacilities={editedSelectedFacilities}
                            lookup={lookup}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </div>

          {/* ###############<-----PAGINATION START----->>############### */}
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
            <p className="pagination-total-record mb-0">
              <span>
                {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}{' '}
                {Math.min(pageSize * curPage, total)} {t('of Total')}
                <span> {total} </span> {t('entries')}
              </span>
            </p>
            <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
              <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
                <i className="fa fa-angle-double-left"></i>
              </li>
              <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
                <i className="fa fa-angle-left"></i>
              </li>
              {pageNumbers.map(page => (
                <li
                  key={page}
                  className={`px-2 ${
                    page === curPage
                      ? 'font-weight-bold bg-primary text-white h-33px'
                      : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => showPage(page)}
                >
                  {page}
                </li>
              ))}
              <li className="btn btn-lg p-2 h-33px" onClick={nextPage}>
                <i className="fa fa-angle-right"></i>
              </li>
              <li
                className="btn btn-lg p-2 h-33px"
                onClick={() => {
                  if (totalPages === 0) {
                    showPage(curPage);
                  } else {
                    showPage(totalPages);
                  }
                }}
              >
                <i className="fa fa-angle-double-right"></i>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
