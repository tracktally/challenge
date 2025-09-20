import { useState, useEffect, useRef } from "react";
import { logActivity } from "../firebase/activity";
import type { Challenge, User, Activity } from "../types/domain";

export function useBufferedActivity(
    challenge: Challenge | null,
    user: User | null,
    inactivitySec = 10
) {
    const [buffer, setBuffer] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const flushGuard = useRef(0);


    const flush = async () => {
        console.log("flush called");


        setBuffer((prev) => {
            console.log("set buffer called: ", prev);

            if (!challenge || !user || prev === 0) return prev;


            if (flushGuard.current == 0) {
                flushGuard.current = 1;
                const log: Omit<Activity, "id"> = {
                    amount: prev,
                    userId: user.id,
                    userName: user.name,
                    createdAt: new Date(),
                };

                logActivity(challenge.id, log);
            }            

            console.log("return");
            return 0; // reset buffer
        });


    };

    const addReps = (amount: number) => {
        if (!user) return;
        flushGuard.current = 0;

        setBuffer((prev) => Math.max(prev + amount, 0));

        // Reset inactivity timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        console.log("set timeout for:", inactivitySec, "seconds");

        timerRef.current = setTimeout(() => {
            console.log("timeout fired");
            flush();
        }, inactivitySec * 1000);
    };

    return { addReps, buffer, flush };
}