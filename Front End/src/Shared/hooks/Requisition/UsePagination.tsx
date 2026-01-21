import { useCallback, useState } from "react";
import { useDataContext } from "../../DataContext";

const UsePagination = (pageNumber: number) => {
  const { filterData, setFilterData, loadDataAllRequisition } =
    useDataContext();
  const [page, setPage] = useState(filterData?.pageNumber);

  const handleChangePagination = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      filterData.pageNumber = value;
      loadDataAllRequisition();
    },
    [page]
  );

  return {
    page,
    setPage,
    handleChangePagination,
  };
};

export default UsePagination;
