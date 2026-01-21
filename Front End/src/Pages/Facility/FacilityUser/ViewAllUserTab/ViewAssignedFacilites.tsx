import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";

interface Props {
  id: any;
  UserList?: any;
}

const ViewAssignedFacilites: React.FC<Props> = ({ id, UserList }) => {
  console.log(UserList, "UserList");
  const { t } = useLang();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const params = useParams();

  // const [UserList, setUserList] = useState<any>([]);

  // const loadData = () => {
  //
  //   FacilityService.ViewAssignedFacilities(id).then((result: AxiosResponse) => {
  //
  //     setUserList(result?.data?.data);
  //
  //   });
  // };

  // React.useEffect(() => {
  //   loadData();
  // }, []);
  return (
    <div className="card shadow-sm rounded border border-warning mt-3">
      <div className="card-header d-flex justify-content-between align-items-center bg-light-secondary min-h-35px">
        <h6>{t("Assigned Facilities")}</h6>
      </div>
      <div className="card-body py-md-4 py-3">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
          <span className="text-primary fw-bold">{t("Facility Name")}</span>
          <div className="row mt-3">
            {UserList?.map((user: any) => (
              <div
                id={`FacilityUserExpand_${user.facilityId}`}
                className="col-xl-3 col-lg-3 col-md-3 col-sm-6 "
              >
                {user.facilityName + " - " + user.address}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(ViewAssignedFacilites);
