import {useOutletContext} from "react-router-dom";
import type {Challenge} from "../types/domain.ts";

export default function SettingsPage() {
    const {challenge} = useOutletContext<{ challenge: Challenge }>();

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="mb-6">
                <p>Change stuff</p>
            </div>
        </div>
    );
}
