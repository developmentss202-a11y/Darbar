import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Otp from "./pages/Otp";
import NewPassword from "./pages/NewPassword";
import SetMPIN from "./pages/SetMPIN";
import SignupOTP from "./pages/SignupOTP";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/Landing Page/LandingPage";
import AppLayout from "./layouts/AppLayout";
import Profile from "./pages/Profile";
import { useState } from "react";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/signup-otp" element={<SignupOTP />} />
        <Route path="/set-mpin" element={<SetMPIN />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Application Header + Sidebar + Future Footer */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/transactions" element={<Transactions />} />
          <Route path="/play-history" element={<PlayHistory />} />
          <Route path="/admin-support" element={<AdminSupport />} />
          <Route path="/result-history" element={<ResultHistory />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/add-money" element={<AddMoney />} />
          <Route path="/withdraw-money" element={<WithdrawMoney />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/notifications" element={<Notifications />} />
          */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
