import { useState, useEffect } from 'react'
import { incrementChallenge } from "../firebase/user.ts";
import type { User, Challenge } from "../types/domain";
import { useOutletContext } from "react-router-dom";


export default function ProgressPage() {
    const { challenge, user, users } = useOutletContext<{ challenge: Challenge, user: User, users: User[] }>();

    const [count, setCount] = useState(user?.counter ?? 0);
    const [countChallenge, setCountChallenge] = useState(challenge?.counter ?? 0);

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
        setCountChallenge(count + 1);
        incrementChallenge(challenge.id, user.id, 1)

    }
    const dec = () => {
        if (count < 1) return;
        setCountChallenge(count - 1);
        setCount(count - 1);
        incrementChallenge(challenge.id, user.id, -1)
    }


    if (!user) {
        return <p>Loading user...</p>;
    }

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="">
                    <div>
                        <div className="flex justify-between font-bold ">
                            <span>You</span><span>{count} / {challenge.goalCounterUser}</span>
                        </div>
                        <progress className="progress progress-secondary w-full h-10"
                            value={count}
                            max={challenge.goalCounterUser}></progress>
                        <div className="flex justify-between ">
                            <span>Team Total</span><span>{challenge.counter} / {challenge.goalCounterChallenge}</span>
                        </div>
                        <progress className="progress progress-primary w-full h-4"
                            value={challenge.counter}
                            max={challenge.goalCounterChallenge}></progress>

                        <div className="flex justify-center gap-8 mt-6">
                            <button className="btn btn-secondary w-40 h-25 text-5xl"
                                onClick={dec}
                            >−
                            </button>
                            <button className="btn btn-primary w-40 h-25 text-5xl"
                                onClick={inc}
                            >＋
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card shadow-xl p-4 space-y-6">

                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>1</th>
                                <td>{user.name}</td>
                                <td>{count} / {challenge.goalCounterUser}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}