// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChallengeLayout from "./pages/ChallengeLayout";
import ProgressPage from "./pages/ProgressPage";
import LeaderBoardPage from "./pages/LeaderBoardPage.tsx";
import SettingsPage from "./pages/SettingsPage";
import HistoryPage from "./pages/HistoryPage";
import {CreateChallengePage} from "./pages/CreateChallengePage.tsx";

import './App.css'
import {CreateUserPage} from "./pages/CreateUserPage.tsx";

function App() {
    return (
        <>
            <Router>
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
                    
    
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default App;