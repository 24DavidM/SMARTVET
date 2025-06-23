import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login";
import { Register } from "./pages/Register";
import { Forgot } from "./pages/Forgot";
import { Confirm } from "./pages/Confirm";
import { NotFound } from "./pages/NotFound";
import Dashboard from "./layout/Dashboard";
import Profile from "./pages/Profile";
import List from "./pages/List";
import Details from "./pages/Details";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Chat from "./pages/Chat";
import Reset from "./pages/Reset";
import ProtectRoute from "./routes/ProtectedRouter";
import PublicRoute from "./routes/PublicRouter";
import { Home } from "./pages/Home";
import storProfile from "./context/storeProfile";
import { useEffect } from "react";
import storeAuth from "./context/storeAuth";

function App() {
  const{profile} = storProfile()
  const {token} = storeAuth()
  useEffect(()=>{
    if(token){
      profile()
    }
  }, [token])

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot/:id" element={<Forgot />} />
          <Route path="confirm/:token" element={<Confirm />} />
          <Route path="reset/:token" element={<Reset />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Rutas protegidas */}
        <Route
          path="dashboard/*"
          element={
            <ProtectRoute>
              <Routes>
                <Route element={<Dashboard />}>
                  <Route index element={<Profile />} />
                  <Route path="listar" element={<List />} />
                  <Route path="visualizar/:id" element={<Details />} />
                  <Route path="crear" element={<Create />} />
                  <Route path="actualizar/:id" element={<Update />} />
                  <Route path="chat" element={<Chat />} />
                </Route>
              </Routes>
            </ProtectRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
