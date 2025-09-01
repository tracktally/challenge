// src/pages/HomePage.tsx
import {Link, useLocation, useNavigate,} from "react-router-dom";
import {useLocalChallenge} from "../hooks/useLocalChallenge";
import {useEffect} from "react";
import {Button} from "@headlessui/react";

export default function HomePage() {
    const { localChallenges, removeLocalChallenge } = useLocalChallenge();
    const location = useLocation() as { state?: { banner?: string } };
    const navigate = useNavigate();

    // remove banner after refresh
    // useEffect(() => {
    //     if (location.state?.banner) {
    //         navigate(".", { replace: true });
    //     }
    // }, [location, navigate]);


    return (
        <>
            <main className="flex flex-col min-h-screen bg-base-200">
                <div className="navbar bg-base-200 shadow px-4 ">
                    <div className="flextext-center">
                        <h1 className="text-lg font-bold truncate">Challenge</h1>
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

                    {localChallenges.length > 0 && (
                        <div className="max-w-md mx-auto  text-left">
                            <h2 className="text-lg font-semibold mb-5 text-center">My Challenges</h2>

                            <ul className="space-y-2">
                                {localChallenges.map((c) => (
                                    <Link to={c.adminUrl ? c.adminUrl : c.userUrl}>
                                        <li
                                            key={c.id}
                                            className="card bg-base-200 shadow-sm p-4 flex flex-col gap-2"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold">{c.name}</h3>
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeLocalChallenge(c.id)}}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    Delete
                                                </Button>
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