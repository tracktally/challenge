import {Outlet, Link, useParams, useLocation, useNavigate} from "react-router-dom";
import {useChallengeByAnyId} from "../hooks/useChallenge.ts";
import {useLocalChallenge} from "../hooks/useLocalChallenge.ts"

export default function ChallengeLayout() {
    var {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const challengeUrl = "/challenge/" + id + ""
    id = "/challenge/" + id;
    console.log("challenge layout with id, ", id);
    const {getLocalChallenge} = useLocalChallenge();

    const challenge = useChallengeByAnyId(id ?? null);

    if (!challenge) return <p>Loading...</p>;

    const localChallenge = getLocalChallenge(challenge.id);

    const challengeName = challenge.name;

    const isActive = (path: string) =>
        location.pathname === `/challenge/${id}/${path}`;

    if (! localChallenge || !localChallenge.userId) {
        // create a new user and store challenge
        if (!location.pathname.includes("join")) {
            navigate("join")
        }
         return <Outlet context={{challenge}}/>
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
                <Outlet context={{challenge}}/>
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
                        <span className="dock-label text-xs">Today</span>
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
        </main>
    );
}