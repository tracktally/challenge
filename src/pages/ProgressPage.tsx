import {useEffect, useState} from 'react'
import type {Challenge} from "../types/domain.ts";
import {useOutletContext} from "react-router-dom";
import {incrementChallengeCounter} from "../firebase/challenge.ts";
import {getUsersOfChallenge, incrementUserCounter, getUserCounter, setGoalReachedAt} from "../firebase/user.ts";
import {useLocalChallenge} from "../hooks/useLocalChallenge.ts";
import {collection, onSnapshot, serverTimestamp} from "firebase/firestore";
import {db} from "../firebase/config.ts";

export default function ProgressPage() {
    const {challenge} = useOutletContext<{ challenge: Challenge }>();
    const { localChallenges, getLocalChallenge, getUserFromLocalChallenge} = useLocalChallenge();
    let localChallenge = getLocalChallenge(challenge.id);

    const [count, setCount] = useState(0)
    const [users, setUsers] = useState([]);

    console.log("Local Challenge: ", localChallenge);
    const myUserId = getUserFromLocalChallenge(challenge.id);
    console.log("My User ID from localChallenge: ", myUserId);

    useEffect(() => {
        async function fetchUsers() {
            if (!challenge) return;
            const usersData = await getUsersOfChallenge(challenge.id);
            setUsers(usersData);
        }
        console.log("Fetching users for challenge:", challenge.id);
        fetchUsers();

    }, [challenge.id]);

    // Update users in real-time
    useEffect(() => {
        if (!challenge) return;
        const usersRef = collection(db, "challenges", challenge.id, "users");
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        });
        return () => unsubscribe();
    }, [challenge]);

    const inc = async () => {
        console.log("inc: ", count)
        incrementChallengeCounter(challenge.id, 1)
        incrementUserCounter(challenge.id, myUserId, 1, challenge.goalCounterUser);

        // If user reached the goal, set the date in Firestore
        if (myCounter + 1 >= challenge.goalCounterUser && !me.goalReachedAt) {
            await setGoalReachedAt(challenge.id, myUserId);
        }
    }
    const dec = async () => {
        if (myCounter < 1) return;
        incrementChallengeCounter(challenge.id, -1);
        incrementUserCounter(challenge.id, myUserId, -1, challenge.goalCounterUser);
    }

    const me = users.find(u => u.id === myUserId);
    const myCounter = me ? me.counter : 0;

    return (
        <>
            {/* <div className="max-w-md mx-auto"> */}
            <div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div className="">
                        <div>
                            <div className="flex justify-between font-bold ">
                                <span>You</span><span>{myCounter} / {challenge.goalCounterUser}</span>
                            </div>
                            <progress className="progress progress-secondary w-full h-10"
                                    value={myCounter}
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
                <div className="card shadow-xl space-y-6">

                    <h2 className="text-lg font-bold text-center">Leaderboard</h2>

                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Progress</th>
                                <th>Completed at</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                [...users]
                                    .sort((a, b) => b.counter - a.counter) // Sort descending by counter
                                    .map((user, idx) => (
                                        <tr key={user.id}>
                                            <th>{idx + 1}</th>
                                            <td><div>
                                                {user.name}<br/>
                                                <div className="text-xs text-gray-500 -mt-1">
                                                    {user.goalReachedAt
                                                        ? (
                                                            "Reached at: " +
                                                            (user.goalReachedAt.toDate
                                                                ? user.goalReachedAt.toDate().toLocaleString()
                                                                : new Date(user.goalReachedAt.seconds * 1000).toLocaleString())
                                                        )
                                                        : (user.counter === 0 ? "Sleeping ..." : "Still going strong ...")}
                                                </div>
                                            </div></td>
                                            <td>
                                                <progress
                                                className={
                                                    "progress w-20 h-2 " +
                                                    (user.counter >= 100 ? "progress-success" : "progress-primary")
                                                }
                                                    value={user.counter}
                                                    max={challenge.goalCounterUser}></progress>
                                                <span className="w-16 inline-block text-right">
                                                    {user.counter} / {challenge.goalCounterUser}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                            }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}