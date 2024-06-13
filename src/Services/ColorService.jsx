import { apiPrivate, apiPublic } from '../Ultils/AxiosCustomize';

const getAllColors = async () => {
    const response = await apiPrivate.get('colors');
    return response;
};

export { getAllColors };
