import {useState} from "react";
import type {Challenge} from "../types/domain.ts";
import {Link, useNavigate, useOutletContext, useParams} from "react-router-dom";
import {createUser} from "../firebase/user.ts";
import {useChallengeByAnyId} from "../hooks/useChallenge.ts";
import {type LocalChallenge, useLocalChallenge} from "../hooks/useLocalChallenge.ts";

export function CreateUserPage() {
    // var {id} = useParams();
    const { challenge } = useOutletContext<{ challenge: Challenge }>();
    // const challenge = useChallengeByAnyId(id ?? null);
    console.log(challenge);
    console.log("create new user");

    if (!challenge) return "Not found...";

    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const {localChallenges, saveLocalChallenge, getLocalChallenge} = useLocalChallenge()

    async function handleSave() {
        if (!name.trim()) return;

        setIsSaving(true);
        try {
            const user = await createUser(challenge.id, name);
            console.log(user);
            let c = getLocalChallenge(challenge.id);
            if (!c) {
                c = {
                    id: challenge.id,
                    name: challenge.name,
                    userUrl: challenge.userUrl,
                } as LocalChallenge;
                saveLocalChallenge(c);
            }
            c.userId = user.id;
            saveLocalChallenge(c);
            console.log("saveduser id: ", user.id, "in challenge", challenge.id);


            navigate("/", {
                state: {
                    banner: `Created user ${name} in ${challenge.name}`
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
                        <h2 className="card-title">Join {challenge.name}</h2>
                        <p className="text text-base-content/100">
                            Enter your name to join challenge "{challenge.name}".
                        </p>
                        <input
                            type="text"
                            className="input input-bordered w-full mt-2"
                            value={name}
                            placeholder="Your name"
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
                    </div>
                </div>
            </div>
        </main>
    );
}
