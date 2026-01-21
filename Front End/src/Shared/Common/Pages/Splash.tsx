import { Component } from "react";

class Splash extends Component {
  render() {
    return (
      // <div
      // className="d-flex flex-column flex-root justify-content-center align-items-center"
      // style={{ minHeight: "100vh" }}
      // >
      //   <img
      //     alt="Logo"
      //     src={process.env.PUBLIC_URL + "/media/logos/logo.png"}
      //     className="h-65px"
      //   />
      //   <div className="loading">
      //     <h3>Truemedit</h3>
      //     <span className="loading__dot"></span>
      //     <span className="loading__dot"></span>
      //     <span className="loading__dot"></span>
      //   </div>
      // </div>
      <div className="d-flex flex-column flex-root justify-content-center align-items-center">
        <span className="loader"></span>
      </div>
    );
  }
}

export default Splash;
