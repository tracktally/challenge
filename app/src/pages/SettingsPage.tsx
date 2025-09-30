import { useState } from "react";
import type { User, Challenge } from "../types/domain.ts";
import { useOutletContext } from "react-router-dom";
import { updateChallenge } from "../firebase/challenge.ts";
import ThemePicker from "./ThemePicker.tsx";

export default function SettingsPage() {
  const { challenge, user, challengeUrl } = useOutletContext<{
    challenge: Challenge; user: User; challengeUrl: string;
  }>();

  const [name, setName] = useState(challenge?.name ?? "");
  const [challengeGoal, setChallengeGoal]
    = useState<number | undefined>(challenge.goalCounterChallenge);
  const [userGoal, setUserGoal] = useState<number | undefined>(challenge.goalCounterUser);
  const [resetTime, setResetTime] = useState<string>(challenge?.resetTimeStr ?? "");
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);
  const [cutOffDays, setCutOffDays] = useState<number | undefined>(challenge.cutOffDays ?? 3);

  if (!user || !challenge) return <div>Loading...</div>;

  const shareUrl = `${window.location.origin}/#${challengeUrl}`;

  const handleSaveChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    updateChallenge(challenge.id, {
      name: name,
      goalCounterChallenge: challengeGoal,
      goalCounterUser: userGoal,
      resetTimeStr: resetTime,
      cutOffDays: cutOffDays,
    });
  };

  async function copyToClipboard(text: string, label: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedMsg(`${label} copied`);
      setTimeout(() => setCopiedMsg(null), 1600);
    } catch {
      setCopiedMsg(`Could not copy ${label}`);
      setTimeout(() => setCopiedMsg(null), 1600);
    }
  }

  function makeCopyHandlers(value: string, label: string) {
    return {
      onClick: (e: React.MouseEvent<HTMLInputElement>) => {
        (e.currentTarget as HTMLInputElement).select();
        copyToClipboard(value, label);
      },
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select();
        copyToClipboard(value, label);
      },
    };
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Toast (DaisyUI) */}
      {copiedMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success">
            <span>{copiedMsg}</span>
          </div>
        </div>
      )}

      {/* Challenge Settings Card */}
      <form onSubmit={handleSaveChallenge} className="card bg-base-100 card-border">
        <div className="card-body p-4 space-y-3">
          <h2 className="card-title">Challenge Settings</h2>

          {/* Challenge Name */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Name</span></div>
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
            <div className="label"><span className="label-text">Challenge Goal</span></div>
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
            <div className="label"><span className="label-text">User Goal</span></div>
            <input
              type="number"
              value={userGoal ?? ""}
              onChange={(e) => setUserGoal(Number(e.target.value))}
              placeholder="e.g. 10"
              className="input input-bordered w-full"
              min={1}
            />
          </label>

           {/* Cut Off */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Cut Off Days</span></div>
            <input
              type="number"
              value={cutOffDays}
              onChange={(e) => setCutOffDays(Number(e.target.value))}
              placeholder="e.g. 3"
              className="input input-bordered w-full"
              min={0}
            />
          </label>

          {/* Reset Time of Day */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Reset Time</span></div>
            <input
              type="time"
              value={resetTime}
              onChange={(e) => setResetTime(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>

          {/* Invite Link (read-only, copy on click/focus) */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Invite Link</span></div>
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="input input-bordered w-full cursor-pointer select-all"
              {...makeCopyHandlers(shareUrl, "Invite link")}
            />
            <div className="label">
              <span className="label-text-alt">Click or focus to copy</span>
            </div>
          </label>

          {/* Challenge ID (read-only, copy on click/focus) */}
          <label className="form-control w-full">
            <div className="label"><span className="label-text">Challenge ID</span></div>
            <input
              type="text"
              value={challenge.id}
              readOnly
              className="input input-bordered w-full cursor-pointer select-all"
              {...makeCopyHandlers(challenge.id, "Challenge ID")}
            />
            <div className="label">
              <span className="label-text-alt">Click or focus to copy</span>
            </div>
          </label>

          {/* Save Button */}
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">Update</button>
          </div>
        </div>
      </form>

      <div className="card bg-base-100 card-border">
        <h2 className="card-title p-4">Theme</h2>
        <div className="px-4 pb-4">
          <ThemePicker />
        </div>
      </div>

      <div className="mb-30"></div>
    </div>
  );
}
