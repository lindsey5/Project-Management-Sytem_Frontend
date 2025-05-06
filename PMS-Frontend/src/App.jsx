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
import Team from "./pages/User/Project/Team/Team";
import Requests from "./pages/User/Project/Requests";
import Overview from "./pages/User/Project/Overview";
import ProjectSettings from "./pages/User/Project/Settings";
import ChatBot from "./components/Chatbot/Chatbot";
import Notifications from "./pages/User/Notifications";
import Settings from "./pages/User/Settings/SettingsHeader";
import YourTasks from "./pages/User/YourTask";
import SignupPage from "./pages/Auth/Signup";
import SettingsLayout from "./layouts/SettingsLayout";
import GeneralSettings from "./pages/User/Settings/GeneralSettings";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />}/>
        <Route path="tasks" element={<YourTasks />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<GeneralSettings />} />
        </Route>
        <Route path="/project" element={<ProjectLayout />}>
          <Route path="tasks" element={<Tasks />}/>
          <Route path="team" element={<Team />} />
          <Route path="requests" element={<Requests />} />
          <Route path="overview" element={<Overview />} />
          <Route path="settings" element={<ProjectSettings />} />
        </Route>
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
