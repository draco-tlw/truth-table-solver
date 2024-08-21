import { binary, binaryWithDash, binaryWithDoNotCare } from "../types/binary";

export default function differentBitIndex(
  binaryNumberA: (binaryWithDash | binaryWithDoNotCare | binary)[],
  binaryNumberB: (binaryWithDash | binaryWithDoNotCare | binary)[]
) {
  if (binaryNumberA.length !== binaryNumberB.length)
    throw new Error("binary number A and B must have a same length");
  else
    for (let index = 0; index < binaryNumberA.length; index++) {
      if (
        binaryNumberA[index] !== binaryNumberB[index] &&
        binaryNumberA[index] !== "x" &&
        binaryNumberB[index] !== "x"
      ) {
        return index;
      }
    }
}
