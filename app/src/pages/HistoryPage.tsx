import { useEffect, useState } from "react";
import {useOutletContext} from "react-router-dom";
import type {Challenge, User} from "../types/domain.ts";
import { db } from "../firebase/config";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function HistoryPage() {
    const { challenge, user } = useOutletContext<{ 
        challenge: Challenge; 
        user: User;
    }>();
    // Read last 7 days from dailyStats
    const [dailyTotals, setDailyTotals] = useState<{date: string; teamTotal: number; userTotal: number}[]>([]);

    useEffect(() => {
        if (!challenge?.id || !user?.id) return;
        const ref = collection(db, "challenges", challenge.id, "dailyStats");
        const q = query(ref, orderBy("date", "desc"), limit(7));
        return onSnapshot(q, (snap) => {
            const items = snap.docs.map((doc) => {
                const data = doc.data() as any;
                const dt = data.date?.toDate?.() ?? new Date(doc.id);
                const label = dt.toLocaleDateString();
                const userTotal = data.users?.[user.id] ?? 0;
                const teamTotal = data.teamTotal ?? 0;
                return { date: label, teamTotal, userTotal };
            });
            setDailyTotals(items);
        });
    }, [challenge?.id, user?.id]);
    
    return (
        <div className="flex-1 overflow-y-auto p-1 mt-15">
            <h2 className="text-xl text-left font-semibold mb-4">History</h2>
            
            <div className="overflow-y-auto rounded-lg border border-base-content/10 bg-base-100">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="text-sm text-gray-500 uppercase">
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2 text-right">Your Total</th>
                            <th className="px-4 py-2 text-right">Team Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyTotals.map((day) => (
                            <tr key={day.date} className="hover">
                                <td className="px-4 py-2 font-semibold">{day.date}</td>
                                <td className="px-4 py-2 text-right font-semibold text-primary">
                                    {day.userTotal}
                                </td>
                                <td className="px-4 py-2 text-right font-semibold text-accent">
                                    {day.teamTotal}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {dailyTotals.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No activity in the last 7 days</p>
            )}
            
            <div className="mb-20"></div>
        </div>
    );
}
