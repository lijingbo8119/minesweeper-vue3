import {Square, SquareStatus, SquareType} from "@/model/square";

interface MatrixStatus {
  rowsLength: number;
  colsLength: number;
  squaresCount: number;
  openedSquaresCount: number;
  markedSquaresCount: number;
  bombsCount: number;
  markedBombsCount: number;
  succeed: boolean;
}

function openAll(matrix: Array<Array<Square>>): void {
  matrix.forEach(row => {
    row.forEach(square => {
      if (square.getStatus() !== SquareStatus.closed) {
        return;
      }
      if (square.getType() === SquareType.bomb) {
        square.mark();
        return;
      }
      if (square.getType() === SquareType.normal) {
        square.open(matrix);
        return;
      }
    })
  })
}

export function getMatrixStatus(matrix: Array<Array<Square>>): MatrixStatus {
  const status: MatrixStatus = {
    rowsLength: matrix.length,
    colsLength: matrix[0].length,
    squaresCount: matrix.length * matrix[0].length,
    openedSquaresCount: 0,
    markedSquaresCount: 0,
    bombsCount: 0,
    markedBombsCount: 0,
    succeed: false,
  }

  matrix.forEach(row => {
    row.forEach(square => {
      if (square.getStatus() === SquareStatus.opened) {
        status.openedSquaresCount++;
      }
      if (square.getType() === SquareType.bomb) {
        status.bombsCount++;
      }
      if (square.getType() === SquareType.bomb && square.getStatus() === SquareStatus.markedBomb) {
        status.markedBombsCount++;
      }
      if (square.getType() === SquareType.normal && square.getStatus() === SquareStatus.markedBomb) {
        status.markedSquaresCount++;
      }
    })
  })

  if (status.markedBombsCount === status.bombsCount) {
    status.succeed = true;
  }

  if (status.succeed && status.openedSquaresCount + status.markedBombsCount < status.squaresCount) {
    openAll(matrix);
    return getMatrixStatus(matrix);
  }

  if (status.squaresCount - status.openedSquaresCount === status.bombsCount - status.markedBombsCount) {
    openAll(matrix);
    return getMatrixStatus(matrix);
  }

  return status;
}
