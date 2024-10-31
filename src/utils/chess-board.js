// Letras de las columnas en el tablero
export const indexLetter = ["a", "b", "c", "d", "e", "f", "g", "h"];

// Convierte una notación algebraica (como "e2") en índices de fila y columna
export function algebraicToIndex(algebraic) {
  return {
    row: 8 - parseInt(algebraic[1]), // Convierte a índice de fila
    col: indexLetter.indexOf(algebraic[0]), // Usa indexLetter para obtener la columna
  };
}

// Convierte notación FEN a una representación de tablero en 2D con rutas de imagen para cada pieza
export function fenToBoard(fen) {
  const pieceMap = {
    r: "/pieces/bR.svg",
    n: "/pieces/bN.svg",
    b: "/pieces/bB.svg",
    q: "/pieces/bQ.svg",
    k: "/pieces/bK.svg",
    p: "/pieces/bP.svg",
    R: "/pieces/wR.svg",
    N: "/pieces/wN.svg",
    B: "/pieces/wB.svg",
    Q: "/pieces/wQ.svg",
    K: "/pieces/wK.svg",
    P: "/pieces/wP.svg",
  };

  // Solo la primera parte del FEN para la disposición del tablero
  return fen
    .split(" ")[0]
    .split("/")
    .map((row) =>
      [...row].flatMap((char) =>
        isNaN(char) ? pieceMap[char] : Array(parseInt(char)).fill(null)
      )
    );
}

// Determina si es el turno de las negras según el FEN
export const isBlackTurn = (fen) => fen.includes(" b ");

// Verifica si el rey del color correspondiente está en jaque
export function isKingInCheck(check, blackTurn, piece) {
  return check && piece === (blackTurn ? "/pieces/bK.svg" : "/pieces/wK.svg");
}
