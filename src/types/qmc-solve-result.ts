import { Equation } from "./equation";
import { PIData } from "./PI-data";
import { QMCTable } from "./quine-mc-cluskey-table";

export type QMCSolveResult = {
  equation: Equation;
  table: QMCTable;
  PIs: PIData[];
  EPIs: PIData[];
};
