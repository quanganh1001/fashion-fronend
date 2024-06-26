import './Admin.scss';
import Menu from './components/Admin/Menu';
import { Outlet } from 'react-router-dom';

const Admin = () => {
    return (
        <div className="app-container">
            <div className="menu-container">
                <Menu />
            </div>

            <div className="content-container">
                <Outlet />
            </div>
        </div>
    );
};

export default Admin;
