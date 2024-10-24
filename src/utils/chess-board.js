export const indexLetter = {
  0: "a",
  1: "b",
  2: "c",
  3: "d",
  4: "e",
  5: "f",
  6: "g",
  7: "h",
};

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

  const rows = fen.split(" ")[0].split("/"); // Separamos solo la parte del tablero de la FEN
  const board = [];

  rows.forEach((row) => {
    const boardRow = [];
    for (let char of row) {
      if (isNaN(char)) {
        boardRow.push(pieceMap[char]); // Convertimos la pieza al path correspondiente
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          boardRow.push(null); // Añadimos 'null' para casillas vacías
        }
      }
    }
    board.push(boardRow);
  });

  return board;
}

export const isBlackTurn = (fen) => {
  const fenParts = fen.split(" ");
  return fenParts[1] === "b"; // Si es 'b', es turno del negro
};
