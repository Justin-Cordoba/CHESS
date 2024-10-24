// Mapping index to letters for chessboard columns
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

// Converts FEN notation to a 2D board array representation
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

  const rows = fen.split(" ")[0].split("/");
  return rows.map(row => {
    const boardRow = [];
    for (let char of row) {
      if (isNaN(char)) {
        boardRow.push(pieceMap[char]); // Add the piece image path
      } else {
        boardRow.push(...Array(parseInt(char)).fill(null)); // Fill empty squares
      }
    }
    return boardRow;
  });
}

// Determine if it's black's turn based on FEN
export const isBlackTurn = fen => fen.split(" ")[1] === "b";

// Convert algebraic notation to board matrix indices
export function algebraicToIndex(algebraic) {
  const letterToCol = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
  const col = letterToCol[algebraic[0]];
  const row = 8 - parseInt(algebraic[1]); // Convert to zero-indexed row
  return { row, col };
}