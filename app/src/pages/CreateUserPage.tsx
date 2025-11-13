import { useEffect, useState } from "react";
import type { Challenge, UserAuth } from "../types/domain.ts";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { addUser } from "../firebase/user.ts";
import { useLocalChallenges } from "../hooks/useLocalChallenges.ts";
import type { LocalChallenge } from "../hooks/useLocalChallenges.ts";
import {
  auth,
  linkGoogleAccount,
  linkAppleAccount
} from "../firebase/config.ts";
import { addUserAuth, getUserAuth } from "../firebase/userauth.ts";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export function CreateUserPage() {
  const { challenge } = useOutletContext<{ challenge: Challenge }>();
  const navigate = useNavigate();

  const {
    addLocalChallenge,
    getChallenge,
    updateLocalChallenge,
  } = useLocalChallenges();

  const userName =
    auth.currentUser?.displayName ||
    auth.currentUser?.providerData?.[0]?.displayName ||
    "";

  const [restored, setRestored] = useState(false);
  const [name, setName] = useState(userName);
  const [isSaving, setIsSaving] = useState(false);

  if (!challenge) return "Not found...";

  useEffect(() => {
    async function tryRestore() {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const authData = await getUserAuth(challenge.id, uid);
      if (authData != null) {
        console.log("Restoring user from auth:", authData);

        addLocalChallenge({
          challengeId: challenge.id,
          name: challenge.name,
          userId: authData.userId,
          userName: authData.userName,
          url: "",
        });

        setRestored(true);
        navigate("/", {
          state: {
            banner: `Welcome back ${authData.userName}! Enter ${challenge.name} now.`,
          },
        });
      }
    }

    tryRestore();
  }, [challenge.id, addLocalChallenge, navigate]);

  async function handleSave() {
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const user = await addUser(challenge.id, { name, counter: 0 });

      const id = auth.currentUser?.uid;
      if (!id) throw new Error("No auth user id");

      console.log("Creating user auth with id:", id);
      await addUserAuth(challenge.id, id, {
        userName: name,
        userId: user.id,
        provider: "google",
      } as UserAuth);

      const local = getChallenge(challenge.id);
      if (local) {
        updateLocalChallenge(challenge.id, {
          ...local,
          userId: user.id,
          userName: name,
        });
      } else {
        addLocalChallenge({
          challengeId: challenge.id,
          name: challenge.name,
          userId: user.id,
          userName: name,
          url: "",
        });
      }

      navigate("/", {
        state: { banner: `Created user ${name} in ${challenge.name}` },
      });
      setName("");
    } finally {
      setIsSaving(false);
    }
  }

  if (restored) return null;

  const isGoogleUser = auth.currentUser?.providerData?.some(
    (p) => p.providerId === "google.com"
  );

  return (
    <main className="flex flex-col min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-200 shadow px-4">
        <div className="flex-none">
          <Link
            to="/"
            className="btn btn-ghost btn-sm normal-case text-base-content/80"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Main card */}
      <div className="flex">
        <div className="card w-full bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Join {challenge.name}</h2>

            <p className="text-base-content/100">
              Enter your name to join challenge "{challenge.name}".
            </p>

            <input
              type="text"
              autoFocus
              value={name}
              placeholder="Your name"
              className="input input-bordered w-full mt-2"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="card-actions justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-primary"
              >
                {isSaving ? "Joining..." : "Join"}
              </button>
            </div>

            <div className="divider">or</div>

            {/* Google  Login */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
              <button
                className={`btn w-full sm:w-auto gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 ${
                  isGoogleUser ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={() => !isGoogleUser && linkGoogleAccount()}
                disabled={isGoogleUser}
              >
                <FcGoogle className="w-5 h-5" />
                {isGoogleUser
                  ? "Google account linked"
                  : "Continue with Google"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
