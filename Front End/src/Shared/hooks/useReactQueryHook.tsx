import { useQuery } from "react-query";
import UserManagementService from "../../Services/UserManagement/UserManagementService";

const useReactQueryHook = (id: string) => {
  //
  const { isLoading, data, refetch } = useQuery(
    "inputsReq",
    UserManagementService.GetSystemFields
  );

  // const { isLoading, data, refetch } = useQuery(
  //   "loadRequsitionFormInputs",
  //   apiCall,
  //   {
  //     enabled: false,
  //   }
  // );


  return {
    data,
  };
};

export default useReactQueryHook;
