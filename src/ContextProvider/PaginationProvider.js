import { PaginationContext } from "./Context";
import { useSearchParams } from "react-router-dom";

export default function PaginationProvider({ children }) {

    const [searchParams, setSearchParams] = useSearchParams({
        page: 1,
        size: 10,
        search: ''
    });

    const setPage = (page) => {
        searchParams.set('page', page);
        setSearchParams(searchParams)
        window.scrollTo(0, 0);
    }

    const setPageSize = (size) => {
        searchParams.set('page', 1);
        searchParams.set('size', size);
        searchParams.set('search', "");
        setSearchParams(searchParams);
    }

    const handleSearch = (search) => {
        searchParams.set('page', 1);
        searchParams.set('search', search);
        setSearchParams(searchParams);
    }

    return (
        <PaginationContext.Provider
            value={{searchParams,setPage,setPageSize,handleSearch}}>
            {children}
        </PaginationContext.Provider>
    )
}
