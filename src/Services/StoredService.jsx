import { apiPrivate } from "../Ultils/AxiosCustomize";

export const getTopProduct = (startDate, endDate, selectTopProductAtStore) => {
    
    return apiPrivate.get(`stored/topProduct`, {
        params: {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            store: selectTopProductAtStore,
        },
    });
};


export const getSalesSent = (startDate, endDate) => {
    return apiPrivate.get(`stored/salesSent`, {
        params: {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
        },
    });
}

export const getSalesSuccess = (startDate, endDate, selectSalesSuccessAtStore) => {
    console.log(selectSalesSuccessAtStore);
    
    return apiPrivate.get(`stored/salesSuccess`, {
        params: {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            store: selectSalesSuccessAtStore
        },
    });
};