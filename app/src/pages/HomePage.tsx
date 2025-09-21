// src/pages/HomePage.tsx
import { Link, useLocation, useNavigate, } from "react-router-dom";
import { useLocalChallenges } from "../hooks/useLocalChallenges";
import type { LocalChallenge } from "../hooks/useLocalChallenges";
import { useEffect } from "react";
import { Button } from "@headlessui/react";

export default function HomePage() {
    const { localChallenges,
        addLocalChallenge,
        removeLocalChallenge,
        getChallenge,
        updateLocalChallenge } = useLocalChallenges();
    const location = useLocation() as { state?: { banner?: string } };

    function createUrl(c: LocalChallenge) {
        if (c.adminUuid && c.adminUuid.length > 0) {
            return `/challenge/${c.adminUuid}`;
        } else {
            return `/challenge/${c.publicUuid}`;
        }
    }

    return (
        <>
            <main className="flex flex-col min-h-screen bg-base-200">
                <div className="navbar bg-base-200 shadow px-4 ">
                    <div className="flextext-center">
                        <h1 className="text-lg font-bold truncate">Track Tally.</h1>
                    </div>
                </div>
                <div className="p-6 text-center">
                    {location.state?.banner && (
                        <div className="alert alert-success mb-6">
                            <span>🎉 {location.state.banner}</span>
                        </div>
                    )}
                    <p className="mb-6">Create or join a challenge with your friends.</p>

                    <div className="flex flex-col gap-4 max-w-xs mx-auto mb-8">
                        <Link to="/challenge/new" className="btn btn-primary">
                            Create Challenge
                        </Link>
                    </div>

                    {(Object.keys(localChallenges).length) > 0 && (
                        <div className="max-w-md mx-auto  text-left">
                            <h2 className="text-lg font-semibold mb-5 text-center">My Challenges</h2>

                            <ul className="space-y-2">
                                {Object.entries(localChallenges).map(([id, c]) => (
                                    // <Link to={c.url}>
                                    <Link to={createUrl(c)}>
                                        <li
                                            key={c.challengeId}
                                            className="card bg-base-200 shadow-sm p-4 flex flex-col gap-2"
                                        >
                                            <div className="flex flex-col">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold">{c.name}</h3>
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeLocalChallenge(c.challengeId)
                                                    }}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    Delete
                                                </Button>
                                                </div>
                                                <h3>User: <i>{c.userName != "" ? c.userName : "Not joined"}</i></h3>
                                            </div>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}