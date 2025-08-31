import {useState} from 'react'
import type {Challenge} from "../types/domain.ts";
import {useOutletContext} from "react-router-dom";
import {incrementChallengeCounter} from "../firebase/challenge.ts";

export default function ProgressPage() {
    const {challenge} = useOutletContext<{ challenge: Challenge }>();

    const [count, setCount] = useState(0)

    const inc = () => {
        console.log("inc: ", count)
        incrementChallengeCounter(challenge.id, 1)
        setCount(count + 1)
    }
    const dec = () => {
        if (count < 1) return;
        setCount(count - 1);
        incrementChallengeCounter(challenge.id, -1);
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
                            <td>Cy Ganderton</td>
                            <td>{count} / {challenge.goalCounter}</td>
                        </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}