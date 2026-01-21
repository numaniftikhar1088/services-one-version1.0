import React from 'react'

const ManageSalesRepPagination = () => {
  return (
    <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
      <p className="pagination-total-record">
        <span>
          Showing 1 to 2 of Total <span> 2 </span> entries{" "}
        </span>
      </p>
      <ul className="d-flex align-items-center justify-content-end custome-pagination">
        <li className="btn btn-lg p-2">
          <i className="fa fa-angle-double-left" />
        </li>
        <li className="btn btn-lg p-2">
          <i className="fa fa-angle-left" />
        </li>
        <li
          className="px-2 font-weight-bold bg-primary text-white"
          style={{ cursor: "pointer" }}
        >
          1
        </li>
        <li className="px-2 " style={{ cursor: "pointer" }}>
          2
        </li>
        <li className="px-2 " style={{ cursor: "pointer" }}>
          3
        </li>
        <li className="btn btn-lg p-2">
          <i className="fa fa-angle-right" />
        </li>
        <li className="btn btn-lg p-2">
          <i className="fa fa-angle-double-right" />
        </li>
      </ul>
    </div>
  );
}

export default ManageSalesRepPagination