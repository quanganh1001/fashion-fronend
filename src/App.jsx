import { Outlet } from 'react-router-dom';
import AuthProvider from './ContextProvider/AuthProvider.jsx';
import CartProvider from './ContextProvider/CartProvider.jsx';
import useScrollToTop from './CustomHooks/useScrollToTop.jsx';


function App() {
    useScrollToTop();
    return (
        <AuthProvider>
            <CartProvider>
                <Outlet />
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
