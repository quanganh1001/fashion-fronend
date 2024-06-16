
import { apiPrivate } from "../Ultils/AxiosCustomize";

const getSize = async () => {
  const response = await apiPrivate.get('enums/sizes');
  return response;
};


const getImagesSize = async () => {
  const response = await apiPrivate.get('enums/sizeImages');
  return response;
};

const getAllRoles = async () => {
    const response = await apiPrivate.get('enums/roles');
    return response;
}

const getAllInvoiceStatus = async () => {
    const response = await apiPrivate.get('enums/invoiceStatus');
    return response;
};
export { getSize, getImagesSize, getAllRoles, getAllInvoiceStatus };
