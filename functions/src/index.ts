/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";


// import { onSchedule } from "firebase-functions/v2/scheduler";
// import { onRequest } from "firebase-functions/v2/https";

import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { Request, Response } from "express";  // <-- add this for typing



admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const dailyRollupAndReset = onSchedule({ schedule: "0 0 * * *", timeZone: "UTC" }, async () => {

// XXX: No cron jobs in free plan. Do cron ourselves instead
async function runDailyRollupAndReset() {
  // Daily rollup and reset of counters
  const db = admin.firestore();
  const challengesSnap = await db.collection("challenges").get();

  // Compute date key for the previous day (since we run at 00:00)
  const now = new Date();
  const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  prev.setUTCDate(prev.getUTCDate() - 1);
  const yyyy = prev.getUTCFullYear();
  const mm = String(prev.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(prev.getUTCDate()).padStart(2, "0");
  const dateId = `${yyyy}-${mm}-${dd}`;

  for (const chDoc of challengesSnap.docs) {
    const challengeId = chDoc.id;
    const challengeData = chDoc.data() as any;
    const teamTotal = challengeData?.counter ?? 0;

    const dailyRef = db.doc(`challenges/${challengeId}/dailyStats/${dateId}`);
    const exists = await dailyRef.get();
    if (exists.exists) {
      logger.warn(`dailyStats already exists for ${challengeId} ${dateId}; skipping reset to avoid double-processing.`);
      continue;
    }

    // Collect user counters
    const usersSnap = await db.collection(`challenges/${challengeId}/users`).get();
    const usersTotals: Record<string, number> = {};
    usersSnap.forEach((u) => {
      const data = u.data() as any;
      usersTotals[u.id] = data?.counter ?? 0;
    });

    // Write daily rollup
    await dailyRef.set({
      date: admin.firestore.Timestamp.fromDate(prev),
      teamTotal,
      users: usersTotals,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Reset counters in batches
    const batch = db.batch();
    batch.update(chDoc.ref, { counter: 0 });
    for (const u of usersSnap.docs) {
      batch.update(u.ref, { counter: 0 });
    }
    await batch.commit();
  }
};


export const dailyRollupAndResetHttp = functions.https.onRequest(
  async (req: Request, res: Response): Promise<void> => {
    await runDailyRollupAndReset();
    res.send("Reset done");
  }
);
