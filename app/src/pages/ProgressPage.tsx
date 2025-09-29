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
  const { challenge, user, addReps, triggerCelebration } = useOutletContext<{
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

  const grouped: Record<string, Activity[]> = {};
  for (const log of logs) {
    const created = log.createdAt as Date;
    const key = dateKey(created);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(log);
  }

  const sortedDays = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const visibleDays =
    view === "today" ? sortedDays.slice(0, 1) : sortedDays;

  return (
    <>
      <Counter
        challenge={challenge}
        user={user}
        addReps={addReps}
        triggerCelebration={triggerCelebration}
      />

      <div className="flex-1 overflow-y-auto p-1 mt-15">
        <h2 className="text-xl text-left font-semibold mb-4">Activity Log</h2>

        {visibleDays.map((dayKey, dayIdx) => {
          const dayLogs = grouped[dayKey];
          const dateObj = new Date(dayKey);

          return (
            <div key={dayKey} className="mb-0">
              <div className="py-2 text-gray-700">{dateLabel(dateObj)}</div>
              <div className="overflow-y-auto rounded-lg border border-base-content/10 bg-base-100">
                <table className="table table-zebra w-full">
                  {dayIdx === 0 && (
                    <thead>
                      <tr className="text-sm text-gray-500 uppercase">
                        <th className="px-4 py-2">When</th>
                        <th className="px-4 py-2">Who</th>
                        <th className="px-4 py-2 text-right">Progress</th>
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {dayLogs.map((log) => {
                      const created = log.createdAt as Date;
                      const isYou = log.userId === user.id;
                      const time = created.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr
                          key={log.id}
                          className={`hover ${isYou ? "bg-yellow-100" : ""}`}
                        >
                          <td className="px-4 py-2 text-gray-600">{time}</td>
                          <td
                            className={`px-4 py-2 ${
                              isYou ? "font-bold text-primary" : ""
                            }`}
                          >
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
          );
        })}

        <button
          type="button"
          className="btn btn-xs btn-ghost"
          onClick={() =>
            setView((prev) =>
              prev === "today" ? "some" : prev === "some" ? "all" : "today"
            )
          }
        >
          {view === "today"
            ? "Show more"
            : view === "some"
            ? "Show all"
            : "Show today"}
        </button>

        <div className="mb-30"></div>
      </div>
    </>
  );
}