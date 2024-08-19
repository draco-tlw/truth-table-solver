import { binaryWithDash } from "./binary";
import { SolveMethod } from "./solve-method";

// Quine McCluskey = QMC

export interface QMCCell {
  MTOrDCNumbers: number[]; //min-terms or do-not-cares
  binaryNumber: binaryWithDash[];
  matched: boolean;
}

export interface QMCGroupCell {
  numberOfTargetBit: number;
  cells: QMCCell[];
}

export interface QMCColumn {
  numberOfDashes: number;
  groupCells: QMCGroupCell[];
}

export type QMCTable = {
  columns: QMCColumn[];
  solveMethod: SolveMethod;
};
