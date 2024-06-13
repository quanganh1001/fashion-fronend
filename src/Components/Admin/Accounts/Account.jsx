import Tittle from "../../Fragments/Tittle";

export default function Account() {
    console.log("d")
    return (
    <>
        <Tittle tittle="Quản lý tài khoản" />
        <div className="mt-5 bg-white p-5 shadow border">

                <table className="table table-striped table-hover table-bordered border">
                    <thead>
                    <tr>
                        <th>Tên tài khoản</th>
                        <th>Quyền</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>

                        <td>
                            
                        </td>
                    </tr>
                    </tbody>
                </table>
        </div>
        
    </>
    );
}
