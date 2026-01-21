import useLang from "../hooks/useLanguage";

interface PaginationI {
  pageSize: number;
  curPage: number;
  total: number;
  totalPages: number;
  showPage: (page: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  pageNumbers: number[];
}

function CustomPagination(props: PaginationI) {
  const { t } = useLang()
  const {
    total,
    curPage,
    pageSize,
    showPage,
    prevPage,
    nextPage,
    totalPages,
    pageNumbers,
  } = props;

  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
      <p className="pagination-total-record m-0">
        <span>
          {`${t("Showing")} ${pageSize * (curPage - 1) + 1} ${t("to")} ${Math.min(
            pageSize * curPage,
            total
          )} ${t("of Total")} ${total} ${t("entries")}`}
        </span>
      </p>
      <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
        <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
          <i className="fa fa-angle-double-left"></i>
        </li>
        <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
          <i className="fa fa-angle-left"></i>
        </li>

        {pageNumbers.map((page) => (
          <li
            key={page}
            className={`px-2 ${page === curPage ? "font-weight-bold bg-primary text-white h-33px" : ""
              }`}
            style={{ cursor: "pointer" }}
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
  );
}

export default CustomPagination;
