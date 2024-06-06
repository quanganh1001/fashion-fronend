
import usePagination from "../../CustomHooks/userPagination";


export default function SearchForm({ placeholder }) {

    const {handleSearch} = usePagination();

    const searchForm = (e) => {
        e.preventDefault();
        const searchValue = e.target.elements.search.value;
        handleSearch(searchValue);
      };


    return (
        <form className="d-flex " onSubmit={searchForm}>
          <input
            name="search"
            type="search"
            placeholder="Nhập tên sản phẩm hoặc mã sản phẩm"
            className="form-control me-2 col"
          />
          <button className="btn btn-dark col-4">Tìm kiếm</button>
        </form>
    )
}
