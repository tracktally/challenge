import {Outlet, Link, useParams, useLocation, useNavigate, generatePath} from "react-router-dom";
import {useChallengeByUuid} from "../hooks/useChallenge"
import {useLocalChallenges} from "../hooks/useLocalChallenges"
import {useUser} from "../hooks/useUser"
import {useUsers} from "../hooks/useUsers"
import { useBufferedActivity } from "../hooks/useBufferedActivity.ts";
import { useState } from "react";


export default function ChallengeLayout() {
    var {uuid} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {getChallenge} = useLocalChallenges();

    const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
    const triggerCelebration = (message: string, timeout: number) => {
        setCelebrationMessage(message);
        setTimeout(() => setCelebrationMessage(null), timeout * 1000);
    };

    const {challenge, isAdmin} = useChallengeByUuid(uuid ?? "");
    const localChallenge = getChallenge(challenge?.id ?? "");

    const user = useUser(challenge?.id ?? "", localChallenge?.userId ?? "");
    console.log(user);
    const users = useUsers(challenge?.id ?? "");

    /* Keep this here to use buffered activity even on different menu entries */
    const {addReps} = useBufferedActivity(challenge, user, 10);
    
    if (!challenge) return <p>Loading...</p>;

    console.log("challenge layout with id, ", uuid);
    const challengeName = challenge?.name
    const challengeUrl = generatePath("/challenge/:uuid", {uuid: uuid});

    const isActive = (path: string) =>
        location.pathname.includes(path);

    if (! localChallenge || !localChallenge.userId) {
        // create a new user and store challenge
        if (!location.pathname.includes("join")) {
            navigate("join")
        }
         return <Outlet context={{challenge, challengeUrl}}/>
    }

    
    return (
        <main className="flex flex-col min-h-screen">
            <div className="navbar bg-base-200 shadow px-4 min-h-[3rem]">
                <div className="flex-none">
                    <Link to="/"
                          className="btn btn-ghost btn-sm normal-case">
                        ←
                    </Link>
                </div>
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-bold truncate">{challengeName}</h1>
                </div>
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <button tabIndex={0}
                                className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 12h.01M12 12h.01M18 12h.01"
                                />
                            </svg>
                        </button>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
                        >
                            <li>
                                <Link to={`${challengeUrl}/settings`}>⚙️ Settings</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4">
                {/* Counter section */}
                <Outlet context={{challenge, user, users, addReps, triggerCelebration, challengeUrl}}/>
            </div>
            <div className="dock">
                <Link to={`${challengeUrl}/progress`}>
                    <button className={`flex flex-col items-center justify-center ${isActive("progress") ? "dock-active" : ""}`}>
                        <svg className="size-6 mb-1"
                             xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 24 24">
                            <g fill="currentColor"
                               strokeLinejoin="miter"
                               strokeLinecap="butt">
                                <polyline points="1 11 12 2 23 11"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"/>
                                <path d="m5,13v7c0,1.105.895,2,2,2h10c1.105,0,2-.895,2-2v-7"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"/>
                                <line x1="12"
                                      y1="22"
                                      x2="12"
                                      y2="18"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"/>
                            </g>
                        </svg>
                        <span className="dock-label text-xs">Activity</span>
                    </button>
                </Link>
                <Link to={`${challengeUrl}/leaderboard`}>
                    <button className={`flex flex-col items-center justify-center ${isActive("statistics") ? "dock-active" : ""}`}>
                        <svg className="size-6 mb-1"
                             xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 24 24">
                            <g fill="currentColor"
                               strokeLinejoin="miter"
                               strokeLinecap="butt">
                                <polyline points="3 14 9 14 9 17 15 17 15 14 21 14"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"/>
                                <rect x="3"
                                      y="3"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      ry="2"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"/>
                            </g>
                        </svg>
                        <span className="dock-label text-xs">Leaderboard</span>
                    </button>
                </Link>
                <Link to={`${challengeUrl}/history`}>
                    <button className={`flex flex-col items-center justify-center ${isActive("statistics") ? "dock-active" : ""}`}>
                        <svg className="size-6 mb-1"
                             xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 24 24">
                            <g fill="currentColor"
                               strokeLinejoin="miter"
                               strokeLinecap="butt">
                                <polyline points="3 14 9 14 9 17 15 17 15 14 21 14"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"/>
                                <rect x="3"
                                      y="3"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      ry="2"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"/>
                            </g>
                        </svg>
                        <span className="dock-label text-xs">History</span>
                    </button>
                </Link>
            </div>
            {/* Celebration */}
            {celebrationMessage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-50 pointer-events-none">
                <span className="text-9xl animate-bounce">🎉</span>
                <h2 className="mt-6 text-4xl font-extrabold text-white animate-pulse">
                    {celebrationMessage}
                </h2>
                </div>
            )}
        </main>
    );
}