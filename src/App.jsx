import { algebraicToIndex, fenToBoard, isBlackTurn, isKingInCheck } from "./utils/chess-board";
import { useState, useCallback } from "react";

const squareSize = 48; // Tamaño de cada cuadrado en el tablero

// Componente que representa un cuadrado de ajedrez
function ChessSquare({
  rowIndex,
  colIndex,
  piece,
  onMouseDown,
  onMouseUp,
  isKingChecked,
  isFromSquare,
  isToSquare,
  indexLetter,
}) {
  // Determina el color del cuadrado (oscuro o claro)
  const squareColor = (rowIndex + colIndex) % 2 === 1
    ? "bg-[rgb(181,136,99)]"
    : "bg-[rgb(240,217,181)]";

  // Aplica un fondo destacado si es el cuadrado de origen o destino
  const highlightClass = isFromSquare || isToSquare ? "bg-box-color" : "";

  return (
    <div
      className={`w-12 h-12 relative ${squareColor} ${highlightClass} ${
        isKingChecked ? "bg-check" : ""
      } cursor-pointer`}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(e, rowIndex, colIndex);
      }}
      onMouseUp={() => onMouseUp(rowIndex, colIndex)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onMouseUp(rowIndex, colIndex)}
    >
      {/* Muestra el número en el borde derecho del tablero */}
      {colIndex === 7 && (
        <div
          className={`font-bold absolute top-1 right-1 text-xs ${
            (rowIndex + colIndex) % 2 === 1
              ? "text-[rgb(240,217,181)]"
              : "text-[rgb(181,136,99)]"
          }`}
        >
          {8 - rowIndex}
        </div>
      )}
      {/* Muestra la letra en el borde inferior del tablero */}
      {rowIndex === 7 && (
        <div
          className={`font-bold absolute bottom-1 left-1 text-xs ${
            (rowIndex + colIndex) % 2 === 1
              ? "text-[rgb(240,217,181)]"
              : "text-[rgb(181,136,99)]"
          }`}
        >
          {indexLetter[colIndex]}
        </div>
      )}
      {/* Muestra la imagen de la pieza si existe */}
      {piece && (
        <img src={piece} alt={`Chess piece ${piece}`} className="w-full h-full" />
      )}
    </div>
  );
}

// Componente para superponer flechas de análisis en el tablero
function AnalysisArrows({ arrows, strokeColor = "rgba(84, 126, 55)", arrowColor = "rgba(84, 126, 55)", strokeWidth = 8, arrowSize = 29.5, lineReduction = 5 }) {
  return (
    <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
      <defs>
        <marker
          id="arrowhead"
          markerWidth={arrowSize}
          markerHeight={arrowSize}
          refX={arrowSize * 0.7}
          refY={arrowSize / 2}
          orient="auto"
        >
          <polygon points={`3 0, ${arrowSize} ${arrowSize / 2}, 3 ${arrowSize}`} fill={arrowColor} />
        </marker>
      </defs>
      {arrows.map((arrow, index) => {
        // Calcula el inicio y fin ajustado de la flecha
        const start = toPixel(arrow.start.row, arrow.start.col);
        const end = toPixel(arrow.end.row, arrow.end.col);
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const adjustedStart = { x: start.x + (dx / length) * lineReduction, y: start.y + (dy / length) * lineReduction };
        const adjustedEnd = { x: end.x - (dx / length) * lineReduction, y: end.y - (dy / length) * lineReduction };

        return (
          <g key={index}>
            {/* Línea de la flecha */}
            <path
              d={`M ${adjustedStart.x},${adjustedStart.y} L ${adjustedEnd.x},${adjustedEnd.y}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
            {/* Punta de la flecha */}
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

// Calcula coordenadas de píxel para dibujar las flechas según el tamaño del tablero
const toPixel = (row, col) => ({
  x: col * squareSize + squareSize / 2,
  y: row * squareSize + squareSize / 2,
});

// Componente principal de la aplicación
function ChessBoard() {
  const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const board = fenToBoard(fen);
  const [arrows, setArrows] = useState([]);
  const [startSquare, setStartSquare] = useState(null);
  const blackTurn = isBlackTurn(fen);
  const lastMove = ""; // Último movimiento en notación algebraica
  const indexLetter = ["a", "b", "c", "d", "e", "f", "g", "h"]; // Letras para las columnas

  // Convierto la notación del último movimiento a coordenadas del tablero
  const [from, to] = lastMove
    ? [algebraicToIndex(lastMove.slice(0, 2)), algebraicToIndex(lastMove.slice(2))]
    : [null, null];

  // Maneja el clic inicial (mouse abajo) en un cuadrado
  const handleMouseDown = useCallback((event, rowIndex, colIndex) => {
    if (event.button === 0) setArrows([]); // Borra las flechas con clic izquierdo
    else setStartSquare({ row: rowIndex, col: colIndex }); // Almacena la posición inicial de la flecha con clic derecho
  }, []);

  // Maneja el final del clic (mouse arriba) en un cuadrado para dibujar la flecha
  const handleMouseUp = useCallback((rowIndex, colIndex) => {
    if (startSquare) {
      setArrows((prevArrows) => [
        ...prevArrows,
        { start: startSquare, end: { row: rowIndex, col: colIndex } },
      ]);
      setStartSquare(null);
    }
  }, [startSquare]);

  return (
    <div onContextMenu={(e) => e.preventDefault()} className="flex flex-col justify-center h-screen items-center">
      <div className="relative">
        <div className="grid grid-cols-8 grid-rows-8">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isKingChecked = isKingInCheck(false, blackTurn, piece);
              const isFromSquare = from && from.row === rowIndex && from.col === colIndex;
              const isToSquare = to && to.row === rowIndex && to.col === colIndex;

              return (
                <ChessSquare
                  key={`${rowIndex}-${colIndex}`}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  piece={piece}
                  isKingChecked={isKingChecked}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  isFromSquare={isFromSquare}
                  isToSquare={isToSquare}
                  indexLetter={indexLetter}
                />
              );
            })
          )}
        </div>
        <AnalysisArrows arrows={arrows} />
      </div>
    </div>
  );
}

export default ChessBoard;
