import { Pagination } from "react-bootstrap";
import usePagination from "../../CustomHooks/userPagination";
import { useMemo } from "react";

export default function CustomPagination({
  totalPages,
  currentPage,
  totalProducts,
}) {
  const { searchParams, setPage, setPageLimit } = usePagination();

  const pageList = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <>
      <div className="my-4 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center">
          <select
            className="form-select bg-body-secondary"
            id="page-size"
            value={searchParams.get("limit")}
            onChange={(e) => setPageLimit(e.target.value)}
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
              disabled={currentPage === 1}
              linkClassName={
                currentPage === 1
                  ? "btn-non-active bg-light border-light"
                  : "btn-non-active"
              }
            />
            <Pagination.Prev
              linkClassName={
                currentPage === 1
                  ? "btn-non-active bg-light border-light"
                  : "btn-non-active"
              }
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            />
            {pageList?.map((pageNo, i) => (
              <Pagination.Item
                key={i}
                onClick={() => setPage(pageNo)}
                active={currentPage === pageNo}
                linkClassName={
                  currentPage === pageNo
                    ? "btn-active bg-gradient"
                    : "btn-non-active"
                }
              >
                {pageNo}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === pageList.length}
              linkClassName={
                currentPage === pageList.length
                  ? "btn-non-active bg-light border-light"
                  : "btn-non-active"
              }
            />
            <Pagination.Last
              onClick={() => setPage(pageList.length)}
              disabled={currentPage === pageList.length}
              linkClassName={
                currentPage === pageList.length
                  ? "btn-non-active bg-light border-light"
                  : "btn-non-active"
              }
            />
          </Pagination>
        </div>
      </div>
    </>
  );
}
