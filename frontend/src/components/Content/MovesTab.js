import MovesTable from "../TablesAndCharts/MovesTable";

export default function MovesTab({ levelMoves, courseMoves, courseTotal }) {
    return (
        <div className="col-gap-container bottom-barrier">
            <div className="col-gap-container bottom-barrier">
                <h3 className="no-margin-container">Level Up Moves</h3>
                <div className="max-width-container top-border">
                    { levelMoves ? 
                            <MovesTable method="Level" moves={ levelMoves } />
                        :
                            <h4 className="text-align-center top-barrier">No data recorded</h4>
                    }
                </div>
            </div>
            <div className="col-gap-container">
                <h3 className="no-margin-container">Course Moves</h3>
                <div className="max-width-container top-border">
                    { courseMoves ? 
                            <MovesTable method="Course" moves={ courseMoves } courseTotal={ courseTotal } />
                        :
                        <h4 className="text-align-center top-barrier">No data recorded</h4>
                    }
                </div>
            </div>
        </div>
    );
}