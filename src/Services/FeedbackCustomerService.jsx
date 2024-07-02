import { apiPrivate, apiPublic } from '../Ultils/AxiosCustomize';

export const sendFeedback = (feedbackCustomer) => {
    return apiPublic.post('feedback', feedbackCustomer);
};

export const getAllFeedback = (searchParams) => {
    
    return apiPrivate.get('feedback', {
        params: {
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        },
    });
};

export const readFeedback = (id) => {
    return apiPrivate.put('feedback/read', id);
};

export const unread = (id) => {
    return apiPrivate.put('feedback/unread', id);
};

export const getTotalUnread = () => {
    return apiPrivate.get('feedback/count');
}