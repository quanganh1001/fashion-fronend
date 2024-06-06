import { Pagination } from "react-bootstrap";
import usePagination from "../../CustomHooks/userPagination";
import { useMemo } from "react";

export default function CustomPagination({
  totalPages,
  currenPage,
  totalProducts,
}) {
  const { searchParams, setPage, setPageSize } = usePagination();

  const pageList = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <>
      <div className="my-4 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center">
          <select
            className="form-select"
            id="page-size"
            value={searchParams.get("size")}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="10">10 items</option>
            <option value="20">20 items</option>
            <option value="50">50 items</option>
            <option value="100">100 items</option>
          </select>
        </div>

        <div>
          Tổng: <span className="text-danger"> {totalProducts} </span>sản phẩm
        </div>

        <div className="mt-2">
          <Pagination>
            <Pagination.First
              onClick={() => setPage(1)}
              linkClassName="btn-non-active "
            />
            <Pagination.Prev
              linkClassName="btn-non-active"
              onClick={() => setPage(currenPage - 1)}
              disabled={currenPage === 1}
            />
            {pageList?.map((pageNo, i) => (
              <Pagination.Item
                key={i}
                onClick={() => setPage(pageNo)}
                active={currenPage === pageNo}
                linkClassName={
                  currenPage === pageNo ? "btn-active" : "btn-non-active"
                }
              >
                {pageNo}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setPage(currenPage + 1)}
              linkClassName="btn-non-active"
              disabled={currenPage === pageList.length}
            />
            <Pagination.Last
              onClick={() => setPage(pageList.length)}
              linkClassName="btn-non-active"
            />
          </Pagination>
        </div>
      </div>
    </>
  );
}
