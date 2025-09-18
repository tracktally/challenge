import {useOutletContext} from "react-router-dom";
import type {Challenge, User} from "../types/domain.ts";

export default function LeaderBoardPage() {
    const { challenge, users, user } = useOutletContext<{ challenge: Challenge, users: User[], user: User }>();

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Leaderboard</h3>
            
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

                                    return (
                                    <tr key={u.id} className={`hover${isYou ? " bg-yellow-100" : ""}`}> {/* TODO: does not work on PC, only handy */}
                                        <th>{idx + 1}</th>
                                        <td><div>
                                            <div className={`${isYou ? "font-bold text-primary" : ""}`}>
                                                {isYou ? "You" : u.name}
                                            </div>
                                            <div className="text-xs text-gray-500 -mt-1 w-20">
                                                {u.goalReachedAt
                                                    ? (() => {
                                                        const d = u.goalReachedAt.toDate
                                                            ? u.goalReachedAt.toDate()
                                                            : new Date(u.goalReachedAt.seconds * 1000);
                                                        return "✅ " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                                                    })()
                                                    : (u.counter === 0 ? "Sleeping ..." : "Still going strong ...")}
                                            </div>
                                        </div></td>
                                        <td className="text-right align-right">
                                            <div className="flex items-center gap-2 w-full">
                                                <progress
                                                    className={
                                                        "progress h-2 flex-grow " +
                                                        (u.counter >= 100 ? "progress-success" : "progress-primary")
                                                    }
                                                    value={u.counter}
                                                    max={challenge.goalCounterUser}
                                                ></progress>
                                                <span className="inline-block text-right w-25">
                                                    {u.counter} / {challenge.goalCounterUser}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                            })
                    }

                    </tbody>
                </table>
            </div>

        </div>
    );
}