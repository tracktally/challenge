import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocalChallenges } from "../hooks/useLocalChallenges";
import type { LocalChallenge } from "../hooks/useLocalChallenges";
import { useState } from "react";
import { Button } from "@headlessui/react";

export default function HomePage() {
    const { localChallenges, removeLocalChallenge } = useLocalChallenges();
    const location = useLocation() as { state?: { banner?: string } };
    const navigate = useNavigate();
    const [joinId, setJoinId] = useState("");

    function createUrl(c: LocalChallenge) {
        return `/challenge/${c.challengeId}`;
    }

    function handleJoin(e: React.FormEvent) {
        e.preventDefault();
        if (joinId.trim()) {
            navigate(`/challenge/${joinId.trim()}`, {
                state: { banner: "Joined challenge!" },
            });
            setJoinId("");
        }
    }

    return (
        <main className="flex flex-col min-h-screen bg-base-200">
            <div className="navbar bg-base-200 shadow px-4 ">
                <div className="flextext-center">
                    <h1 className="text-lg font-bold truncate">Track Tally.</h1>
                </div>
                <div className="ml-auto">
                    <span>
                    <h1 className="underline decoration-2  underline-offset-4"><a href="https://tracktally.github.io/doc/">Docs</a></h1>
                    </span>
                    
                </div>
            </div>

            <div className="p-6 text-center">
                {location.state?.banner && (
                    <div className="alert alert-success mb-6">
                        <span>🎉 {location.state.banner}</span>
                    </div>
                )}

                <p className="mb-6 opacity-70">Challenge your friends with Track Tally.</p>

                <div className="flex flex-col gap-4 max-w-xs mx-auto mb-8">
                    <Link to="/challenge/new" className="btn btn-primary">
                        Create Challenge
                    </Link>

                    
                    <div className="divider my-2">or</div>
                    <p className="opacity-70 -mt-2 mb-1">Join with a challenge ID</p>


                    <form onSubmit={handleJoin} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter Challenge ID"
                            value={joinId}
                            onChange={(e) => setJoinId(e.target.value)}
                            className="input input-bordered flex-1"
                            aria-label="Challenge ID"
                        />
                        <button type="submit" className="btn btn-secondary">
                            Join
                        </button>
                    </form>
                </div>

                {Object.keys(localChallenges).length > 0 && (
                    <div className="max-w-md mx-auto  text-left">
                        <h2 className="text-lg mt-10 font-semibold mb-5 text-center">My Challenges</h2>

                        <ul className="space-y-2">
                            {Object.entries(localChallenges).map(([id, c]) => (
                                <Link key={c.challengeId} to={createUrl(c)}>
                                    <li className="card bg-base-200 shadow-sm p-4 flex flex-col gap-2">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold">{c.name}</h3>
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeLocalChallenge(c.challengeId);
                                                    }}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                            <h3>
                                                User: <i>{c.userName !== "" ? c.userName : "Not joined"}</i>
                                            </h3>
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
