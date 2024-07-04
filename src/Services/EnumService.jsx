
import { apiPrivate, apiPublic } from "../Ultils/AxiosCustomize";

export const getSize = async () => {
  return await apiPrivate.get('enums/sizes');
};


export const getImagesSize = async () => {
  return await apiPrivate.get('enums/sizeImages');
};

export const getAllRoles = async () => {
    return await apiPrivate.get('enums/roles');

}

export const getAllInvoiceStatus = async () => {
    return await apiPrivate.get('enums/invoiceStatus');
};

export const getUrlImgEnum = async (ImgEnum) => {
    return await apiPublic.get('enums/getUrlImgEnum', {
        params: {
            ImgEnum: ImgEnum,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
