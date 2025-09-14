import {useOutletContext} from "react-router-dom";
import type {Challenge} from "../types/domain.ts";

export default function HistoryPage() {
    const { challenge } = useOutletContext<{ challenge: Challenge }>();
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">TODO</h3>

        </div>
    );
}
