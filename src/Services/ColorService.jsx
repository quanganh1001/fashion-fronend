import { apiPrivate } from '../Ultils/AxiosCustomize';

const getAllColors =  () => {
    const response =  apiPrivate.get('colors');
    return response;
};

export { getAllColors };
