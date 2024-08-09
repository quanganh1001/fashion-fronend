import { apiPrivate } from "../Ultils/AxiosCustomize";

export const getTopProduct = (startDate, endDate) => {
    return apiPrivate.get(`stored/topProduct`, {
        params: {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
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

export const getSalesSuccess = (startDate, endDate) => {
    return apiPrivate.get(`stored/salesSuccess`, {
        params: {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
        },
    });
};