import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
export const getHeaderRows = (array, onClickHeaderColumn, onFocusHeader) => {
  return (
    <thead>
      <tr>
        {array?.map((item, index) => (
          <th
            className="fw-light"
            onClick={() => onClickHeaderColumn(index)}
            scope="col"
          >
            {item}
            <div className="rotatebtnn">
              <DropdownButton
                className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                key="end"
                id="dropdown-button-drop-end"
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
              >
                <Dropdown.Divider />
                <Dropdown.Item eventKey="3">
                  <div className="menu-item px-3">
                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                    opt 1
                  </div>
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};
