import {Coordinate} from "@/model/interface";

export enum SquareType {
  normal,
  bomb,
}

export enum SquareStatus {
  closed,
  opened,
  exploded,
  markedBomb,
  markedBombWrong,
}

export interface SquareParam {
  coordinate: Coordinate;
  type: SquareType;
  status: SquareStatus;
}

export class Square {
  private readonly coordinate: Coordinate;
  private readonly type: SquareType;
  private status: SquareStatus;

  private aroundBombsCount = -1;

  constructor({coordinate, type, status}: SquareParam) {
    this.coordinate = coordinate;
    this.type = type;
    this.status = status;
  }

  public getCoordinate(): Coordinate {
    return this.coordinate;
  }

  public getStatus(): SquareStatus {
    return this.status;
  }

  public getType(): SquareType {
    return this.type;
  }

  public open(matrix: Array<Array<Square>>, isRecursive = false): void {
    if (this.getStatus() !== SquareStatus.closed) {
      return;
    }

    if (this.getType() === SquareType.bomb && !isRecursive) {
      this.status = SquareStatus.exploded;
      return;
    }

    this.status = SquareStatus.opened;
    if (this.getAroundBombsCount(matrix) > 0) {
      return;
    }

    this.getAroundSquareCoordinates(matrix).forEach(coordinate => Square.getSquareByCoordinate(matrix, coordinate)?.open(matrix, true))
  }

  public mark(): void {
    if (this.getStatus() !== SquareStatus.closed && this.getStatus() !== SquareStatus.markedBomb) {
      return;
    }

    if (this.status === SquareStatus.closed) {
      this.status = SquareStatus.markedBomb;
      return;
    }

    if (this.status === SquareStatus.markedBomb) {
      this.status = SquareStatus.closed;
      return;
    }
  }

  private getAroundSquareCoordinates(matrix: Array<Array<Square>>): Array<Coordinate> {
    return [
      Square.getSquareByCoordinate(matrix, {
        rowIndex: this.coordinate.rowIndex - 1,
        colIndex: this.coordinate.colIndex - 1,
      }),
      Square.getSquareByCoordinate(matrix, {
        rowIndex: this.coordinate.rowIndex - 1,
        colIndex: this.coordinate.colIndex,
      }),
      Square.getSquareByCoordinate(matrix, {
        rowIndex: this.coordinate.rowIndex - 1,
        colIndex: this.coordinate.colIndex + 1,
      }),
      Square.getSquareByCoordinate(matrix, {
        rowIndex: this.coordinate.rowIndex,
        colIndex: this.coordinate.colIndex - 1,
      }),
      Square.getSquareByCoordinate(matrix, {
        rowIndex: this.coordinate.rowIndex,
        colIndex: this.coordinate.colIndex + 1,
      }),
      Square.getSquareByCoordinate(matrix, {
        rowIndex: this.coordinate.rowIndex + 1,
        colIndex: this.coordinate.colIndex - 1,
      }),
      Square.getSquareByCoordinate(matrix, {
        rowIndex: this.coordinate.rowIndex + 1,
        colIndex: this.coordinate.colIndex,
      }),
      Square.getSquareByCoordinate(matrix, {
        rowIndex: this.coordinate.rowIndex + 1,
        colIndex: this.coordinate.colIndex + 1,
      }),
    ]
      .filter(current => current instanceof Square)
      .map(current => current as Square).map(square => {
        return {rowIndex: square.coordinate.rowIndex, colIndex: square.coordinate.colIndex}
      })
  }

  public getAroundBombsCount(matrix: Array<Array<Square>>): number {
    if (this.aroundBombsCount !== -1) {
      return this.aroundBombsCount;
    }

    this.aroundBombsCount = 0;
    this.getAroundSquareCoordinates(matrix)
      .forEach(coordinate => (Square.getSquareByCoordinate(matrix, coordinate) as Square).getType() === SquareType.bomb ? this.aroundBombsCount++ : null)

    return this.aroundBombsCount;
  }

  private static getSquareByCoordinate(matrix: Array<Array<Square>>, coordinate: Coordinate): Square | null {
    if (!matrix[coordinate.rowIndex] || !matrix[coordinate.rowIndex][coordinate.colIndex]) {
      return null;
    }
    return matrix[coordinate.rowIndex][coordinate.colIndex];
  }
}
