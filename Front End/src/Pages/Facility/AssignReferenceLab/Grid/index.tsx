import { Box, Table, TableContainer } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import useLang from "Shared/hooks/useLanguage";
import CustomPagination from './../../../../Shared/JsxPagination/index';
import { GridData } from './GridData';

export const AssignReferenceLabGrid: React.FC<{}> = () => {
  const { t } = useLang()
  //  ************************* Loader *********************
  const [loading, setLoading] = useState(false)
  //  ************************* Row *********************
  // const [rows, setRows] = useState<ITableObj[]>(() => [])

  //  ************************* Pagination start *********************

  const [curPage, setCurPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
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
    // loadGridData(true, false)
  }, [curPage])
  //  ************************* Pagination End *********************
  return (
    <>
      {/* ================ Add new Record Button ============= */}
      <div className="my-6 mt-0">
        <Button
          variant="contained"
          color="success"
          className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
        >
          {t("Add New")}
        </Button>
      </div>
      {/* ================ records And Search Buttons ============= */}
      <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
        <div className="d-flex align-items-center mb-2">
          <span className="fw-400 mr-3">{t("Records")}</span>
          <select
            className="form-select w-125px h-33px rounded"
            data-kt-select2="true"
            data-placeholder="Select option"
            data-dropdown-parent="#kt_menu_63b2e70320b73"
            data-allow-clear="true"
          >
            <option value="5" selected>
              5
            </option>
            <option value="10">10</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2">
          <button
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
          >
            {t("Search")}
          </button>
          <button
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

      <Box sx={{ height: 'auto', width: '100%' }}>

        {/* ================ Table ============= */}
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
            // component={Paper}
            className="shadow-none"

          >
            <Table
              // stickyHeader
              aria-label="sticky table collapsible"
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
            >
              <GridData />
            </Table>
          </TableContainer>
        </div>

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
      </Box>
    </>
  );
}
