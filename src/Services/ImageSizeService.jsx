import { apiPublic } from '../Ultils/AxiosCustomize';

const getImagesSize = async () => {
    const response = await apiPublic.get('enums/sizeImage');
    return response;
};

export { getImagesSize };
