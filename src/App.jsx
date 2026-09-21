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
import Transactions from "./pages/Transactions";
import PlayHistory from "./pages/PlayHistory";
import HowToPlay from "./pages/HowToPlay";
import AddMoney from "./pages/AddMoney";
import WithdrawMoney from "./pages/WithdrawMoney";
import Settings from "./pages/Settings";
import Error from "./pages/Error";
import UnderConstruction from "./pages/UnderConstruction";
import AdminSupport from "./pages/AdminSupport";
import ResultHistory from "./pages/ResultHistory";
import ReferAndEarn from "./pages/ReferAndEarn";
import GameOptions from "./pages/GameOptions";
import GameJodi from "./pages/GameJodi";
import GameHarup from "./pages/GameHarup";
import LeakJodi from "./pages/LeakJodi";

export default function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          {/* <Route path="/" element={<LandingPage />} /> */}

          {/* Authentication*/}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/otp" element={<Otp />} /> */}
          {/* <Route path="/signup-otp" element={<SignupOTP />} /> */}
          <Route path="/set-mpin" element={<SetMPIN />} />
          <Route path="/new-password" element={<NewPassword />} />

          {/* Application Header + Sidebar + Future Footer */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leak-jodi" element={<LeakJodi />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/play-history" element={<PlayHistory />} />
            <Route path="/admin-support" element={<AdminSupport />} />
            <Route path="/result-history" element={<ResultHistory />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/add-money" element={<AddMoney />} />
            <Route path="/wallet" element={<AddMoney />} />
            <Route path="/withdraw-money" element={<WithdrawMoney />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/refer-and-earn" element={<ReferAndEarn />} />

            {/* Game Routes */}
            <Route path="/game/:id" element={<GameOptions />} />
            <Route path="/game/:id/jodi" element={<GameJodi />} />
            <Route path="/game/:id/harup" element={<GameHarup />} />
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
