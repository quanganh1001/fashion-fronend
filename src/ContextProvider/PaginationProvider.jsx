import { PaginationContext } from "./Context";
import { useSearchParams } from "react-router-dom";

export default function PaginationProvider({ children }) {

    const [searchParams, setSearchParams] = useSearchParams({
        page: 1,
        limit: 10,
        keyword: ''
    });

    const setPage = (page) => {
        searchParams.set('page', page);
        setSearchParams(searchParams)
    }

    const setPageLimit = (size) => {
      searchParams.set("page", 1);
      searchParams.set("limit", size);
      searchParams.set("keyword", "");
      setSearchParams(searchParams);
    };

    const handleSearch = (keyword) => {
      searchParams.set("page", 1);
      searchParams.set("keyword", keyword);
      setSearchParams(searchParams);
    };

    return (
      <PaginationContext.Provider
        value={{ searchParams, setPage, setPageLimit, handleSearch }}
      >
        {children}
      </PaginationContext.Provider>
    );
}
