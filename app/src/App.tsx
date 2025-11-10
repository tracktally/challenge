// src/App.tsx
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChallengeLayout from "./pages/ChallengeLayout";
import ProgressPage from "./pages/ProgressPage";
import LeaderBoardPage from "./pages/LeaderBoardPage.tsx";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
import {CreateChallengePage} from "./pages/CreateChallengePage.tsx";

import './App.css'
import {CreateUserPage} from "./pages/CreateUserPage.tsx";
import { handleGoogleRedirect } from "./firebase/config.ts";

function App() {
    function NotFound() {
      return (
        <>
        <div className="p-6">
            Not found <br />
             <a href="/" className="link">Back to home</a>
            </div>
        </>
      );
    }

    return (
        <>
            {/* /doc is reserved for some documentation. dont swallow it */}
            <HashRouter basename="/">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/challenge/new" element={<CreateChallengePage />} />
                    <Route path="/challenge/:uuid/*" element={<ChallengeLayout />}>

                        <Route index element={<ProgressPage />} /> 
                        <Route path="progress" element={<ProgressPage />} />
                        <Route path="leaderboard" element={<LeaderBoardPage />} />
                        <Route path="history" element={<HistoryPage />} />
                        <Route path="join" element={<CreateUserPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                    
                        <Route path="*" element={<NotFound />} />
                    </Route>
                     
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </HashRouter>
        </>
    );
}

export default App;