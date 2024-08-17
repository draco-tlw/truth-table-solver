import { binary } from "../types/binary";

export default function toDecimal(binaryNumber: binary[]) {
  let decimal = 0;
  for (const digitIndex in binaryNumber) {
    decimal +=
      Math.pow(2, binaryNumber.length - parseInt(digitIndex) - 1) *
      parseInt(binaryNumber[digitIndex]);
  }
  return decimal;
}
