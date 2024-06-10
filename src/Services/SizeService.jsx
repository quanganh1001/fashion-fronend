import { apiPublic } from "../Ultils/AxiosCustomize";

const getSize = async () => {
  const response = await apiPublic.get("enums/size");
  return response;
};

export { getSize };
