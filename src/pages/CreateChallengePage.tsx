import {useState} from "react";
import {createChallenge} from "../firebase/challenge";
import type {Challenge} from "../types/domain.ts";
import {Link, useNavigate} from "react-router-dom";
import {useLocalChallenge} from "../hooks/useLocalChallenge.ts";

export function CreateChallengePage() {
    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const {saveLocalChallenge} = useLocalChallenge();
    const navigate = useNavigate();

    async function handleSave() {
        if (!name.trim()) return;

        setIsSaving(true);
        try {
            const challenge: Challenge = await createChallenge(name);
            saveLocalChallenge({
                id: challenge.id,
                name: challenge.name,
                adminUrl: challenge.adminUrl,
                userUrl: challenge.userUrl,
            });

            navigate("/", {
                state: {
                    banner: `Challenge ${challenge.name} created`
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
