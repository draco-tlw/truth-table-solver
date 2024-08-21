import { binary, binaryWithDoNotCare } from "../types/binary";

export default function combineWithDoNotCare(...binaries: binary[][]) {
  const combinedBinary: binaryWithDoNotCare[] = [];

  for (let index = 0; index < binaries[0].length; index++) {
    combinedBinary[index] = binaries[0][index];
    for (const binary of binaries) {
      if (binaries[0][index] !== binary[index]) {
        combinedBinary[index] = "x";
        break;
      }
    }
  }

  return combinedBinary;
}
