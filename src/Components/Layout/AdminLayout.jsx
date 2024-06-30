import Menu from '../Admin/MenuAdmin';

export default function AdminLayout({ children }) {
    return (
        <div className="container-fluid g-0">
            <div className="row g-0">
                <div className="col-2 position-fixed bg-dark sidebar">
                    <Menu />
                </div>
                <div className="col offset-2">
                    <div className="m-3 mt-5 bg-white p-5 shadow border">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
