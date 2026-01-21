import Pagination from "@mui/material/Pagination";
import React, { useCallback, useEffect, useState } from "react";
import { getTotalPagesCount } from "../../../../Utils/Common/Requisition";
import { useReqDataContext } from "./RequisitionContext/useReqContext";
import useLang from "Shared/hooks/useLanguage";

const ReqGridPagination = () => {
  const { t } = useLang();
  const { filterData, loadGridData, total, tabIdToSend } = useReqDataContext();
  const [page, setPage] = useState(filterData?.pageNumber);

  const handleChangePagination = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);

    filterData.pageNumber = value;

    setTimeout(() => {
      loadGridData();
    }, 0);
  };

  useEffect(() => {
    setPage(filterData?.pageNumber);
  }, [tabIdToSend]);

  return (
    <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
      <p className="pagination-total-record mb-0">
        <span>
          {t("Showing Page")} {filterData?.pageNumber} {t("to")}{" "}
          {filterData?.pageSize > total ? total : filterData.pageSize} {t("of Total")}{" "}
          <span> {total} </span> {t("entries")}{" "}
        </span>
      </p>
      <Pagination
        count={getTotalPagesCount(filterData?.pageSize, total)}
        page={page}
        onChange={handleChangePagination}
      />
    </div>
  );
};

export default React.memo(ReqGridPagination);
