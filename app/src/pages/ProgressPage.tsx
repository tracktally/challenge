import { useOutletContext } from "react-router-dom";
import { useActivities } from "../hooks/useActivities.ts";
import type { User, Challenge, Activity } from "../types/domain";
import Counter from "./Counter.tsx";
import { useState } from "react";

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function dateLabel(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type ActivityView = "today" | "some" | "all";

export default function ProgressPage() {
  const { challenge, user, users, addReps, triggerCelebration } =
    useOutletContext<{
      challenge: Challenge;
      user: User;
      users: User[];
      addReps: (amount: number) => void;
      triggerCelebration: (message: string, timeout: number) => void;
    }>();

  const [view, setView] = useState<ActivityView>("today");

  const limit = view === "today" ? 300 : view === "some" ? 500 : 2000;
  const logs = useActivities(challenge.id, limit);

  if (!challenge || !user) return <p>Loading data...</p>;

  // Group logs by day
  const grouped: Record<string, Activity[]> = {};
  for (const log of logs) {
    const created = log.createdAt as Date;
    const key = dateKey(created);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(log);
  }

  const sortedDays = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const visibleDays = view === "today" ? sortedDays.slice(0, 1) : sortedDays;

  // Build trophy map for today's top 3 (based on user.counter)
  let trophyMap: Record<string, string> = {};
  const todayKey = dateKey(new Date());
  const rankedUsers = [...users].sort(
    (a, b) => (b.counter ?? 0) - (a.counter ?? 0)
  );
  rankedUsers.forEach((u, idx) => {
    if (idx === 0) trophyMap[u.id] = "🥇";
    else if (idx === 1) trophyMap[u.id] = "🥈";
    else if (idx === 2) trophyMap[u.id] = "🥉";
  });

  return (
    <>
      {/* Counter on top */}
      <Counter
        challenge={challenge}
        user={user}
        addReps={addReps}
        triggerCelebration={triggerCelebration}
      />

      <div className="flex-1 overflow-y-auto p-1 mt-10">
        {/* Divider style like leaderboard */}
        <div className="divider opacity-70 mb-4">Activity Log</div>

        {/* Tabs for view switching */}
        <div className="tabs tabs-boxed mb-4">
          <a
            className={`tab ${view === "today" ? "tab-active" : ""}`}
            onClick={() => setView("today")}
          >
            Today
          </a>
          <a
            className={`tab ${view === "some" ? "tab-active" : ""}`}
            onClick={() => setView("some")}
          >
            Recent
          </a>
          <a
            className={`tab ${view === "all" ? "tab-active" : ""}`}
            onClick={() => setView("all")}
          >
            All
          </a>
        </div>

        {/* Logs grouped by day */}
        {visibleDays.map((dayKey) => {
          const dayLogs = grouped[dayKey];
          const dateObj = new Date(dayKey);
          const isToday = dayKey === todayKey;

          // Track which users already got a trophy/streak badge
          const shownTrophy: Record<string, boolean> = {};
          const shownStreak: Record<string, boolean> = {};

          return (
            <div key={dayKey} className="mb-6">
              {/* Date header */}
              <div className="flex items-center gap-2 mb-2 font-medium text-gray-700">
                {dateLabel(dateObj)}
                {isToday && (
                  <span className="badge badge-primary badge-sm">Today</span>
                )}
              </div>

              {/* Same wrapper style as leaderboard table */}
              <div className="overflow-y-auto rounded-lg border border-base-content/10 bg-base-100">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="text-sm text-gray-500 uppercase">
                      <th className="px-4 py-2">When</th>
                      <th className="px-4 py-2">Who</th>
                      <th className="px-4 py-2 text-right">Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayLogs.map((log) => {
                      const created = log.createdAt as Date;
                      const isYou = log.userId === user.id;
                      const time = created.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      // Trophy: only once per user today
                      let trophy: string | null = null;
                      if (
                        isToday &&
                        trophyMap[log.userId] &&
                        !shownTrophy[log.userId]
                      ) {
                        trophy = trophyMap[log.userId];
                        shownTrophy[log.userId] = true;
                      }

                      // Streak badge: only once per user today, show only the higher one
                      let streakBadge: JSX.Element | null = null;
                      if (isToday && !shownStreak[log.userId]) {
                        const u = users.find((uu) => uu.id === log.userId);
                        if (u) {
                          if (u.fullStreak && u.fullStreak >= 0) {
                            streakBadge = (
                              <span className="flex items-center gap-0.5 badge bg-green-100 text-green-700 border-none px-1 py-0">
                                <span className="text-xs">🔥</span>
                                <span className="text-[0.65rem] text-gray-600">
                                  {u.fullStreak}
                                </span>
                              </span>
                            );
                            shownStreak[log.userId] = true;
                          } else if (u.partialStreak && u.partialStreak >= 0) {
                            streakBadge = (
                              <span className="flex items-center gap-0.5 badge bg-yellow-100 text-yellow-700 border-none px-1 py-0">
                                <span className="text-xs">🌗</span>
                                <span className="text-[0.65rem] text-gray-600">
                                  {u.partialStreak}
                                </span>
                              </span>
                            );
                            shownStreak[log.userId] = true;
                          }
                        }
                      }

                      return (
                        <tr
                          key={log.id}
                          className={`hover ${isYou ? "bg-primary/10" : ""}`}
                        >
                          <td className="px-4 py-2 text-gray-600">{time}</td>
                          <td
                            className={`px-4 py-2 flex items-center gap-2 ${
                              isYou ? "font-bold text-primary" : ""
                            }`}
                          >
                            {isYou ? "You" : log.userName}
                            {trophy && <span>{trophy}</span>}
                            {streakBadge}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold text-accent">
                            🏋️ +{log.amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        <div className="mb-20"></div>
      </div>
    </>
  );
}
