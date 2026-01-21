import React from "react";
import { useSelector } from "react-redux";
import store from "Redux/Store/AppStore";

export interface PermissionObject {
  action: string;
  subject: string;
  moduleName: string;
}

interface PermissionComponentProps {
  pageName: string;
  permissionIdentifier: string;
  moduleName: string;
  children:
    | React.ReactNode
    | ((props: {
        pageName: string;
        moduleName: string;
        permissionIdentifier: string;
      }) => React.ReactNode);
}

const PermissionComponent: React.FC<PermissionComponentProps> = ({
  pageName,
  moduleName,
  permissionIdentifier,
  children,
}) => {
  const permissions = useSelector(
    (state: any) =>
      state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.permissions ||
      []
  );

  const hasPermission = permissions.some(
    (permission: PermissionObject) =>
      permission.subject.replace(/\n/g, "").toLowerCase() ===
        pageName.replace(/\n/g, "").toLowerCase() &&
      permission.moduleName.replace(/\n/g, "").toLowerCase() ===
        moduleName.replace(/\n/g, "").toLowerCase() &&
      permission.action.replace(/\n/g, "").toLowerCase() ===
        permissionIdentifier.replace(/\n/g, "").toLowerCase()
  );

  if (!hasPermission) return null;

  if (typeof children === "function") {
    return <>{children({ pageName, moduleName, permissionIdentifier })}</>;
  }

  return <>{children}</>;
};

export default PermissionComponent;

export const AnyPermission: React.FC<{
  moduleName: string;
  pageName: string;
  permissionIdentifiers: string[];
  children: React.ReactNode;
}> = ({ moduleName, pageName, permissionIdentifiers, children }) => {
  const permissions =
    useSelector(
      (state: any) =>
        state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.permissions
    ) || [];

  const hasAnyPermission = permissionIdentifiers.some((identifier) =>
    permissions.some(
      (permission: any) =>
        permission.subject.replace(/\n/g, "").toLowerCase() ===
          pageName.replace(/\n/g, "").toLowerCase() &&
        permission.moduleName.replace(/\n/g, "").toLowerCase() ===
          moduleName.replace(/\n/g, "").toLowerCase() &&
        permission.action.replace(/\n/g, "").toLowerCase() ===
          identifier.replace(/\n/g, "").toLowerCase()
    )
  );

  if (!hasAnyPermission) return null;

  return <>{children}</>;
};

const getPermissionDisplayName = (
  pageName: string,
  moduleName: string,
  permissionIdentifier: string,
  staticLabel: string
) => {
  const permissions =
    (store.getState() as any)?.Reducer?.selectedTenantInfo
      ?.infomationOfLoggedUser?.permissions || [];

  const label = permissions.find(
    (item: any) =>
      item.subject.replace(/\n/g, "").toLowerCase() ===
        pageName.replace(/\n/g, "").toLowerCase() &&
      item.moduleName.replace(/\n/g, "").toLowerCase() ===
        moduleName.replace(/\n/g, "").toLowerCase() &&
      item.action.replace(/\n/g, "").toLowerCase() ===
        permissionIdentifier.replace(/\n/g, "").toLowerCase()
  )?.permissionName;

  return label || staticLabel || "N/A";
};

export { getPermissionDisplayName };
