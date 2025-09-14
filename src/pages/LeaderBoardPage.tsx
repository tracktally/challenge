import {useOutletContext} from "react-router-dom";
import type {Challenge} from "../types/domain.ts";

export default function LeaderBoardPage() {
    const { challenge } = useOutletContext<{ challenge: Challenge }>();
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">TODO</h3>
            <p></p>
        </div>
    );
}