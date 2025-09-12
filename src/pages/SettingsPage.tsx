import {useOutletContext} from "react-router-dom";
import type {Challenge} from "../types/domain.ts";
import {useLocalChallenge} from "../hooks/useLocalChallenge";
import {Button} from "@headlessui/react";
import { findChallengeDocId, updateChallenge } from "../firebase/challenge.ts";

export default function SettingsPage() {
    const {challenge} = useOutletContext<{ challenge: Challenge }>();
    const { editLocalChallenge } = useLocalChallenge();

    async function handleEditChallenge() {
        const newName = prompt("New challenge name:", challenge.name);
        console.log("New Name entered: ", newName);
        if (!newName) return;
        const docId = await findChallengeDocId(challenge.adminUrl);
        if (docId) {
            console.log("Found docId:", docId);
            await updateChallenge(docId, { name: newName });
            await editLocalChallenge(challenge.id, { name: newName });
        }
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="mb-6">

                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditChallenge();
                    }}
                    className="btn btn-sm btn-outline px-1 mx-1"
                >
                    Edit Challenge Name
                </Button>

            </div>
        </div>
    );
}
