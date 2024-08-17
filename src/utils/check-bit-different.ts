import { binaryWithDash } from "../types/binary";

export default function checkBitDifferent(
  binaryNumberA: binaryWithDash[],
  binaryNumberB: binaryWithDash[]
) {
  if (binaryNumberA.length !== binaryNumberB.length)
    throw new Error("binary number A and B must have a same length");
  else {
    let numOfBitDifferent = 0;
    for (const index in binaryNumberA) {
      if (binaryNumberA[index] !== binaryNumberB[index]) numOfBitDifferent++;
    }

    return numOfBitDifferent;
  }
}
