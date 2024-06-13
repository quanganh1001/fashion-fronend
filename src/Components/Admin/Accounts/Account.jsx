import Tittle from "../../Fragments/Tittle";

export default function Account() {
    return (
      <>
            <Tittle tittle="Quản lý tài khoản" />
            <div className="mt-5 bg-white p-5 shadow border">
            <div class="mt-3 mb-3 d-flex justify-content-between">
                <>

                <form th:action="@{/admin/account}" method="get">
                    <div class="input-group" style="width: 400px">
                        <input class="form-control" type="text" id="key" name="key"
                               th:value="${#strings.isEmpty(searchKey) ? '' : searchKey}"
                               placeholder="Nhập số điện thoại, email, tên đăng nhập...">
                        <button type="submit" class="btn btn-outline-dark">Tìm kiếm</button>
                    </div>
                </form>

                <nav aria-label="Page navigation">
                    <div>Tổng: <span th:text="${totalItems}" style="color:red"></span> tài khoản</div>
                    <ul class="pagination">
                        <li class="page-item" th:class="${currentPage == 1} ? 'page-item disabled' : 'page-item'">
                            <a class="page-link" th:href="@{/admin/account(page=${currentPage}-1,key=${key})}"
                               aria-label="Previous">
                                <span aria-hidden="true" class="text-dark">&laquo;</span>
                            </a>
                        </li>
                        <li class="page-item" th:each="i : ${#numbers.sequence(1, totalPages)}">
                            <a class="page-link" th:href="@{/admin/account(page=${i >= 1 ? i : 1},key=${key})}"
                               th:text="${i}"
                               th:class="${currentPage == i} ? 'page-link bg-dark text-white' : 'page-link text-dark'"
                            ></a>
                        </li>
                        <li class="page-item"
                            th:class="${currentPage == totalPages} ? 'page-item disabled' : 'page-item'">
                            <a class="page-link" th:href="@{/admin/account(page=${currentPage+1},key=${key})}"
                               aria-label="Next">
                                <span aria-hidden="true" class="text-dark">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div id="table">
                <table class="table table-striped table-hover table-bordered border">
                    <thead>
                    <tr>
                        <th>Tên tài khoản</th>
                        <th>Quyền</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr th:each="ac:${accounts}">
                        <td th:text="${ac.userName}"></td>
                        <td th:text="${ac.role}"></td>
                        <td th:text="${ac.enabled}==true ? 'Hoạt động' :'Không kích hoạt'"></td>

                        <td>
                            <div class="d-flex justify-content-center">
                                <a th:href="@{/admin/account/update-account?accountId=__${ac.accountId}__}">
                                    <button class="align-items-center btn btn-warning">Sửa
                                    </button>
                                </a>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <form th:action="@{/admin/account/delete-account?accountId=__${ac.accountId}__}"
                                      th:method="delete">
                                    <button class="align-items-center btn btn-danger btn-sm p-2"
                                            th:data-accountId="${ac.accountId}" type="button" onclick="confirmDelete()">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        
      </>
    );
}
