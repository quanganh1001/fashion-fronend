import { useContext } from 'react';
import { PaginationContext } from '../ContextProvider/Context';

export default function usePagination() {
    return useContext(PaginationContext);
}
