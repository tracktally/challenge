import { useOutletContext } from "react-router-dom";
import { useActivities } from "../hooks/useActivities.ts";
import type { User, Challenge, Activity } from "../types/domain";

export default function ProgressPage() {
  const { challenge, user } = useOutletContext<{
    challenge: Challenge;
    user: User;
    users: User[];
    addReps: (amount: number) => void;
  }>();

  const logs = useActivities(challenge.id, 20);

  return (
    <>
      {/* Activity Log */}
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
                  <tr key={log.id} className={`hover ${isYou ? "bg-yellow-100" : ""}`}>
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
    </>
  );
}