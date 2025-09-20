import { useState } from "react";
import { addChallenge } from "../firebase/challenge.ts";

import { Link, useNavigate } from "react-router-dom";
import { useLocalChallenges } from "../hooks/useLocalChallenges.ts";


export function CreateChallengePage() {
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const { addLocalChallenge } = useLocalChallenges();
    const navigate = useNavigate();

    async function handleSave() {
        if (!name.trim()) return;

        setIsSaving(true);
        try {
            const challenge = await addChallenge({
                name: name.trim(),
                goalCounterChallenge: 100,
                goalCounterUser: 100,
                interval_hrs: 24,
                counter: 0,
            });
            addLocalChallenge({
                challengeId: challenge.id,
                name: name,
                userId: "",
                publicUuid: challenge.publicUuid,
                adminUuid: challenge.adminUuid,
                userName: "",
            });

            navigate("/", {
                state: {
                    banner: `Challenge ${name} created`
                }
            });
            setName("");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <main className="flex flex-col min-h-screen bg-base-200">
            <div className="navbar bg-base-200 shadow px-4 ">
                <div className="flex-none">
                    <Link to="/"
                        className="btn btn-ghost btn-sm normal-case text-base-content/80 ">
                        ← Back
                    </Link>
                </div>
            </div>
            <div className="flex">
                <div className="card w-full bg-base-200">
                    <div className="card-body">
                        <h2 className="card-title">New Challenge</h2>
                        <p className="text text-base-content/100">
                            Enter a name for your challenge.
                        </p>
                        <input
                            type="text"
                            className="input input-bordered w-full mt-2"
                            value={name}
                             onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSave();
                                    }
                                }}
                            autoFocus={true}
                            placeholder="Challenge name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="card-actions justify-end mt-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                               
                                className="btn btn-primary"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
