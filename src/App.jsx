import { fenToBoard, indexLetter, isBlackTurn } from "./utils/chess-board";

function App() {
  // Ejemplo de uso con la FEN proporcionada:
  const fen = "r1b1kbnr/ppq2ppp/3pp3/nB6/3PP3/5N2/PPQ2PPP/RNB1K2R b KQkq - 4 8";
  const board = fenToBoard(fen);

  const check = true;
  const blackTurn = isBlackTurn(fen);

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="grid grid-cols-8 grid-rows-8">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isDarkSquare = (rowIndex + colIndex) % 2 === 1;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-24 h-24 text-xl relative ${
                  check &&
                  ((blackTurn && piece === "/pieces/bK.svg") ||
                    (!blackTurn && piece === "/pieces/wK.svg")) &&
                  "bg-check"
                } ${
                  isDarkSquare
                    ? `bg-[rgb(181,136,99)]`
                    : `bg-[rgb(240,217,181)]`
                }`}
              >
                {colIndex === 7 && (
                  <div
                    className={`font-bold absolute top-1 right-1 ${
                      isDarkSquare
                        ? "text-[rgb(240,217,181)]"
                        : "text-[rgb(181,136,99)]"
                    }`}
                  >
                    {8 - rowIndex}
                  </div>
                )}
                {rowIndex === 7 && (
                  <div
                    className={`font-bold absolute bottom-1 left-1 ${
                      isDarkSquare
                        ? "text-[rgb(240,217,181)]"
                        : "text-[rgb(181,136,99)]"
                    }`}
                  >
                    {indexLetter[colIndex]}
                  </div>
                )}
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
