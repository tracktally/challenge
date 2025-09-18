import { useState, useEffect } from "react";
import { incrementChallenge, markGoalReached, updateUser } from "../firebase/user.ts";
import type { User, Challenge } from "../types/domain";
import { useOutletContext } from "react-router-dom";

interface CounterProps {
    challenge: Challenge;
    user: User;
    addReps: (amount: number) => void;
    triggerCelebration: (message: string, sec: number) => void;
}

export default function Counter({
    challenge,
    user,
    addReps,
    triggerCelebration,
}: CounterProps) {
    const [count, setCount] = useState(user?.counter ?? 0);
    const [countChallenge, setCountChallenge] = useState(challenge?.counter ?? 0);

    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Time calculations
    const secondsInDay = 24 * 60 * 60;
    const secondsPassedToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ms_left = midnight.getTime() - now.getTime();
    const hours_left = Math.floor(ms_left / (1000 * 60 * 60));
    const minutes_left = Math.floor((ms_left % (1000 * 60 * 60)) / (1000 * 60));
    const seconds_left = Math.floor((ms_left % (1000 * 60)) / 1000);

    useEffect(() => {
        if (user && user.counter !== count) {
            setCount(user.counter);
        }
    }, [user]);

    useEffect(() => {
        if (challenge && challenge.counter !== countChallenge) {
            setCountChallenge(challenge.counter);
        }
    }, [challenge]);

    const inc = (n: number) => {
        const newCount = count + n;
        setCount(newCount);

        if (newCount >= challenge.goalCounterUser && !user.goalReachedAt) {
            triggerCelebration("Awesome! You made it", 3);
            // markGoalReached(challenge.id, user.id);
            updateUser(challenge.id, user.id, { goalReachedAt: new Date() });
        }

        if (newCount >= challenge.goalCounterUser / 2 && !user.goalPartialReachedAt) {
            triggerCelebration("Keep it up. Half way", 3);
            // markGoalReached(challenge.id, user.id);
            updateUser(challenge.id, user.id, { goalPartialReachedAt: new Date() });
        }

        setCountChallenge(newCount);
        incrementChallenge(challenge.id, user.id, n);
        addReps(n);
    };

    const dec = (n: number) => {
        if (count < n) return;
        const newCount = count - n;
        setCount(newCount);
        setCountChallenge(newCount);
        incrementChallenge(challenge.id, user.id, -n);
        addReps(-n);
    };

    if (!user) return <p>Loading user...</p>;

    return (
        <div className="flex-1 overflow-y-auto p-1 space-y-6">
            {/* <h2 className="text-xl text-left font-semibold mb-4">Progress</h2> */}
            <div>
                {/* User total */}
                <div className="flex justify-between items-end font-bold">
                    <span>Your Total</span>
                    <span>
                        <span className="text-4xl font-bold">{count}</span>
                        <span className="text-base"> / {challenge.goalCounterUser}</span>
                    </span>
                </div>
                <progress
                    className="progress progress-primary w-full h-10"
                    value={count}
                    max={challenge.goalCounterUser}
                />

                {/* Team total */}
                <div className="flex justify-between items-end">
                    <span>Team Total</span>
                    <span>
                        <span className="text-2xl font-bold">{challenge.counter}</span>
                        <span className="text-base"> / {challenge.goalCounterChallenge}</span>
                    </span>
                </div>
                <progress
                    className="progress progress-secondary w-full h-5"
                    value={challenge.counter}
                    max={challenge.goalCounterChallenge}
                />

                {/* Time left */}
                <div className="flex justify-between">
                    <span>Time left</span>
                    <span>
                        <span className={`countdown text-bold${hours_left < 2 ? " text-red-600" : ""}`}>
                            <span style={{ "--value": hours_left } as React.CSSProperties}>{hours_left}</span>:
                            <span style={{ "--value": minutes_left } as React.CSSProperties}>{minutes_left}</span>:
                            <span style={{ "--value": seconds_left } as React.CSSProperties}>{seconds_left}</span>
                        </span>
                    </span>
                </div>
                <progress
                    className="progress progress w-full h-5"
                    value={secondsPassedToday}
                    max={secondsInDay}
                />

                {/* Buttons */}
                <div className="flex justify-center gap-1 mt-5 items-center">
                    <button className="btn btn-secondary w-10 h-16 text-xl" onClick={() => dec(10)}>-10</button>
                    <button className="btn btn-secondary w-10 h-16 text-xl" onClick={() => dec(5)}>-5</button>
                    <button className="btn btn-secondary w-20 h-30 text-5xl" onClick={() => dec(1)}>−</button>
                    <button className="btn btn-primary w-20 h-30 text-5xl" onClick={() => inc(1)}>＋</button>
                    <button className="btn btn-primary w-10 h-16 text-xl" onClick={() => inc(5)}>+5</button>
                    <button className="btn btn-primary w-10 h-16 text-xl" onClick={() => inc(10)}>+10</button>
                </div>
            </div>
        </div>
    );
}
