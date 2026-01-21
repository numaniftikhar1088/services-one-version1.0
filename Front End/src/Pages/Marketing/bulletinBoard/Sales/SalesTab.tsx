// IMPORTS

import React, { useEffect, useRef, useState } from 'react';
// Table components
import { Box, Button, Paper, TableCell } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SalesTableRow from './SalesTableRow';

// Pagination hook
import { toast } from 'react-toastify';
import {
  deleteRecord,
  fetchSales,
  SalesTableData,
  saveSales,
} from '../../../../Services/Marketing/BulletinBoardService';
import { Loader } from '../../../../Shared/Common/Loader';
import PermissionComponent from '../../../../Shared/Common/Permissions/PermissionComponent';
import usePagination from '../../../../Shared/hooks/usePagination';
import { ArrowDown, ArrowUp } from '../../../../Shared/Icons';
import { sortById, SortingTypeI } from '../../../../Utils/consts';
import CreatePost from './CreatePost';
import useLang from 'Shared/hooks/useLanguage';
import NoRecord from '../../../../Shared/Common/NoRecord';

/* #############-------------SALES SCREEEN-----------################### */

/* #############-------------SALES TAB---------------################### */

// ?  Defining the interface for the SALES bulletin items from GET API
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

interface QueryModel {
  bulletinTitle?: string;
  bulletinDescription?: string;
  isUrgent?: boolean;
  userType?: string;
  isAllUser?: boolean;
}

interface FetchPhysicianTableRequest {
  pageNumber: number;
  pageSize: number;
  queryModel: QueryModel;
  sortColumn: string;
  sortDirection: string;
}
export default function SalesTab() {
  const { t } = useLang();

  // ? ############ <<<EDITING CASE STARTS>>>################

  const [editedItem, setEditedItem] = useState({});
  const [editedSelectedSales, setEditSelectedSales] = useState<any[]>([]);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  // ? ############ <<<<EDITING CASE ENDS>>>> ################

  // ! ------------------------ CREATE POST STATES STARTS ---------------------------

  // ? state to store SALES LOOKUP DATA
  const [lookup, setLookup] = useState<Sales[]>([]);

  // * ##################----------------CREATE POST SEARCHING STATES STARTS>>>>-----------#################

  // * CREATE POST SALES SALEREP LOOKUP SEARCH FIELD STATE
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

  // * CREATE POST SALES [####----SELECTED---####] SALES LOOKUP SEARCH FIELD STATE
  const [selectedSearchTerm, setSelectedSearchTerm] = useState('');

  // * ################-----------CREATE POST SEARCHING STATES ENDS<<<<------------##############

  // ? STATE STORING SELECTED SALES // CREATE POST SALES
  const [selectedSales, setSelectedSales] = useState<Sales[]>([]); // state to store selected Sales

  // * #############---------------POST API STATES STARTS / CREATE POST--------####################

  // POST REQUEST DATA { THE FORMAT IN WHICH IT IS TO BE SEND}
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    urgent: false,
    selectedSales: [],
  });
  // * ##################----------------POST API STATES ENDS----------------############################

  // ! ------------------------ CREATE POST STATES ENDS ---------------------------

  /* ----------------******** SALES TAB STATES START>>>>>> **********------------------------------  */

  // * LOADING STATE TO MANAGE LOADER / SET FALSE WHEN API LOADS
  const [loading, setLoading] = useState(true);

  //lookup loader
  const [loadingLookup, setLoadingLookup] = useState(true);

  // for errors
  const [error, setError] = useState<string | null>(null);

  // State to track delete operation
  // SHOW LOADER WHEN TRUE || DELETING IN PROGRESS,
  const [deleting, setDeleting] = useState(false);

  // * RESPONSE STORED / TABLE DATA >>>>
  const [salesData, setSalesData] = useState<BulletinItem[]>([]);

  // * STATE FOR TOGGLE
  const [showCreatePost, setShowCreatePost] = useState(false);

  // * ##################----------------TABLE SEARCHING STATES >>>>----------------#################

  // * for TITLE SEARCH BAR
  const [titleSearch, setTitleSearch] = useState('');

  // * for DESCRIPTION SEARCH BAR
  const [descriptionSearch, setDescriptionSearch] = useState('');

  // * ##################----------------TABLE SEARCHING STATES <<<<<----------------#################

  /* ----------------******** PHYSCIAN TAB STATES ENDS<<<<<< **********------------------------------  */

  // ! ------------------------ CREATE POST STATES ENDS ---------------------------

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

    fetchSalesTable(); // Add this line to fetch sorted data
  };

  /*#########################----SORT ENDS------########################## */

  // * ##################----------------GET API LOOKUP STARTS----------------############################

  const getBulletinSalesLookup = async () => {
    setLoadingLookup(true);
    setError(null);
    try {
      const res = await fetchSales();
      setLookup(res.data);
    } catch (error) {
      console.error(t('Error fetching Sales lookup:'), error);
      setError(t('Failed to fetch Sales'));
    } finally {
      setLoadingLookup(false);
    }
  };

  // * ##################----------------GET API LOOKUP ENDS----------------############################

  // * ##################----------------TABLE RESPONSE POST API >>>>----------------#################
  const fetchSalesTable = async (queryModel = {}) => {
    setLoading(true);
    try {
      // * obj TO SEND TO RECEIVE RESPONNSE
      // ? GET ALL API
      const trimmedSearchRequest = Object.fromEntries(
        Object.entries(queryModel).map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ])
      );
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
          userType: 'Sales',
          isAllUser: true,
          ...trimmedSearchRequest,
        },
        sortColumn: sort.clickedIconData || 'Id',
        sortDirection: sort.sortingOrder || 'Desc',
      };

      const res = await SalesTableData(obj);
      setSalesData(res.data.data);

      // ? GETTING TOTAL NUMBER OF RECORDS
      // * FOR PAGINATION
      setTotal(res?.data?.total);
    } catch (error) {
      console.error(t('Error fetching sales table data:'), error);
    } finally {
      // * Set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  // * Use effect hook to fetch data on page size or current page change
  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      await fetchSalesTable();
    };

    // Fetch data when the component mounts or when pageSize or curPage changes
    fetchData();
  }, [pageSize, curPage, triggerSearchData]);

  /* ############################# POST DATA / HANDLE SAVE ################################# */

  const handleSave = async (editedItem?: BulletinItem): Promise<boolean> => {
    if (!editedItem) {
      const { title, description, urgent, selectedSales } = formData;
      if (!title) {
        toast.error(t('Title is required.'));
        return false;
      }

      if (!description) {
        toast.error(t('Description is required.'));
        return false;
      }

      if (selectedSales.length === 0) {
        toast.error(t('At least one Sales Rep must be selected.'));
        return false;
      }

      // Mapping Selected Sales to bulletinBoardDetailLists format
      const bulletinBoardDetailLists = selectedSales.map((saleItem: Sales) => ({
        bulletinBoardId: 0,
        facilityId: 0,
        salesRepId: saleItem.value,
      }));

      // Create object to send
      const obj = {
        id: 0,
        bulletinTitle: title,
        bulletinDescription: description,
        isUrgent: urgent,
        userType: 'Sales',
        isAllUser: true,
        bulletinBoardDetailLists: bulletinBoardDetailLists,
      };

      try {
        await saveSales(obj);
        toast.success(t('Record created successfully!'));
        setShowCreatePost(false);
        return true;
      } catch (err) {
        toast.error(t('Error saving data.'));
        console.error(t('Error saving data:'), err);
        return false;
      } finally {
        fetchSalesTable();
      }
    } else {
      const { bulletinBoardDetails, ...rest } = editedItem;

      const bulletinBoardDetailLists = editedSelectedSales.map(
        (saleItem: Sales) => ({
          bulletinBoardId: 0,
          facilityId: 0,
          salesRepId: saleItem.value,
        })
      );

      // Validate the edited data
      if (
        !rest.bulletinTitle ||
        !rest.bulletinDescription ||
        editedSelectedSales.length === 0
      ) {
        toast.error(t('Please fill in all required fields.'));
        return false; // Return early if validation fails
      }
      try {
        await saveSales({
          bulletinBoardDetailLists: bulletinBoardDetailLists,
          ...rest,
        }); // Ensure editedItem is properly formatted
        toast.success('Record updated successfully!');
        fetchSalesTable();
        return true;
      } catch (err) {
        toast.error('Error updating data.');
        console.error('Error updating data:', err);
        return false;
      }
    }
  };

  /* ############# ONCHANGE FOR SALES LOOKUP  #########################*/

  const handleSalesSelected = (saleItem: Sales) => {
    try {
      // Remove the selected SALES from the lookup array
      const updatedLookup = lookup.filter(
        value => value.value !== saleItem.value
      );
      setLookup(updatedLookup);

      // Add the selected SALES to the selectedSales array
      const updatedSelectedSales = [...selectedSales, saleItem];
      setSelectedSales(updatedSelectedSales);

      const updateEditedSelectedSales = [...editedSelectedSales, saleItem];
      setEditSelectedSales(updateEditedSelectedSales);

      // Update the formData state with the selected SALES
      const updatedFormData = {
        ...formData,
        selectedSales: updatedSelectedSales,
      };
      setFormData(updatedFormData);
    } catch (error) {
      console.error('Error in handleSalesSelected:', error);
    }
  };

  /* ############# ONCHANGE FOR SELECTED SALES  #########################*/

  const handleSalesBack = (saleItem: Sales) => {
    try {
      // Add the deselected SALE back to the lookup array
      const updatedLookup = [...lookup, saleItem];
      setLookup(updatedLookup);

      // Remove the deselected SALES from the selectedSales array
      const updatedSelectedSales = selectedSales.filter(
        item => item.value !== saleItem.value
      );
      const updatedEditedSelectedSales = editedSelectedSales.filter(
        item => item.value !== saleItem.value
      );
      setSelectedSales(updatedSelectedSales);
      setEditSelectedSales(updatedEditedSelectedSales);

      // Update the formData state without the deselected Sales
      const updatedFormData = {
        ...formData,
        selectedSales: updatedSelectedSales,
      };
      setFormData(updatedFormData);
    } catch (error) {
      console.error('Error in handleSalesBack:', error);
    }
  };

  // for all

  const handleSelectAll = () => {
    try {
      if (lookup.length > 0) {
        // Add all lookup sales to selectedSales
        const updatedSelectedSales = [...selectedSales, ...lookup];
        setSelectedSales(updatedSelectedSales);

        // Add all lookup sales to editedSelectedSales
        const updateEditedSelectedSales = [...editedSelectedSales, ...lookup];
        setEditSelectedSales(updateEditedSelectedSales);

        // Clear the lookup array
        setLookup([]);

        // Update the formData state
        const updatedFormData = {
          ...formData,
          selectedSales: updatedSelectedSales,
        };
        setFormData(updatedFormData);
      }
    } catch (error) {
      console.error('Error in handleArrowClick (Select All):', error);
    }
  };

  const handleDeselectAll = () => {
    try {
      if (selectedSales.length > 0) {
        // Add all selectedSales back to lookup
        const updatedLookup = [...lookup, ...selectedSales];
        setLookup(updatedLookup);

        // Clear the selectedSales and editedSelectedSales arrays
        setSelectedSales([]);
        setEditSelectedSales([]);

        // Update the formData state
        const updatedFormData = {
          ...formData,
          selectedSales: [],
        };
        setFormData(updatedFormData);
      }
    } catch (error) {
      console.error('Error in handleLeftArrowClick (Deselect All):', error);
    }
  };

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
      selectedSales: [], // Reset selectedSales to an empty array
    });
    setSelectedSales([]); // Also reset setSelectedSales state directly
  };

  // ! ------------------------ CREATE POST API INTEGRATION ENDS ---------------------------

  // * ##################----------------DELETE API >>>>----------------#################

  // ? for DELETING RECORDS
  const handleDelete = async (id: number) => {
    try {
      setDeleting(true); // * Set deleting to true when delete operation starts
      await deleteRecord(id); // ! Delete the record with the specified ID
      fetchSalesTable(); // After successful deletion, fetch the updated physician table data
      toast.success('Record deleted successfully!');
    } catch (error) {
      toast.error('Error deleting record.');
      console.error('Error deleting record:', error);
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

    fetchSalesTable({
      bulletinTitle: '',
      bulletinDescription: '',
    });
  };

  // * ##################----------------TABLE SEARCH >>>>----------------#################

  //  ? Handle search function
  const handleSearch = () => {
    setCurPage(1);
    setTriggerSearchData(prev => !prev);
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
          lookup={lookup}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSales={selectedSales}
          selectedSearchTerm={selectedSearchTerm} // Ensure this is being passed
          setSelectedSearchTerm={setSelectedSearchTerm} // Ensure this is being passed
          formData={formData}
          getBulletinSalesLookup={getBulletinSalesLookup}
          handleSave={handleSave}
          handleSalesSelected={handleSalesSelected}
          handleSalesBack={handleSalesBack}
          handleInputChange={handleInputChange}
          resetFormData={resetFormData}
          loadingLookup={loadingLookup}
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
                  id={`BulletinBoardSalesRecords`}
                  className="form-select w-125px h-33px rounded py-2"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-allow-clear="true"
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              {/* Add post button starts */}
              <div className="d-flex align-items-center gap-2">
                <PermissionComponent
                  moduleName="Marketing"
                  pageName="Bulletin Board"
                  permissionIdentifier="Add"
                >
                  <Button
                    id={`BulletinBoardSalesAddNew`}
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

            {/* Add post button Ends */}
            <div className="d-flex align-items-center gap-2 ps-2">
              <button
                id={`BulletinBoardSalesSearch`}
                className="btn btn-info btn-sm fw-500"
                aria-controls="Search"
                onClick={handleSearch}
              >
                {t('Search')}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                id={`BulletinBoardSalesReset`}
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
                  sx={{
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
                            id={`BulletinBoardSalesSearchTitle`}
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            value={titleSearch}
                            onChange={e => setTitleSearch(e.target.value)}
                            name="userGroup"
                            placeholder={t('Search ...')}
                            type="text"
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <input
                            id={`BulletinBoardSalesSearchDescription`}
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            name="userGroup"
                            placeholder={t('Search ...')}
                            type="text"
                            value={descriptionSearch}
                            onKeyDown={handleKeyPress}
                            onChange={e => setDescriptionSearch(e.target.value)}
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
                        <TableCell colSpan={5}>
                          <Loader />
                        </TableCell>
                      ) : salesData.length ? (
                        salesData.map((item: BulletinItem) => (
                          <SalesTableRow
                            key={item.id}
                            item={item}
                            onDelete={handleDelete}
                            deleting={deleting}
                            handleSave={handleSave}
                            fetchSalesTable={fetchSalesTable}
                            setEditedItem={setEditedItem}
                            editedItem={editedItem}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            loading={loading}
                            selectedSearchTerm={selectedSearchTerm} // Ensure this is being passed
                            setSelectedSearchTerm={setSelectedSearchTerm}
                            handleSalesSelected={handleSalesSelected}
                            handleSalesBack={handleSalesBack}
                            resetFormData={resetFormData}
                            setEditSelectedSales={setEditSelectedSales}
                            getBulletinSalesLookup={getBulletinSalesLookup}
                            loadingLookup={loadingLookup}
                            setLoadingLookup={setLoadingLookup}
                            error={error}
                            setError={setError}
                            editedSelectedSales={editedSelectedSales}
                            lookup={lookup}
                          />
                        ))
                      ) : (
                        <NoRecord colSpan={5} />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </div>

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
