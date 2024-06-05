import Menu from "../Admin/Menu"

export default function AdminLayout({ children }) {
    return (
        <div className='container-fluid g-0'>
            <div className='row g-0'>
                <div className='col-2 position-fixed bg-dark sidebar'>
                    <Menu />
                </div>
                <div className='col offset-2'>
                    <div className='container p-5'>
                        {children}
                    </div>
                </div>
            </div>
        </div>

    )
}
