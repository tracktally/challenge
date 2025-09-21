import { useState } from "react";
import type { User, Challenge } from "../types/domain.ts";
import { useOutletContext } from "react-router-dom";
import { updateChallenge } from "../firebase/challenge.ts";
import { updateUser } from "../firebase/user.ts";

export default function SettingsPage() {
  const { challenge, user } = useOutletContext<{ challenge: Challenge; user: User }>();

  const [name, setName] = useState(challenge?.name ?? "" );
  const [username, setUsername] = useState(user?.name ?? "");
  const [challengeGoal, setChallengeGoal] = useState<number | undefined>( challenge.goalCounterChallenge);
  const [userGoal, setUserGoal] = useState<number | undefined>(challenge.goalCounterUser);
  const [intervalHours, setIntervalHours] = useState<number | undefined>(challenge.interval_hrs);
  const [resetTime, setResetTime] = useState<string>(challenge?.resetTimeStr ?? ""); // HH:mm
  const [resetDate, setResetDate] = useState<Date|null>(challenge.lastResetAt); // yyyy-mm-dd
  
  function toValidDate(input: string | number | Date): Date | null {
    const d = new Date(input);
    if (isNaN(d.getTime())) {
      return null; // invalid date
    }
    return d;
  }

  if (!user || !challenge) {
  return <div>Loading...</div>;
}

  const handleSaveChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      name,
      challengeGoal,
      userGoal,
      resetDate,
      intervalHours,
      resetTime,
    });

    updateChallenge(challenge.id, {
      name: name,
      goalCounterChallenge: challengeGoal,
      goalCounterUser: userGoal,
      // interval_hrs: intervalHours,
      resetTimeStr: resetTime,
    }); 
  };


  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Challenge Settings Card */}
      <form onSubmit={handleSaveChallenge} className="card bg-base-100 card-border">
        <div className="card-body p-4 space-y-3">
          <h2 className="card-title">Challenge Settings</h2>

          {/* Challenge Name */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Challenge Name"
              className="input input-bordered w-full"
            />
          </label>

          {/* Challenge Goal */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Challenge Goal</span>
            </div>
            <input
              type="number"
              value={challengeGoal ?? ""}
              onChange={(e) => setChallengeGoal(Number(e.target.value))}
              placeholder="e.g. 100"
              className="input input-bordered w-full"
              min={1}
            />
          </label>

          {/* User Goal */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">User Goal</span>
            </div>
            <input
              type="number"
              value={userGoal ?? ""}
              onChange={(e) => setUserGoal(Number(e.target.value))}
              placeholder="e.g. 10"
              className="input input-bordered w-full"
              min={1}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Last Reset Date</span>
            </div>
            <input
              type="text"
              disabled={true}
              value={resetDate ? resetDate.toString() : ""}
              className="input input-bordered w-full"
            />
          </label>

        {/* Reset Time of Day */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Reset Time</span>
            </div>
            <input
              type="time"
              value={resetTime}
              onChange={(e) => setResetTime(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>

          
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Invite Link</span>
            </div>
            <input
              type="text"
              value={window.location.origin + "/challenge/" + challenge.publicUuid}
              className="input input-bordered w-full"
            />
          </label>

 

          {/* Save Button */}
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
