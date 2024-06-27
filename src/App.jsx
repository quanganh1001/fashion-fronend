import { Outlet } from 'react-router-dom';
import AuthProvider from './ContextProvider/AuthProvider.jsx';
import CartProvider from './ContextProvider/CartProvider.jsx';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Outlet />
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
