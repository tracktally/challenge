import { useState } from "react";
import type { User, Challenge } from "../types/domain.ts";
import { useOutletContext } from "react-router-dom";

export default function SettingsPage() {
  const { challenge, user } = useOutletContext<{ challenge: Challenge; user: User }>();

  const [username, setUsername] = useState("");
  const [challengeGoal, setChallengeGoal] = useState<number | undefined>();
  const [userGoal, setUserGoal] = useState<number | undefined>();
  const [startDate, setStartDate] = useState<string>(""); // yyyy-mm-dd
  const [intervalHours, setIntervalHours] = useState<number | undefined>();
  const [resetTime, setResetTime] = useState<string>(""); // HH:mm

  const handleSaveChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      username,
      challengeGoal,
      userGoal,
      startDate,
      intervalHours,
      resetTime,
    });
    // TODO: save challenge settings in backend
  };

  const handleResetToday = () => {
    console.log("Resetting today’s counter for", challenge?.id);
    // TODO: reset today counter in backend
  };

  const handleResetAll = () => {
    console.log("Resetting all counters for", challenge?.id);
    // TODO: reset all counters in backend
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          {/* Start Date */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Start Date</span>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>

          {/* Interval in Hours */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Interval (hours)</span>
            </div>
            <input
              type="number"
              value={intervalHours ?? ""}
              onChange={(e) => setIntervalHours(Number(e.target.value))}
              placeholder="e.g. 24"
              className="input input-bordered w-full"
              min={1}
            />
          </label>

          {/* Reset Time of Day */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Reset Time of Day</span>
            </div>
            <input
              type="time"
              value={resetTime}
              onChange={(e) => setResetTime(e.target.value)}
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

      {/* User Settings Card */}
      <form onSubmit={handleSaveChallenge} className="card bg-base-100 card-border">
        <div className="card-body p-4 space-y-3">
          <h2 className="card-title">User Settings</h2>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Name</span>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="User Name"
              className="input input-bordered w-full"
            />
          </label>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </div>
      </form>

      {/* Reset Counters Card */}
      <div className="card bg-base-100 card-border">
        <div className="card-body p-4 space-y-3">
          <h2 className="card-title">Reset Counters</h2>
          <p className="text-sm text-base-content/70">
            Reset progress either for today only, or all time.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={handleResetToday}
              className="btn btn-outline btn-error w-full sm:w-auto"
            >
              Reset Today
            </button>
            <button
              type="button"
              onClick={handleResetAll}
              className="btn btn-outline btn-error w-full sm:w-auto"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
