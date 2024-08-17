import { binaryWithDash } from "./binary";

// Quine McCluskey = QMC

export interface QMCCell {
  MTOrDCNumbers: number[]; //min-terms or do-not-cares
  binaryNumber: binaryWithDash[];
  matched: boolean;
}

export interface QMCGroupCell {
  numberOf1Bit: number;
  cells: QMCCell[];
}

export interface QMCColumn {
  numberOfDashes: number;
  groupCells: QMCGroupCell[];
}

export type QMCTable = QMCColumn[];
