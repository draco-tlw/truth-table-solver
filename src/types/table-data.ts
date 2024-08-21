import type { binary, binaryWithDoNotCare } from "./binary";

export interface RowData {
  index: number;
  variables: binary[];
  logicalFunctions: binaryWithDoNotCare[];
}

export interface RowGroup {
  indexList: number[];
  variablesList: binary[][];
  logicalFunctions: binaryWithDoNotCare[];
}

export type TableData = (RowData | RowGroup)[];

export function isRowData(obj: unknown): obj is RowData {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "index" in obj &&
    "variables" in obj &&
    "logicalFunctions" in obj
  );
}

export function isRowGroup(obj: unknown): obj is RowGroup {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "indexList" in obj &&
    "variablesList" in obj &&
    "logicalFunctions" in obj
  );
}
