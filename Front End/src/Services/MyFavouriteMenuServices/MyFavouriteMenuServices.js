import HttpClient from "../../HttpClient.ts";
import apiRoutes from "../../Routes/Routes.json";

const getUserFavouriteMenu = () => {
  return HttpClient().get(`/${apiRoutes.MyFavouriteMenu.getUserFavouriteMenu}`);
};
const saveMyFavouriteMenu = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.MyFavouriteMenu.saveMyFavouriteMenu}`,
    queryModel
  );
};
const RemoveFavouriteMenus = (queryModel) => {
  return HttpClient().post(
    `/${apiRoutes.MyFavouriteMenu.RemoveFavouriteMenus}`,
    queryModel
  );
};
const MyFavouriteMenuServices = {
  saveMyFavouriteMenu,
  RemoveFavouriteMenus,
  getUserFavouriteMenu,
};

export default MyFavouriteMenuServices;
