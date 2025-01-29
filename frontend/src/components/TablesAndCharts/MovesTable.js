import { handleLeadingZeroes } from "../../functions/handlers";

export default function MovesTable({ method, moves, courseTotal=null }) {
    return (
        <div className="general-table">
            <table>
                <thead>
                    <tr>
                        <th className="general-table-cell-spacing">{ method }</th>
                        <th className="general-table-cell-spacing">Name</th>
                        <th className="general-table-cell-spacing">Type</th>
                        <th className="general-table-cell-spacing">Power</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from(moves, move => (
                            <tr>
                                <td className="general-table-data-spacing">
                                    { courseTotal ? handleLeadingZeroes(move.method_value, courseTotal) : move.method_value }
                                </td>
                                <td className="general-table-data-spacing">{ move.name }</td>
                                <td className="general-table-data-spacing">{ move.type }</td>
                                <td className="general-table-data-spacing">{ move.power ? move.power : "-" }</td>
                            </tr>
                        )) 
                    }
                </tbody>
            </table>
        </div>
    )
}