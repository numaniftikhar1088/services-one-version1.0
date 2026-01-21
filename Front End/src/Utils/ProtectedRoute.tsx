import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ProtectedRoute = (props: any) => {
  //const navigate = useNavigate();
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const checkUserToken = () => {
  //   const userInfo:any = localStorage.getItem("userinfo") || "";
  //   

  //   if (userInfo === null) {
  //     return navigate("/login");
  //   }
  //   if (userInfo !== null) {
  //     setIsLoggedIn(true);
  //     if (
  //       userInfo.token === "" ||
  //       userInfo.token === null ||
  //       userInfo.token === "undefined"
  //     ) {
  //       setIsLoggedIn(false);
  //       return navigate("/login");
  //     }
  //   } else {
  //     setIsLoggedIn(true);
  //   }
  // };
  // useEffect(() => {
  //   checkUserToken();
  // }, [isLoggedIn]);
  return <div>{props.children}</div>;
};
export default ProtectedRoute;
