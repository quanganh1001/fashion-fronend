import { Outlet } from "react-router-dom"
import AuthProvider from "./ContextProvider/AuthProvider.js";
import CartProvider from "./ContextProvider/CartProvider";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Outlet />
      </CartProvider>
    </AuthProvider>
  )
}

export default App