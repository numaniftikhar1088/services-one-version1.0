export type SortingTypeI = {
  sortingOrder: string;
  clickedIconData: string;
};

export const sortingObject: SortingTypeI = {
  sortingOrder: "",
  clickedIconData: "",
};

export const sortById = {
  clickedIconData: "id",
  sortingOrder: "desc",
};

export const sortByCreationDate = {
  clickedIconData: "createdDate",
  sortingOrder: "desc",
};

export const sortByRequisitionId = {
  clickedIconData: "requisitionId",
  sortingOrder: "desc",
};

export const sortByIPId = {
  clickedIconData: "InsuranceProviderId",
  sortingOrder: "desc",
};