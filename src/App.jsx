import { fenToBoard, isBlackTurn, isKingInCheck } from "./utils/chess-board";
import { useState, useCallback } from "react";

const squareSize = 48; // Tamaño ajustable

// Componente que representa un cuadrado de ajedrez
function ChessSquare({
  rowIndex,
  colIndex,
  piece,
  onMouseDown,
  onMouseUp,
  isKingChecked,
}) {
  const squareColor =
    (rowIndex + colIndex) % 2 === 1
      ? "bg-[rgb(181,136,99)]"
      : "bg-[rgb(240,217,181)]";

  return (
    <div
      className={`w-12 h-12 ${squareColor} ${
        isKingChecked ? "bg-check" : ""
      } cursor-pointer`}
      onMouseDown={(e) => {
        e.preventDefault(); // Evita la selección de texto
        onMouseDown(e, rowIndex, colIndex);
      }}
      onMouseUp={() => onMouseUp(rowIndex, colIndex)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onMouseUp(rowIndex, colIndex)}
    >
      {piece && (
        <img
          src={piece}
          alt={`Chess piece ${piece}`}
          className="w-full h-full"
        />
      )}
    </div>
  );
}

// Componente para superponer las flechas en el tablero
function AnalysisArrows({
  arrows,
  strokeColor = "rgba(84, 126, 55)",
  arrowColor = "rgba(84, 126, 55)",
  strokeWidth = 8,
  arrowSize = 29.5,
  lineReduction = 5,
}) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth={arrowSize}
          markerHeight={arrowSize}
          refX={arrowSize * 0.7}
          refY={arrowSize / 2}
          orient="auto"
        >
          <polygon
            points={`3 0, ${arrowSize} ${arrowSize / 2}, 3 ${arrowSize}`}
            fill={arrowColor}
          />
        </marker>
      </defs>
      {arrows.map((arrow, index) => {
        const start = toPixel(arrow.start.row, arrow.start.col);
        const end = toPixel(arrow.end.row, arrow.end.col);
        const dx = end.x - start.x,
          dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const adjustedStart = {
          x: start.x + (dx / length) * lineReduction,
          y: start.y + (dy / length) * lineReduction,
        };
        const adjustedEnd = {
          x: end.x - (dx / length) * lineReduction,
          y: end.y - (dy / length) * lineReduction,
        };

        return (
          <g key={index}>
            <path
              d={`M ${adjustedStart.x},${adjustedStart.y} L ${adjustedEnd.x},${adjustedEnd.y}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M ${adjustedStart.x},${adjustedStart.y} L ${adjustedEnd.x},${adjustedEnd.y}`}
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          </g>
        );
      })}
    </svg>
  );
}

// Calcula coordenadas de píxel para dibujar la flecha
const toPixel = (row, col) => ({
  x: col * squareSize + squareSize / 2,
  y: row * squareSize + squareSize / 2,
});

// Componente principal de la aplicación
function ChessBoard() {
  const fen = "rnbqkbnr/ppppp2p/5p2/6pQ/4P3/P7/1PPP1PPP/RNB1KBNR w KQkq - 1 3";
  const board = fenToBoard(fen);
  const [arrows, setArrows] = useState([]);
  const [startSquare, setStartSquare] = useState(null);
  const check = true;
  const blackTurn = isBlackTurn(fen);

  const handleMouseDown = useCallback((event, rowIndex, colIndex) => {
    event.button === 0
      ? setArrows([])
      : setStartSquare({ row: rowIndex, col: colIndex });
  }, []);

  const handleMouseUp = useCallback(
    (rowIndex, colIndex) => {
      if (startSquare) {
        setArrows((prevArrows) => [
          ...prevArrows,
          { start: startSquare, end: { row: rowIndex, col: colIndex } },
        ]);
        setStartSquare(null);
      }
    },
    [startSquare]
  );

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col justify-center h-screen items-center"
    >
      <div className="relative">
        <div className="grid grid-cols-8 grid-rows-8">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                piece={piece}
                isKingChecked={isKingInCheck(check, blackTurn, piece)}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              />
            ))
          )}
        </div>
        <AnalysisArrows arrows={arrows} />
      </div>
    </div>
  );
}

export default ChessBoard;
