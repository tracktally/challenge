import { useEffect, useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import type { Challenge, User } from "../types/domain.ts";
import { db } from "../firebase/config";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function HistoryPage() {
  const { challenge, user, users } = useOutletContext<{
    challenge: Challenge;
    user: User;
    users: User[];
  }>();

  const [dailyTotals, setDailyTotals] = useState<
    {
      day: string;
      date: Date;
      teamTotal: number;
      userTotal: number;
      goalCounterUser: number;
      goalCounterChallenge: number;
      isToday: boolean;
      users?: Record<string, number>;
    }[]
  >([]);

  const historyLimit = 60;

  useEffect(() => {
    // TODO: Refactor this into its own use hook and firebase function
    if (!challenge?.id || !user?.id) return;
    const ref = collection(db, "challenges", challenge.id, "dailyStats");
    const q = query(ref, orderBy("date", "desc"), limit(historyLimit));
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((doc) => {
        const data = doc.data() as any;
        const dt = data.date?.toDate?.() ?? new Date(doc.id);
        const todayKey = new Date().toISOString().slice(0, 10);
        const key = dt.toISOString().slice(0, 10);
        const label = `${dt.getDate()}.${dt.getMonth() + 1}`;
        const userTotal = data.users?.[user.id] ?? 0;
        const teamTotal = data.teamTotal ?? 0;
        const goalCounterUser = data.goalCounterUser ?? challenge.goalCounterUser;
        const goalCounterChallenge =
          data.goalCounterChallenge ?? challenge.goalCounterChallenge;
        return {
          day: label,
          date: dt,
          teamTotal,
          userTotal,
          goalCounterUser,
          goalCounterChallenge,
          isToday: key === todayKey,
          users: data.users ?? {},
        };
      });
      setDailyTotals(items);
    });
  }, [challenge?.id, user?.id]);

  const chartData = useMemo(() => {
    if (dailyTotals.length === 0 || !users || !user) return [];

    const N = historyLimit;
    const lastN = [...dailyTotals].slice(0, N).reverse();

    const totalsByUser: Record<string, number> = {};
    lastN.forEach((day) => {
      Object.entries(day.users ?? {}).forEach(([uid, val]) => {
        totalsByUser[uid] = (totalsByUser[uid] ?? 0) + (val as number);
      });
    });

    const M = 5;
    const topUsers = Object.entries(totalsByUser)
      .sort((a, b) => b[1] - a[1])
      .slice(0, M)
      .map(([uid]) => uid);
    if (!topUsers.includes(user.id)) {
      topUsers.push(user.id);
    }

    return lastN.map((day) => {
      const entry: any = { day: day.day };
      topUsers.forEach((uid) => {
        entry[uid] = day.users?.[uid] ?? 0;
      });
      return entry;
    });
  }, [dailyTotals, users, user]);

  if (!challenge || !user) return <p>Loading data...</p>;

  const colorPalette = [
    "#2563eb", // You
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088FE",
    "#FF00FF",
  ];
  
  const totalsFromHistory: Record<string, number> = {};
  dailyTotals.forEach((day) => {
    Object.entries(day.users ?? {}).forEach(([uid, val]) => {
      totalsFromHistory[uid] = (totalsFromHistory[uid] ?? 0) + (val as number);
    });
  });

  // Filter out users with no counters at all
  const otherUsers = [...users]
    .filter((u) => u.id !== user.id && (totalsFromHistory[u.id] ?? 0) > 0)
    .sort((a, b) => (totalsFromHistory[b.id] ?? 0) - (totalsFromHistory[a.id] ?? 0));

  return (
    <div className="flex-1 overflow-y-auto p-1 mt-1">
      <h2 className="text-xl text-left font-semibold mb-4">History</h2>

      {/* Chart */}
      <div className="divider my-4 opacity-70">
        Activity Top Users (last {historyLimit} days)
      </div>
      <div className="w-full overflow-x-auto mb-6 p-2">
        <div style={{ width: chartData.length * 60, height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ right: 60 }}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === user.id) {
                    return [value, "You"];
                  }
                  const u = users.find((us) => us.id === name);
                  return [value, u?.name ?? name];
                }}
              />
              <Legend
                formatter={(value) => {
                  if (value === user.id) {
                    return (
                      <span style={{ fontWeight: "bold", color: "#2563eb" }}>
                        You
                      </span>
                    );
                  }
                  const u = users.find((us) => us.id === value);
                  return u?.name ?? value;
                }}
              />
              {Object.keys(chartData[0] ?? {})
                .filter((k) => k !== "day")
                .map((uid, idx) => {
                  const u = users.find((us) => us.id === uid);
                  const isMe = uid === user.id;
                  return (
                    <Line
                      key={uid}
                      type="monotone"
                      dataKey={uid}
                      stroke={isMe ? "#2563eb" : colorPalette[idx % colorPalette.length]}
                      strokeWidth={isMe ? 4 : 2}
                      strokeDasharray={isMe ? "" : "3 3"}
                      dot={isMe}
                      name={isMe ? "You" : u?.name ?? uid}
                    />
                  );
                })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="divider my-4 opacity-70">Daily Totals</div>
      <div className="overflow-x-auto mt-4 rounded-lg border border-base-content/10 bg-base-100">
        <table className="table table-zebra w-full min-w-max">
          <thead>
            <tr className="text-sm text-gray-500 uppercase">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2 text-right text-primary">You</th>
              <th className="px-4 py-2 text-right text-accent">Team</th>
              {otherUsers.map((u) => (
                <th key={u.id} className="px-4 py-2 text-right">
                  {u.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dailyTotals.map((day) => (
              <tr key={day.date.toISOString()} className="hover">
                <td className="px-4 py-2 font-semibold whitespace-nowrap">
                  {`${day.date.getDate()}.${day.date.getMonth() + 1}.${day.date.getFullYear()}`}
                </td>

                {/* You */}
                <td className="px-4 py-2 text-right text-primary font-semibold">
                  <div className="flex flex-col items-end">
                    <span>
                      {day.userTotal} / {day.goalCounterUser}
                      {day.userTotal >= day.goalCounterUser && <span>🔥</span>}
                    </span>
                    <progress
                      className={`progress h-2 w-24 ${
                        day.userTotal >= day.goalCounterUser
                          ? "progress-success"
                          : "progress-primary"
                      }`}
                      value={day.userTotal}
                      max={day.goalCounterUser}
                    />
                  </div>
                </td>

                {/* Team */}
                <td className="px-4 py-2 text-right font-semibold text-accent">
                  <div className="flex flex-col items-end">
                    <span>
                      {day.teamTotal} / {day.goalCounterChallenge}
                      {day.teamTotal >= day.goalCounterChallenge && <span>✅</span>}
                    </span>
                    <progress
                      className={`progress h-2 w-24 ${
                        day.teamTotal >= day.goalCounterChallenge
                          ? "progress-success"
                          : "progress-accent"
                      }`}
                      value={day.teamTotal}
                      max={day.goalCounterChallenge}
                    />
                  </div>
                </td>

                {/* Other Users */}
                {otherUsers.map((u) => {
                  const val = day.users?.[u.id] ?? 0;
                  const goal = day.goalCounterUser;
                  return (
                    <td key={u.id} className="px-4 py-2 text-right">
                      <div className="flex flex-col items-end">
                        <span>
                          {val} / {goal}
                          {val >= goal && <span>🔥</span>}
                        </span>
                        <progress
                          className={`progress h-2 w-24 ${
                            val >= goal ? "progress-success" : "progress-primary"
                          }`}
                          value={val}
                          max={goal}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dailyTotals.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          📉 No activity in the last {historyLimit} days
        </p>
      )}

      <div className="mb-20"></div>
    </div>
  );
}
