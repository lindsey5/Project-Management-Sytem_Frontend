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
import ProjectLayout from "./layouts/ProjectLayout";
import Tasks from "./pages/User/Project/Tasks";
import Team from "./pages/User/Project/Team";
import Requests from "./pages/User/Project/Requests";
import Overview from "./pages/User/Project/Overview";
import ProjectSettings from "./pages/User/Project/Settings";
import ChatBot from "./components/Chatbot/Chatbot";
import Notifications from "./pages/User/Notifications";
import YourTasks from "./pages/User/Project/YourTask";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />}/>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/project">
          <Route element={<ProjectLayout />}>
            <Route path="tasks" element={<Tasks />}/>
            <Route path="team" element={<Team />} />
            <Route path="requests" element={<Requests />} />
            <Route path="overview" element={<Overview />} />
            <Route path="settings" element={<ProjectSettings />} />
          </Route>
        </Route>
        <Route path="tasks" element={<YourTasks />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </>
  )
);


const App = () => {

  return <div className="relative">
    <RouterProvider router={router} />
    <ChatBot />
    <ToastContainer />
  </div>
}

export default App
