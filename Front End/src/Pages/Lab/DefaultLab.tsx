import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { authTenants } from "../../Interface/Lab";
const DefaultLab = (props: any) => {
  const [authTenants, setAuthTenants] = useState([]);
  useEffect(() => {
    let localUserInfo = JSON.parse(localStorage.getItem("userinfo") || "");
    let userInfo =
      Object.keys(props.User.userInfo).length === 0
        ? localUserInfo.authTenants
        : props.User.userInfo.authTenants;
    setAuthTenants(userInfo);
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        {authTenants.map((u: authTenants) => (
          <div key={u.key} className="col-md-3 mt-3">
            <div className="card">
              <div className="card-body px-3 px-md-8">
                <h5 className="card-title">{u.key}</h5>
                <a href={u.url} className="card-text">
                  {u.name}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(DefaultLab);
