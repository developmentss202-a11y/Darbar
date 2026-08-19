import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Otp from "./pages/Otp";
import NewPassword from "./pages/NewPassword";
import SetMPIN from "./pages/SetMPIN";
import SignupOTP from "./pages/SignupOTP";
import Homepage from "./pages/Homepage";

import LandingPage from "./pages/Landing Page/LandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Application */}
        <Route path="/homepage" element={<Homepage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/signup-otp" element={<SignupOTP />} />
        <Route path="/set-mpin" element={<SetMPIN />} />
        <Route path="/new-password" element={<NewPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
