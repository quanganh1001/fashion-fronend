import { Outlet } from 'react-router-dom';
import AuthProvider from './ContextProvider/AuthProvider.jsx';

function App() {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
}

export default App;
