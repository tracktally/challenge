import { useState } from "react";
import type { Challenge } from "../types/domain.ts";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { addUser } from "../firebase/user.ts";
import { useLocalChallenges } from "../hooks/useLocalChallenges.ts";
import type { LocalChallenge } from "../hooks/useLocalChallenges.ts";



export function CreateUserPage() {
    const { challenge } = useOutletContext<{ challenge: Challenge }>();
    console.log(challenge);
    console.log("create new user");

    if (!challenge) return "Not found...";


    const [name, setName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const { localChallenges,
        addLocalChallenge,
        removeLocalChallenge,
        getChallenge,
        updateLocalChallenge } = useLocalChallenges()



    async function handleSave() {
        if (!name.trim()) return;

        setIsSaving(true);
        try {
            const user = await addUser(challenge.id, {
                name: name,
                counter: 0
            });
            console.log("Created user in database, ", user);

            let c = getChallenge(challenge.id);
            console.log("fetching challenge in local storage. got: ", c);
            if (c != null) {
                let _c: LocalChallenge = c;
                _c.userName = name;
                _c.userId = user.id;
                updateLocalChallenge(challenge.id, _c);
            } else {
                console.log("storing challenge new");
                addLocalChallenge({
                    challengeId: challenge.id,
                    name: challenge.name,
                    userId: user.id,
                    userName: name,
                    publicUuid: challenge.publicUuid, // todo
                    adminUuid: challenge.adminUuid,
                    url: ""
                });
            }


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
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSave();
                                }
                            }}
                            autoFocus={true}
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
