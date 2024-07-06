
import { apiPrivate, apiPublic } from "../Ultils/AxiosCustomize";

export const getSize =  () => {
  return  apiPrivate.get('enums/sizes');
};


export const getImagesSize =  () => {
  return  apiPrivate.get('enums/sizeImages');
};

export const getAllRoles =  () => {
    return  apiPrivate.get('enums/roles');

}

export const getAllInvoiceStatus =  () => {
    return  apiPrivate.get('enums/invoiceStatus');
};

export const getUrlImgEnum =  (ImgEnum) => {
    return  apiPublic.get('enums/getUrlImgEnum', {
        params: {
            ImgEnum: ImgEnum,
        },
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
