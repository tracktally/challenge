import { useOutletContext } from "react-router-dom";
import type { Challenge, User } from "../types/domain.ts";
import { normalizeDate } from "../firebase/util.ts";
import { useState, useMemo } from "react";

export default function LeaderBoardPage() {
  const { challenge, users, user } = useOutletContext<{
    challenge: Challenge;
    users: User[];
    user: User;
  }>();
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "progress" | "strikes" | "reps"
  >("progress");



  const inactivityCutOff = new Date();
  inactivityCutOff.setDate(inactivityCutOff.getDate() - 2);

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
        (u.lastActivityAt != null && u.lastActivityAt >= inactivityCutOff)
    );

    // Sorting depends on tab
    if (activeTab === "progress") {
      arr.sort((a, b) => {
        const aTime = a.goalReachedAt?.getTime() ?? null;
        const bTime = b.goalReachedAt?.getTime() ?? null;    
        if (aTime && bTime) return aTime - bTime;
        if (aTime && !bTime) return -1;
        if (!aTime && bTime) return 1;
        return b.counter - a.counter;
      });
    } else if (activeTab === "strikes") {
      arr.sort((a, b) => {
        const fullDiff = (b.fullStrike ?? 0) - (a.fullStrike ?? 0);
        if (fullDiff !== 0) return fullDiff;
        return (b.partialStrike ?? 0) - (a.partialStrike ?? 0);
      });
    } else if (activeTab === "reps") {
      arr.sort((a, b) => ((b.totalCounter ?? 0) + b.counter) 
        - ((a.totalCounter ?? 0) + a.counter ));
    }

    return arr;
  }, [users, showAllUsers, inactivityCutOff, activeTab]);

    if (!challenge || !user || !users) return <p>Loading data...</p>;

  return (
    <div className="flex-1 overflow-y-auto p-1 mt-1">
      <h2 className="text-xl text-left font-semibold mb-4">Your Stats</h2>

      {/* ----------------------------- */}
      {/* Summary stats with unified colors + tooltips */}
      {/* ----------------------------- */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div
          className="stat shadow place-items-center p-2 tooltip tooltip-right"
          data-tip="Days you reached half of goal"
        >
          <div className="stat-title flex items-center gap-1 text-sm">
            <span>🌗</span> <span>Partial</span>
          </div>
          <div className="stat-value">
            <span className="badge badge-primary text-lg px-3">
              {user.partialStrike ?? 0}
            </span>
          </div>
        </div>

        <div
          className="stat shadow place-items-center p-2 tooltip"
          data-tip="Days you hit your full goal"
        >
          <div className="stat-title flex items-center gap-1 text-sm">
            <span>💯</span> <span>Strike</span>
          </div>
          <div className="stat-value">
            <span className="badge badge-success text-lg px-3">
              {user.fullStrike ?? 0}
            </span>
          </div>
        </div>

        <div
          className="stat shadow place-items-center p-2 tooltip tooltip-left"
          data-tip="Total reps completed"
        >
          <div className="stat-title flex items-center gap-1 text-sm">
            <span>🏋️</span> <span>Reps</span>
          </div>
          <div className="stat-value">
            <span className="badge badge-accent text-lg px-3">
              {(user.totalCounter ?? 0) + user.counter}
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* Leaderboard Tabs */}
      {/* ----------------------------- */}
      <h2 className="text-xl text-left font-semibold mb-4">Leaderboard</h2>
      <div className="tabs tabs-box mb-4">
        <input
          type="radio"
          name="leaderboard-tabs"
          className="tab"
          aria-label="Progress"
          checked={activeTab === "progress"}
          onChange={() => setActiveTab("progress")}
        />
        <input
          type="radio"
          name="leaderboard-tabs"
          className="tab"
          aria-label="Strikes"
          checked={activeTab === "strikes"}
          onChange={() => setActiveTab("strikes")}
        />
        <input
          type="radio"
          name="leaderboard-tabs"
          className="tab"
          aria-label="Reps"
          checked={activeTab === "reps"}
          onChange={() => setActiveTab("reps")}
        />
      </div>

      {/* ----------------------------- */}
      {/* Leader Board Table */}
      {/* ----------------------------- */}
      <div className="overflow-y-auto rounded-lg border border-base-content/10 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-sm text-gray-500 uppercase">
              <th className="text-center">#</th>
              <th>Name</th>
              {activeTab === "progress" && (
                <th className="text-right">Progress</th>
              )}
              {activeTab === "strikes" && (
                <th className="text-right">Strikes</th>
              )}
              {activeTab === "reps" && (
                <th className="text-right">All Time Reps</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, idx) => {
              const isYou = u.id === user.id;
              return (
                <tr
                  key={u.id}
                  className={`hover ${isYou ? "bg-primary/10" : ""} text-xl`}
                >
                  {/* Rank */}
                  <th className="text-center align-middle">
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
                  <td>
                    <div>
                      <div
                        className={`${isYou ? "font-bold text-primary" : ""}`}
                      >
                        {isYou ? "You" : u.name}
                      </div>
                      {activeTab === "progress" && u.goalReachedAt && (
                        <div className="text-xs text-gray-500 -mt-1">
                          {(() => {
                            const d = u.goalReachedAt;
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
                    </div>
                  </td>

                  {/* Tab-specific cell */}
                  {activeTab === "progress" && (
                    <td className="text-right align-right">
                      <div className="flex flex-col items-end space-y-1">
                        <div className="text-xs">
                          <span className="font-bold">{u.counter}</span>
                          <span> / {challenge.goalCounterUser}</span>
                        </div>
                        <progress
                          className={
                            "progress h-2 w-28 " +
                            (u.counter >= challenge.goalCounterUser
                              ? "progress-success"
                              : "progress-primary")
                          }
                          value={u.counter}
                          max={challenge.goalCounterUser}
                        ></progress>
                      </div>
                    </td>
                  )}

                  {activeTab === "strikes" && (
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <span className="badge badge-primary text-sm">
                          🌗 {u.partialStrike ?? 0}
                        </span>
                        <span className="badge badge-success text-sm">
                          💯 {u.fullStrike ?? 0}
                        </span>
                      </div>
                    </td>
                  )}

                  {activeTab === "reps" && (
                    <td className="text-right">
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
