import { binaryWithDash } from "../types/binary";

export default function combineWithDash(
  binNumberA: binaryWithDash[],
  binNumberB: binaryWithDash[]
) {
  const combinedBinNumber: binaryWithDash[] = [];
  for (const digitIndex in binNumberA) {
    if (binNumberA[digitIndex] === binNumberB[digitIndex])
      combinedBinNumber.push(binNumberA[digitIndex]);
    else combinedBinNumber.push("-");
  }
  return combinedBinNumber;
}
