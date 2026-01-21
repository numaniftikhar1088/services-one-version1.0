import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import AssigmentService from '../../../Services/AssigmentService/AssigmentService'
import PanelMappingService from '../../../Services/InfectiousDisease/PanelMappingService'
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService'
import { Loader } from '../../../Shared/Common/Loader'
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent'
import { ArrowDown, ArrowUp } from '../../../Shared/Icons'
import Row, { ITableObj } from './Row'
import useLang from "Shared/hooks/useLanguage";
import CustomPagination from '../../../Shared/JsxPagination'
const blue = {
  200: '#A5D8FF',
  400: '#3399FF',
}
const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
}
interface IReferenceLab {
  referenceLabId: number
  referenceLabName: string
}

export interface IRows {
  id: number
  testName: string
  testDisplayName: string
  testCode: string
  referenceLabId: number
  referenceLabName: string
  createDate: string
  rowStatus: boolean | undefined
}
export default function CollapsibleTable() {
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const { t } = useLang()
  const [curPage, setCurPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageNumbers, setPageNumbers] = useState<number[]>([])
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1)
    }
  }
  const showPage = (i: number) => {
    setCurPage(i)
  }
  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1)
    }
  }
  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize))
    const pgNumbers = []
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i)
      }
    }
    setPageNumbers(pgNumbers)
  }, [total, curPage, pageSize, totalPages])

  useEffect(() => {
    loadGridData(true, false)
  }, [curPage])
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [request, setRequest] = useState(false)
  const [check, setCheck] = useState(false)
  const [dropDownValues, setDropDownValues] = useState({
    LabList: [],
    PanelList: [],
  })
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<any[]>(() => [])

  const [errors, setErrors] = useState(false)
  useEffect(() => {
    setCurPage(1)
    PerformingLabLookup()
    GetPanelLookup()
    loadGridData(true, true)
  }, [pageSize])

  const handleChange = (name: string, value: any, id: number) => {
    setRows((curr) =>
      curr.map((x) =>
        x.id === id
          ? {
            ...x,
            [name]: value,
          }
          : x,
      ),
    )
  }

  const handleIsActive = (event: any, id: any) => {
    setRows((curr) =>
      curr.map((x) =>
        x.id === id
          ? {
            ...x,
            isActive: event.target.checked,
          }
          : x,
      ),
    )
  }
  ////////////-----------------Section For Searching-------------------///////////////////

  let [searchRequest, setSearchRequest] = useState({
    qccontrolName: '',
    panelId: 0,
    panelName: '',
    labId: 0,
    labName: '',
  })
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value })
  }
  function resetSearch() {
    searchRequest = {
      qccontrolName: '',
      panelId: 0,
      panelName: '',
      labId: 0,
      labName: '',
    }
    setSearchRequest({
      qccontrolName: '',
      panelId: 0,
      panelName: '',
      labId: 0,
      labName: '',
    })
    loadGridData(true, true)
  }

  ////////////-----------------Section For Searching-------------------///////////////////

  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  const PerformingLabLookup = () => {
    PanelMappingService.PerformingLabLookup()
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            LabList: res?.data,
          }
        })
      })
      .catch((err: any) => {
        console.trace(err)
      })
  }
  const GetPanelLookup = () => {
    AssigmentService.PanelLookUp()
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            PanelList: res?.data,
          }
        })
      })
      .catch((err: any) => {
        console.trace(err)
      })
  }
  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (loader: boolean, reset: boolean) => {
    if (loader) {
      setLoading(true)
    }
    setIsAddButtonDisabled(false)

    const nullObj = {
      qccontrolName: '',
      panelName: '',
      labName: '',
    }

    RequisitionType.getQCBatchSetup({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : searchRequest,
      sortColumn: filterData?.sortColumn,
      sortDirection: filterData?.sortDirection,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.total)

        setRows(res?.data?.data)
        setLoading(false)
      })
      .catch((err: any) => {
        console.trace(err, 'err')
        setLoading(false)
      })
  }
  ////////////-----------------Get All Data-------------------//////////////////

  ////////////-----------------Sorting-------------------///////////////////
  const [filterData, setFilterData] = useState<any>({
    sortColumn: 'id',
    sortDirection: 'desc',
  })
  const [sort, setSorting] = useState<any>({
    sortingOrder: '',
    clickedIconData: '',
  })
  const searchRef = useRef<any>(null)

  const handleSort = async (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === 'asc'
        ? (searchRef.current.id = 'desc')
        : (searchRef.current.id = 'asc')
      : (searchRef.current.id = 'asc')
    filterData.sortColumn = columnName
    filterData.sortDirection = searchRef.current.id
    setSorting((preVal: any) => {
      return {
        ...preVal,
        sortingOrder: searchRef?.current?.id,
        clickedIconData: columnName,
      }
    })
    await loadGridData(true, false)
  }

  ////////////-----------------Sorting-------------------///////////////////

  ////////////-----------------Save a Row-------------------///////////////////
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const handleSubmit = (row: ITableObj) => {
    setIsButtonDisabled(true)
    setRequest(true) // Set request in progress
    if (
      row?.qccontrolName !== '' &&
      row?.qccontrolName !== null &&
      row?.panelId !== 0 &&
      row?.labId !== 0
    ) {
      const panel: any = dropDownValues?.PanelList.filter(function (
        option: any,
      ) {
        return option.value === row?.panelId
      })

      const obj = {
        id: row.id,
        qccontrolName: row.qccontrolName,
        PanelId: row.panelId,
        panelName: panel[0].label,
        labId: row.labId,
        isActive: row.isActive,
      }

      RequisitionType.saveQCBatchSetup(obj)
        .then((res: AxiosResponse) => {
          if (res?.data.statusCode === 200) {
            toast.success(res?.data?.message)
            setIsButtonDisabled(false) // Re-enable the button
            loadGridData(true, false)
          } else if (res?.data.statusCode === 409) {
            setIsButtonDisabled(false)
            toast.info(res?.data?.message)
          }
        })
        .catch((err: any) => {
          console.trace(err)
        })
        .finally(() => {
          setRequest(false) // Request is no longer in progress
        })
    } else {
      toast.error(t('Please Enter The Required Fields'))
      setIsButtonDisabled(false) // Re-enable the button
      setRequest(false) // Request is no longer in progress
    }
  }
  // *********** All Dropdown Function Show Hide ***********
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  })
  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4)

  const handleClose1 = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null })
  }
  // *********** All Dropdown Function END ***********
  ////////////-----------------Delete a Row-------------------///////////////////

  const ChangeStatus = (id: number) => {
    RequisitionType?.ChangeStatusQCBatchSetup(id)
      .then((res: any) => {
        if (res?.data?.statusCode == 200) {
          loadGridData(true, false)
          toast.success(t('Request Successfully Processed'))
          ModalhandleClose1()
          handleClose1('dropdown3')
        }
      })
      .catch((err: AxiosError) => { })
  }
  ////////////-----------------Delete a Row-------------------///////////////////
  const [valueId, setValueId] = useState<any>(null)

  const handleClickOpen = (id: any) => {
    setShow1(true)
    setValueId(id)
  }
  const ModalhandleClose1 = () => setShow1(false)
  const [show1, setShow1] = useState(false)
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false)
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      loadGridData(true, false)
    }
  }
  return (
    <>
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body px-3 px-md-8">
              <div className="my-6 mt-0 d-flex justify-content-center justify-content-sm-start">
                {/* <PermissionComponent
                  pageName="QC Batch Setup"
                  permissionIdentifier="AddQCBatchSetup"
                > */}
                  <button
                    onClick={() => {
                      if (!isAddButtonDisabled) {
                        setRows((prevRows: any) => [
                          {
                            id: 0,
                            qccontrolName: "",
                            panelId: 0,
                            panelName: "",
                            labId: 0,
                            labName: "",
                            rowStatus: true,
                            isActive: true,
                          },
                          ...prevRows,
                        ]);
                        setIsAddButtonDisabled(true);
                      }
                    }}
                    className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
                  >
                    {t("Add QC Batch Setup")}
                  </button>
                {/* </PermissionComponent> */}
              </div>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    className="form-select w-125px h-33px rounded"
                    data-kt-select2="true"
                    data-placeholder="Select option"
                    data-dropdown-parent="#kt_menu_63b2e70320b73"
                    data-allow-clear="true"
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value))
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
                <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2">
                  <button
                    onClick={() => loadGridData(true, false)}
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
                <Box sx={{ height: 'auto', width: '100%' }}>
                  <div className="table_bordered overflow-hidden">
                    <TableContainer
                      sx={{
                        maxHeight: 800,
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
                      // component={Paper}
                      className="shadow-none"
                    // sx={{ maxHeight: 'calc(100vh - 100px)' }}
                    >
                      <Table
                        // stickyHeader
                        aria-label="sticky table collapsible"
                        className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                      >
                        <TableHead>
                          <TableRow className="h-50px">
                            <TableCell></TableCell>

                            <TableCell>
                              <input
                                type="text"
                                name="qccontrolName"
                                className="form-control bg-white mb-3 mb-lg-0"
                                placeholder={t("Search ...")}
                                value={searchRequest.qccontrolName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                name="panelName"
                                className="form-control bg-white mb-3 mb-lg-0"
                                placeholder={t("Search ...")}
                                value={searchRequest.panelName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                name="labName"
                                className="form-control bg-white mb-3 mb-lg-0"
                                placeholder={t("Search ...")}
                                value={searchRequest.labName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              {/* <input
                                type="text"
                                name="labelSize"
                                className="form-control bg-white mb-3 mb-lg-0"
                                placeholder={t("Search ...")}
                                value={searchRequest.labName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              /> */}
                            </TableCell>
                          </TableRow>

                          <TableRow className="h-35px">
                            <TableCell className="min-w-50px">
                              {t("Actions")}
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('qccontrolName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t("QC Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${sort.sortingOrder === 'desc' &&
                                        sort.clickedIconData === 'qccontrolName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                      }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${sort.sortingOrder === 'asc' &&
                                        sort.clickedIconData === 'qccontrolName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                      }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('panelName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t("Panel Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${sort.sortingOrder === 'desc' &&
                                        sort.clickedIconData === 'panelName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                      }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${sort.sortingOrder === 'asc' &&
                                        sort.clickedIconData === 'panelName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                      }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('labName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t("Lab Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${sort.sortingOrder === 'desc' &&
                                        sort.clickedIconData === 'labName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                      }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${sort.sortingOrder === 'asc' &&
                                        sort.clickedIconData === 'labName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                      }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>

                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t("Inactive/Active")}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableCell colSpan={9} className="padding-0">
                              <Loader />
                            </TableCell>
                          ) : (
                            rows?.map((item: any, index) => {
                              return (
                                <Row
                                  row={item}
                                  index={index}
                                  rows={rows}
                                  setRows={setRows}
                                  dropDownValues={dropDownValues}
                                  handleChange={handleChange}
                                  handleSubmit={handleSubmit}
                                  loadGridData={loadGridData}
                                  setErrors={setErrors}
                                  errors={errors}
                                  request={request}
                                  setRequest={setRequest}
                                  check={check}
                                  setCheck={setCheck}
                                  setShow1={setShow1}
                                  handleClickOpen={handleClickOpen}
                                  setIsAddButtonDisabled={
                                    setIsAddButtonDisabled
                                  }
                                  isButtonDisabled={isButtonDisabled}
                                  handleIsActive={handleIsActive}
                                  ChangeStatus={ChangeStatus}
                                />
                              )
                            })
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Box>
              </div>

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
            </div>
          </div>
        </div>
      </div>
      {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
    </>
  )
}
