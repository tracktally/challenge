import { useOutletContext } from "react-router-dom";
import type { Challenge, User } from "../types/domain.ts";
import { normalizeDate, sortUserByProgress } from "../firebase/util.ts";
import { useState, useMemo } from "react";

export default function LeaderBoardPage() {
  const { challenge, users, user } = useOutletContext<{
    challenge: Challenge;
    users: User[];
    user: User;
  }>();

  const [showAllUsers, setShowAllUsers] = useState(false);
  const [activeTab, setActiveTab] = useState<"progress" | "streaks" | "reps">(
    "progress"
  );

  const inactivityCutOff = new Date();
  inactivityCutOff.setDate(
    inactivityCutOff.getDate() - (challenge?.cutOffDays ?? 3)
  );

  const filteredUsers = useMemo(() => {
    let arr = [...users].map((u) => ({
      ...u,
      lastActivityAt: normalizeDate(u.lastActivityAt),
      goalReachedAt: normalizeDate(u.goalReachedAt),
      goalPartialReachedAt: normalizeDate(u.goalPartialReachedAt),
    }));

    arr = arr.filter(
      (u) =>
        showAllUsers ||
        (u.lastActivityAt != null && u.lastActivityAt > inactivityCutOff)
    );

    if (activeTab === "progress") {
      arr.sort((a, b) => sortUserByProgress(a, b));
    } else if (activeTab === "streaks") {
      arr.sort((a, b) => {
        const fullDiff = (b.fullStreak ?? 0) - (a.fullStreak ?? 0);
        if (fullDiff !== 0) return fullDiff;
        return (b.partialStreak ?? 0) - (a.partialStreak ?? 0);
      });
    } else if (activeTab === "reps") {
      arr.sort(
        (a, b) =>
          (b.totalCounter ?? 0) + b.counter - ((a.totalCounter ?? 0) + a.counter)
      );
    }

    return arr;
  }, [users, showAllUsers, inactivityCutOff, activeTab]);

  if (!challenge || !user || !users) return <p>Loading data...</p>;

  return (
    <div className="flex-1 overflow-y-auto p-1 mt-0">
      {/* ----------------------------- */}
      {/* Your Stats */}
      {/* ----------------------------- */}
      <h2 className="text-xl text-left font-semibold mb-2">Leaderboard</h2>
      <div className="divider -mt-1 opacity-70">You</div>

      <div className="grid grid-cols-3 gap-3 mb-2">
        <div className="flex flex-col items-center justify-center p-2 bg-base-200 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-primary">
            {user.partialStreak ?? 0}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            🌗 Partial
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-base-200 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-success">
            {user.fullStreak ?? 0}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            🔥 Streak
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-base-200 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-accent">
            {(user.totalCounter ?? 0) + user.counter}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            🏋️ Total Reps
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Group Stats */}
      {/* ----------------------------- */}
      <div className="divider my-4 opacity-70">Team</div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="flex flex-col items-center justify-center p-2 bg-base-200 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-primary">
            {challenge.partialStreak ?? 0}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            🌗 Partial
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-base-200 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-success">
            {challenge.fullStreak ?? 0}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            🔥 Streak
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-base-200 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-accent">
            {(challenge.totalCounter ?? 0) + challenge.counter}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            🏋️ Total Reps
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Leaderboard Tabs */}
      {/* ----------------------------- */}
      <div className="divider my-4 opacity-70">Leaderboard</div>

      <div className="tabs tabs-boxed mb-4">
        <a
          className={`tab ${activeTab === "progress" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("progress")}
        >
          Progress
        </a>
        <a
          className={`tab ${activeTab === "streaks" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("streaks")}
        >
          Streaks
        </a>
        <a
          className={`tab ${activeTab === "reps" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("reps")}
        >
          Reps
        </a>
      </div>

      {/* ----------------------------- */}
      {/* Leader Board Table */}
      {/* ----------------------------- */}
      <div className="overflow-y-auto rounded-lg border border-base-content/10 bg-base-100">
        <table className="table table-zebra w-full">
          <tbody>
            {filteredUsers.map((u, idx) => {
              const isYou = u.id === user.id;
              // flash recently active users
              const now = Date.now();
              const lastActivity = u.lastActivityAt?.getTime?.() ?? 0;
              const flashPeriod = 5 * 60 * 1000; // 2 mins
              const isRecentlyActive = (now - lastActivity < flashPeriod);
              return (
                <tr
                  key={u.id}
                  className={`hover text-lg
                    ${isYou ? "bg-primary/10" : ""}
                    ${isRecentlyActive && !isYou ? "animate-bg-pulse !bg-primary/10" : ""} `}
                >
                  {/* Medal / Rank */}
                  <th className="text-center align-middle text-lg">
                    <div className="flex justify-center items-center">
                      {idx === 0
                        ? "🥇"
                        : idx === 1
                        ? "🥈"
                        : idx === 2
                        ? "🥉"
                        : idx + 1}
                    </div>
                  </th>

                  {/* Name */}
                  <td className="px-2 py-1">
                    <div className={`${isYou ? "font-bold text-primary" : ""}`}>
                      {isYou ? "You" : u.name}
                    </div>
                    {activeTab === "progress" && u.goalReachedAt && (
                      <div className="text-xs text-gray-500 -mt-0.5">
                        {(() => {
                          const d = u.goalReachedAt as Date;
                          return (
                            "✅ " +
                            d.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })
                          );
                        })()}
                      </div>
                    )}
                  </td>

                  {/* Progress Tab */}
                  {activeTab === "progress" && (
                    <td className="text-right align-right px-2 py-1">
                      <div className="flex flex-col items-end space-y-1">
                        <div className="text-xs">
                          <span className="font-bold">{u.counter}</span>
                          <span> / {challenge.goalCounterUser}</span>
                        </div>
                        <progress
                          className={
                            "progress h-2 w-28 " +
                            (u.counter >= challenge.goalCounterUser ? "progress-success" : 
                              (u.counter >= challenge.goalCounterUser / 2 ? "progress-primary"
                              : "progress-warning"))
                          }
                          value={u.counter}
                          max={challenge.goalCounterUser}
                        ></progress>
                      </div>
                    </td>
                  )}

                  {/* Streaks Tab */}
                  {activeTab === "streaks" && (
                    <td className="text-right px-2 py-1">
                      <div className="flex gap-2 justify-end">
                        <span className="flex items-center gap-0.5 badge bg-green-100 text-green-700 border-none px-1 py-0">
                                <span className="text-xs">🔥</span>
                                <span className="text-[0.65rem] text-gray-600">
                                  {u.fullStreak ?? 0}
                                </span>
                              </span>

                          <span className="flex items-center gap-0.5 badge bg-yellow-100 text-yellow-700 border-none px-1 py-0">
                                <span className="text-xs">🌗</span>
                                <span className="text-[0.65rem] text-gray-600">
                                  {u.partialStreak ?? 0}
                                </span>
                          </span>
                      </div>
                    </td>
                  )}

                  {/* Reps Tab */}
                  {activeTab === "reps" && (
                    <td className="text-right px-2 py-1">
                      <span className="badge badge-accent text-sm px-3">
                        {(u.totalCounter ?? 0) + u.counter}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-xs btn-ghost"
          onClick={() => setShowAllUsers((s) => !s)}
          aria-pressed={showAllUsers}
        >
          {showAllUsers ? "Hide inactive" : "Show all users"}
        </button>
      </div>

      <div className="mb-20"></div>
    </div>
  );
}

