import { useState, useEffect } from 'react'
import { incrementChallenge } from "../firebase/user.ts";
import type { User, Challenge, Activity } from "../types/domain";
import { useOutletContext } from "react-router-dom";
import { useActivities } from "../hooks/useActivities.ts";




export default function ProgressPage() {
    const { challenge, user, users, addReps } = useOutletContext<{ challenge: Challenge, user: User, users: User[], addReps: (amount: number) => void }>();

    const [count, setCount] = useState(user?.counter ?? 0);
    const [counter, setCounter] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [countChallenge, setCountChallenge] = useState(challenge?.counter ?? 0);
    const logs = useActivities(challenge.id, 20);

    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Calculate time left until midnight (00:00)
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ms_left = midnight.getTime() - now.getTime();
    const hours_left = Math.floor(ms_left / (1000 * 60 * 60));
    const minutes_left = Math.floor((ms_left % (1000 * 60 * 60)) / (1000 * 60));
    const seconds_left = Math.floor((ms_left % (1000 * 60)) / 1000);



    useEffect(() => {
        if (user != null && user.counter != count) {
            setCount(user.counter);
        }
    }, [user]);

    useEffect(() => {
        if (challenge != null && challenge.counter != countChallenge) {
            setCountChallenge(challenge.counter);
        }
    }, [challenge]);

    console.log("user: ", user);

    const inc = () => {
        console.log("inc: ", count)
        setCount(count + 1);

        if (count + 1 == challenge.goalCounterUser && !showCelebration) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000); // hide after 3 sec
        }



        setCountChallenge(count + 1);
        incrementChallenge(challenge.id, user.id, 1)
        addReps(1);

    }
    const dec = () => {
        if (count < 1) return;
        setCountChallenge(count - 1);
        setCount(count - 1);
        incrementChallenge(challenge.id, user.id, -1)
        addReps(-1);
    }


    if (!user) {
        return <p>Loading user...</p>;
    }

    return (
        <>


            <div className="">
                <div className="flex-1 overflow-y-auto p-1 space-y-6">
                    <h2 className="text-xl text-left font-semibold mb-4">Progress</h2>
                    <div className="">
                        <div>
                            <div className="flex justify-between font-bold">
                                <h2 className="text text-left font-bold">Your Total</h2><span>{count} / {challenge.goalCounterUser}</span>
                            </div>
                            <progress className="progress progress-primary w-full h-10"
                                value={count}
                                max={challenge.goalCounterUser}></progress>
                            <div className="flex justify-between ">
                                <span>Team Total</span><span>
                                    {challenge.counter} / {challenge.goalCounterChallenge}</span>
                            </div>
                            <progress className="progress progress-secondary w-full h-5"
                                value={challenge.counter}
                                max={challenge.goalCounterChallenge}></progress>


                            <div className="flex justify-between">
                                <span>Time left</span>
                                <span>

                                    <span className="countdown text-bold">
                                        <span style={{ "--value": hours_left } /* as React.CSSProperties */} aria-live="polite" aria-label={counter}>{hours_left}</span>:
                                        <span style={{ "--value": minutes_left } /* as React.CSSProperties */} aria-live="polite" aria-label={counter}>{minutes_left}</span>:
                                        <span style={{ "--value": seconds_left } /* as React.CSSProperties */} aria-live="polite" aria-label={counter}>{seconds_left}</span>
                                    </span>
                                </span>
                            </div>
                            <progress className="progress progress w-full h-5"
                                value={challenge.counter}
                                max={challenge.goalCounterChallenge}></progress>





                            <div className="flex justify-center gap-5 mt-5">
                                <button className="btn btn-secondary w-40 h-30 text-5xl"
                                    onClick={dec}
                                >−
                                </button>
                                <button className="btn btn-primary w-40 h-30 text-5xl"
                                    onClick={inc}
                                >＋
                                </button>
                            </div>






                        </div>
                    </div>
                </div>


            </div>



            {/* ----------------------------- */}
            {/* Activity Feed */}
            {/* ----------------------------- */}

            <div className="flex-1 overflow-y-auto p-1 mt-15">
                <h2 className="text-xl text-left font-semibold mb-4">Activity Log</h2>
                <div className="overflow-y-auto rounded-lg border border-base-content/10 bg-base-100">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="text-sm text-gray-500 uppercase">
                                <th className="px-4 py-2">When</th>
                                <th className="px-4 py-2">Who</th>
                                <th className="px-4 py-2 text-right">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log: Activity) => {
                                const isYou = log.userId === user.id;
                                const time = log.createdAt.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });

                                return (
                                    <tr key={log.id} className="hover">
                                        <td className="px-4 py-2 text-gray-600">{time}</td>
                                        <td className={`px-4 py-2 ${isYou ? "font-bold text-primary" : ""}`}>
                                            {isYou ? "You" : log.userName}
                                        </td>
                                        <td className="px-4 py-2 text-right font-semibold text-accent">
                                            +{log.amount}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>


            {showCelebration && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-50 pointer-events-none">
                    <span className="text-9xl animate-bounce">🎉</span>
                    <h2 className="mt-6 text-4xl font-extrabold text-white animate-pulse">
                        Awesome! Keep it up!
                    </h2>
                </div>
            )}

        </>
    );
}