import React from "react";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
export const Nav: React.FC<{}> = () => {
    
    return (
        <div className="app-toolbar py-5 py-lg-6">
            <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
                <BreadCrumbs />
            </div>
        </div>
    );
};
