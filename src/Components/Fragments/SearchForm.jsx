
import usePagination from "../../CustomHooks/userPagination";


export default function SearchForm({ placeholder }) {

    const {handleSearch} = usePagination();

    const searchForm = (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        handleSearch(keyword);
      };


    return (
      <form className="d-flex " onSubmit={searchForm}>
        <input
          name="keyword"
          type="search"
          placeholder="Nhập tên sản phẩm hoặc mã sản phẩm"
          className="form-control me-2 col"
        />
        <button className="btn btn-dark bg-gradient col-4">Tìm kiếm</button>
      </form>
    );
}
