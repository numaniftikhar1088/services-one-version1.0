export interface Header {
  name: string;
  variable: string;
}

export interface PanelTypes {
  id: number;
  name: string;
  description: string;
}

export interface TestLists {
  specimenTypeID: number;
  specimenTypeName: string;
  testConfigID: number;
  testID: number;
  testName: string;
  isGroupTest: boolean;
}

export interface RowInterface {
  id: number;
  panelName: string;
  groupId: number | null;
  groupName: string | null;
  tmitCode: string | null;
  sortOrder: number | null;
}

export interface GroupDetails {
  value: number;
  label: string;
}

export interface ReferenceLab {
  label: string;
  value: number;
}

export type EventType = {
  label: string;
  value: string | number;
};

export interface InitialSearchQuery {
  panelName: string;
  groupId: number;
  groupName: string;
  sortOrder: number;
}

export const TBL_HEADERS: Header[] = [
  {
    name: "Actions",
    variable: "",
  },
  {
    name: "Category Name",
    variable: "panelName",
  },
  {
    name: "Group",
    variable: "groupName",
  },
];
