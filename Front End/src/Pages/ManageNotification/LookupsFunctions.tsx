import { useState } from "react";
import MiscellaneousService from "../../Services/MiscellaneousManagement/MiscellaneousService";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";

function LookupsFunctions() {
  const [userLookup, setUserLookup] = useState([]);
  const [roleTypeLookUp, setRoleTypeLookUp] = useState([]);
  const [notificationTypeLookup, setNotificationTypeLookup] = useState([]);

  const getUserLookup = async (userType: number) => {
    const response = await MiscellaneousService.getAllUserLookupV2(userType);
    setUserLookup(response?.data?.result);
  };

  const userRoleTypeLookUp = async (notificationTypeId: number) => {
    const response =
      await MiscellaneousService.getUserRoleTypeLookup(notificationTypeId);
    setRoleTypeLookUp(response?.data);
  };

  const getNotificationTypes = async () => {
    const response = await MiscellaneousService.getNotificationTypeLookup();
    setNotificationTypeLookup(response?.data?.result);
  };

  const userTypeLookUp = [
    {
      label: "Admin",
      value: PortalTypeEnum.Admin,
    },
    {
      label: "Facility",
      value: PortalTypeEnum.Facility,
    },
    {
      label: "Sales",
      value: PortalTypeEnum.Sales,
    },
  ];

  const facilityTypeLookUp = [
    {
      label: "Facility",
      value: PortalTypeEnum.Facility,
    },
  ];

  const salesTypeLookUp = [
    {
      label: "Sales",
      value: PortalTypeEnum.Sales,
    },
  ];

  return {
    userLookup,
    setUserLookup,
    getUserLookup,
    roleTypeLookUp,
    userTypeLookUp,
    salesTypeLookUp,
    facilityTypeLookUp,
    userRoleTypeLookUp,
    getNotificationTypes,
    notificationTypeLookup,
  };
}

export default LookupsFunctions;
