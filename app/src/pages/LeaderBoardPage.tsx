import {useOutletContext} from "react-router-dom";
import type {Challenge, User} from "../types/domain.ts";
import { normalizeDate } from "../firebase/util.ts";
import { useState } from "react";

export default function LeaderBoardPage() {
    const { challenge, users, user } = useOutletContext<{ challenge: Challenge, users: User[], user: User }>();
    const [showAllUsers, setShowAllUsers] = useState(false);
    

    if (!challenge || !user ) return <p>Loading data...</p>;

    const inactivityCutOff = new Date();
    inactivityCutOff.setDate(inactivityCutOff.getDate() - 3);

    return (
        <div className="flex-1 overflow-y-auto p-1 mt-1">
        <h2 className="text-xl text-left font-semibold mb-4">Leaderboard</h2>
        {/* <h3 className="text-lg font-semibold mb-2">Leaderboard</h3> */}
            
            {/* ----------------------------- */}
            {/* Leader Board Table */}
            {/* ----------------------------- */}

            <div className="overflow-y-auto rounded-lg border border-base-content/10 bg-base-100">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr className="text-sm text-gray-500 uppercase">
                                <th>#</th>
                                <th>Name</th>
                                <th className="text-right">Progress</th>
                            </tr>
                    </thead>
                    <tbody>
                    {
                        [...users]
                        .map(u => ({...u, lastActivityAt: normalizeDate(u.lastActivityAt)}))                         
                        .filter(u => showAllUsers  || 
                            (u.lastActivityAt!= null &&
                            u.lastActivityAt >= inactivityCutOff))
                        //    SORT by goalReachedAt (earliest first), then by counter (highest first)
                            .sort((a, b) => {
                                const aTime = a.goalReachedAt
                                    ? (a.goalReachedAt.toDate ? a.goalReachedAt.toDate().getTime() : a.goalReachedAt.seconds * 1000)
                                    : null;
                                const bTime = b.goalReachedAt
                                    ? (b.goalReachedAt.toDate ? b.goalReachedAt.toDate().getTime() : b.goalReachedAt.seconds * 1000)
                                    : null;
                                if (aTime && bTime) {
                                    return aTime - bTime; // earlier time first
                                } else if (aTime && !bTime) {
                                    return -1; // a finished, b not
                                } else if (!aTime && bTime) {
                                    return 1; // b finished, a not
                                } else {
                                    return b.counter - a.counter; // both not finished, sort by counter
                                }
                            })
                            .map((u, idx) => {

                                const isYou = u.id === user.id;

                                    {/* TODO: does not work on PC, only handy */}
                                    return (
                                    <tr key={u.id} className={`hover${isYou ? " bg-yellow-100" : ""} text-xl`}> 
                                        <th>{idx + 1}</th>
                                        <td><div>
                                            <div className={`${isYou ? "font-bold text-primary" : ""}`}>
                                                {isYou ? "You" : u.name}
                                            </div>
                                            <div className="text-xs text-gray-500 -mt-1">
                                                {u.goalReachedAt
                                                    ? (() => {
                                                        const d = u.goalReachedAt.toDate
                                                            ? u.goalReachedAt.toDate()
                                                            : new Date(u.goalReachedAt.seconds * 1000);
                                                        return "✅ " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                                                    })()
                                                    : (u.counter === 0 ? "😴 Sleeping ..." : "🏋️ Going strong ...")}
                                            </div>
                                        </div></td>
                                        <td className="text-right align-right">
                                            <div className="flex flex-col items-end w-full inline-block">
                                                <div className="text-xs -mb-3 ">
                                                    <span>
                                                        <span className="text-2xl font-bold">{u.counter}</span>
                                                        <span className="text-xs"> / {challenge.goalCounterUser}</span>
                                                    </span>
                                                </div>
                                                <progress
                                                    className={
                                                        "progress h-2 " +
                                                        (u.counter >= 100 ? "progress-success" : "progress-primary")
                                                    }
                                                    value={u.counter}
                                                    max={challenge.goalCounterUser}
                                                ></progress>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                    );
                            })
                    }

                    </tbody>
                </table>
                <button
                    type="button"
                    className="btn btn-xs btn-ghost"
                    onClick={() => setShowAllUsers(s => !s)}
                    aria-pressed={showAllUsers}
                    >
                    {showAllUsers ? "Hide inactive" : "Show all users"}
                    </button>

            </div>
            {/* padding at the bottom */}
            <div className="mb-20"></div>
        </div>
    );
}