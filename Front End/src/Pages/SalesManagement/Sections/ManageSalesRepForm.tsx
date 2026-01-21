    import React from 'react'

    const ManageSalesRepForm = () => {
    return (
        <div className="row">
        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <label className="required mb-2 fw-500">DIST Code</label>
            <input
            autoComplete="off"
            className="form-control bg-transparent"
            defaultValue=""
            name="zipCode"
            placeholder="DIST Code"
            required
            type="text"
            />
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <label className="required mb-2 fw-500">Sales Rep No</label>
            <input
            autoComplete="off"
            className="form-control bg-transparent"
            defaultValue=""
            name="Sales Rep No"
            placeholder="Sales Rep No"
            required
            type="text"
            />
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <label className="required mb-2 fw-500">Position Title</label>
            <input
            autoComplete="off"
            className="form-control bg-transparent"
            defaultValue=""
            name="Position Title"
            placeholder="Position Title"
            required
            type="text"
            />
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <label className="required mb-2 fw-500">First Name</label>
            <input
            autoComplete="off"
            className="form-control bg-transparent"
            defaultValue=""
            name="firstName"
            placeholder="First Name"
            required
            type="text"
            />
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <label className="required mb-2 fw-500">Last Name</label>
            <input
            autoComplete="off"
            className="form-control bg-transparent"
            defaultValue=""
            name="lastName"
            placeholder="Last Name"
            required
            type="text"
            />
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <label className="required mb-2 fw-500">Phone</label>
            <input
            autoComplete="off"
            className="form-control bg-transparent"
            defaultValue=""
            name="Phone"
            placeholder="(999) 999-9999"
            required
            type="tel"
            />
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <label className="mb-2 fw-500">Email</label>
            <input
            autoComplete="off"
            className="form-control bg-transparent"
            defaultValue=""
            name="Email"
            placeholder="Email"
            type="email"
            />
        </div>
        <div className="col-lg-4 col-md-12 col-sm-12 Control88  mb-4">
            <div className="form__group form__group--checkbox">
            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                <input
                className="form-check-input"
                defaultValue=""
                name="Sales Manager"
                type="checkbox"
                />
                <span className="mb-2 mr-2 text-break fw-400">Sales Manager</span>
            </label>
            </div>
        </div>
        <div className="col-lg-4 col-md-12 col-sm-12 Control88  mb-4">
            <div className="form__group form__group--checkbox">
            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                <input
                className="form-check-input"
                defaultValue=""
                name="Show Financial Data"
                type="checkbox"
                />
                <span className="mb-2 mr-2 text-break fw-400">
                Show Financial Data
                </span>
            </label>
            </div>
        </div>
        </div>
    );
    }

    export default ManageSalesRepForm