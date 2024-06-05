import { PaginationContext } from "./Context";
import { useSearchParams } from "react-router-dom";


export default function PaginationProvider({ children }) {

    const [searchParams, setSearchParams] = useSearchParams({
        page: 0,
        size: 10,
        sort: [],
        search: ''
    });

    const toPage = (page) => {
        searchParams.set('page', page);
        setSearchParams(searchParams)
        window.scrollTo(0, 0);
    }

    const setPageSize = (size) => {
        searchParams.set('page', 0);
        searchParams.set('size', size);
        setSearchParams(searchParams);
    }

    const handleSearch = (search) => {
        searchParams.set('page', 0);
        searchParams.set('sort', []);
        searchParams.set('search', Object.values(search));
        setSearchParams(searchParams);
    }

    const sortByField = (field) => {
        const sort = searchParams.getAll('sort');
        if (!sort) {
            searchParams.set('sort', `${field},ASC`);
        } else {
            let newSort = [...sort];
            searchParams.delete('sort');
            const index = sort.findIndex(param => param.startsWith(`${field},`));
            if (index !== -1) {
                newSort[index] = (sort[index] === `${field},ASC`) ? `${field},DESC` : `${field},ASC`;
            } else {
                newSort.push(`${field},ASC`);
            }
            newSort.forEach(sort => searchParams.append('sort', sort));
        }
        setSearchParams(searchParams);
    }

    const sortBySelector = (value) => {
        searchParams.set('page', 0);
        searchParams.set('sort', [value]);
        setSearchParams(searchParams);
    }

    return (
        <PaginationContext.Provider
            value={{
                searchParams,
                toPage,
                handleSearch,
                setPageSize,
                sortByField,
                sortBySelector
            }}>
            {children}
        </PaginationContext.Provider>
    )
}
