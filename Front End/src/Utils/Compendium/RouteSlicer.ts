export const RouteSlice = (route: string, NavigatorsArray: any) => {
  const slicedRoute = route?.split("/")[2];
  let newArray = [];
  newArray = NavigatorsArray.slice(0, 4);
  const newRouteObj = {
    text: slicedRoute,
    link: "#",
  };
  newArray.push(newRouteObj);
  let finalArray = newArray.slice(0, 4)
  return finalArray;
};
