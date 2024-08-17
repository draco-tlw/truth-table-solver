import toBinary from "./to-binary";

export default function PermuteArray<T>(array: T[]): T[][] {
  const permutedArray: T[][] = [];

  for (let index = 1; index < Math.pow(2, array.length); index++) {
    const childArray: T[] = [];
    const binaryNumber = toBinary(index, array.length);
    for (const bitIndex in binaryNumber) {
      if (binaryNumber[bitIndex] === "1") childArray.push(array[bitIndex]);
    }
    permutedArray.push(childArray);
  }
  return permutedArray.sort((a, b) => a.length - b.length);
}
