import { useContext } from 'react';
import { FeedbackContext } from '../ContextProvider/Context';

export default function useFeedback() {
    return useContext(FeedbackContext);
}
