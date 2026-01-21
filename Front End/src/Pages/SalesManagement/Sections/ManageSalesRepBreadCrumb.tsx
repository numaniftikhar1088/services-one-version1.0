import React from 'react'

const ManageSalesRepBreadCrumb = () => {
  return (
    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3 mb-5">
      <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
        <li className="breadcrumb-item text-muted">Home</li>
        <li className="breadcrumb-item">
          <span className="bullet bg-gray-400 w-5px h-2px" />
        </li>
        <li className="breadcrumb-item text-muted">Sales Management</li>
        <li className="breadcrumb-item">
          <span className="bullet bg-gray-400 w-5px h-2px" />
        </li>
        <li className="breadcrumb-item text-muted">Manage Sales Rep</li>
      </ul>
    </div>
  );
}

export default ManageSalesRepBreadCrumb;
export{}