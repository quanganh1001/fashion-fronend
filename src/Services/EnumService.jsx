import { apiPublic } from "../Ultils/AxiosCustomize";

const getSize = async () => {
  const response = await apiPublic.get("enums/sizes");
  return response;
};


const getImagesSize = async () => {
  const response = await apiPublic.get("enums/sizeImages");
  return response;
};

const getAllRoles = async () => {
    const response = await apiPublic.get("enums/roles");
    return response;
}
export { getSize, getImagesSize, getAllRoles };
