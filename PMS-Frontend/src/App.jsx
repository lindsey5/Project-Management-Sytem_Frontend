import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Navigate
} from "react-router-dom";
import "./App.css"
import HomePage from "./pages/Home/Home";
import HomeLayout from "./layouts/HomeLayout";
import LoginPage from "./pages/Auth/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/User/Home";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />}/>
       
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </>
  )
);


const App = () => {

  return <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
}

export default App
