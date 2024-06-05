import { Outlet } from "react-router-dom"
import AuthProvider from "./ContextProvider/AuthProvider.js";

function App() {
  return (
    <AuthProvider>
      
        <Outlet />
      
    </AuthProvider>
  )
}

export default App