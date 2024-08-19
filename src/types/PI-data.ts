import { binaryWithDash } from "./binary";

export interface PIData {
  MTNumber: number[]; //min-term or max-term numbers
  binary: binaryWithDash[];
}
