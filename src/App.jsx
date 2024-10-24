import { fenToBoard, indexLetter, isBlackTurn, algebraicToIndex } from "./utils/chess-board";

function App() {
  const fen = "rnbqkbnr/ppppp2p/5p2/6pQ/4P3/P7/1PPP1PPP/RNB1KBNR b KQkq - 1 3";
  const lastMove = "c2h7"; // Last move in algebraic notation
  const board = fenToBoard(fen);
  const blackTurn = isBlackTurn(fen);
  const isCheck = true; // Example state of check

  // Extract from and to squares from last move
  const [from, to] = lastMove ? [algebraicToIndex(lastMove.slice(0, 2)), algebraicToIndex(lastMove.slice(2))] : [null, null];

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="grid grid-cols-8 grid-rows-8">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isDarkSquare = (rowIndex + colIndex) % 2 === 1;
            const isFromSquare = from && from.row === rowIndex && from.col === colIndex;
            const isToSquare = to && to.row === rowIndex && to.col === colIndex;
            const isCheckSquare =
              isCheck &&
              ((blackTurn && piece === "/pieces/bK.svg") ||
                (!blackTurn && piece === "/pieces/wK.svg"));

            // Define square color and styles
            const squareClasses = [
              "w-24 h-24 text-xl relative",
              isCheckSquare ? "bg-check" : "",
              isFromSquare || isToSquare ? "bg-box-color" : "",
              isDarkSquare ? "bg-[rgb(181,136,99)]" : "bg-[rgb(240,217,181)]"
            ].join(" ");

            // Row and column labels for chessboard
            const columnLabel = rowIndex === 7 && (
              <div className={`font-bold absolute bottom-1 left-1 ${isDarkSquare ? "text-[rgb(240,217,181)]" : "text-[rgb(181,136,99)]"}`}>
                {indexLetter[colIndex]}
              </div>
            );
            const rowLabel = colIndex === 7 && (
              <div className={`font-bold absolute top-1 right-1 ${isDarkSquare ? "text-[rgb(240,217,181)]" : "text-[rgb(181,136,99)]"}`}>
                {8 - rowIndex}
              </div>
            );

            return (
              <div key={`${rowIndex}-${colIndex}`} className={squareClasses}>
                {rowLabel}
                {columnLabel}
                {piece && <img src={piece} alt="" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;