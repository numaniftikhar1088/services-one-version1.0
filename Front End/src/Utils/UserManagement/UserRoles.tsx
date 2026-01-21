export const checkUncheckAllRolesAndPermissions = (
  userPermissions: any,
  checked: boolean
) => {
  let permissionsArrCopy = [...userPermissions];
  permissionsArrCopy.forEach((element: any, index) => {
    element.isSelected = checked;
    element.pages.forEach((pages: any, pagesIndex: any) => {
      pages.isSelected = checked;
      pages.permissions.forEach((permissions: any) => {
        permissions.isSelected = checked;
      });
    });
  });
  return permissionsArrCopy;
};


export const logoutUtil = () => {
  localStorage.clear();
  sessionStorage.clear();

  localStorage.setItem("logout", Date.now().toString());

  window.location.href = "/login";
};
