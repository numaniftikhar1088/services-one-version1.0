import Pagination from "@mui/material/Pagination";
import React from "react";
import { useToxResultDataContext } from "../../../Shared/ToxResultDataContext";
import UseToxResultDataPagination from "../../../Shared/hooks/Requisition/useToxResultDataPagination";
import { getTotalPagesCount } from "../../../Utils/Common/Requisition";
import useLang from "Shared/hooks/useLanguage";

const ReqGridPagination = () => {
  const { data, filterData } = useToxResultDataContext();
  const { page, handleChangePagination } = UseToxResultDataPagination(
    filterData?.pageNumber
  );
  const { t } = useLang();
  return (
    <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
      <p className="pagination-total-record mb-0">
        <span>
          {t("Showing Page")} {filterData?.pageNumber} {t("to")}{" "}
          {filterData?.pageSize > data?.total
            ? data?.total
            : filterData?.pageSize}{" "}
          {t("of Total")} <span> {data?.total} </span> {t("entries")}{" "}
        </span>
      </p>
      <Pagination
        count={getTotalPagesCount(filterData?.pageSize, data?.total)}
        page={page}
        onChange={handleChangePagination}
      />
    </div>
  );
};

export default React.memo(ReqGridPagination);
