import { useCallback, useState } from "react";
import { useToxResultDataContext } from "../../ToxResultDataContext";

const UseToxResultDataPagination = (pageNumber: number) => {
  const { filterData, setFilterData, loadAllResultData } =
    useToxResultDataContext();
  const [page, setPage] = useState(filterData?.pageNumber);

  const handleChangePagination = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      filterData.pageNumber = value;
      loadAllResultData();
    },
    [page]
  );

  return {
    page,
    setPage,
    handleChangePagination,
  };
};

export default UseToxResultDataPagination;
