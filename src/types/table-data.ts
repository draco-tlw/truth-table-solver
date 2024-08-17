import type { binary, binaryWithDoNotCare } from "./binary";

export interface RowData {
  index: number;
  variables: binary[];
  logicalFunctions: binaryWithDoNotCare[];
}

export type TableData = RowData[];
