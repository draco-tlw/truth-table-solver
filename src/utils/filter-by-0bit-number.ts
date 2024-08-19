import { binary } from "../types/binary";

export default function filterBy0BitNumber(
  binaryList: binary[][],
  numberOf1: number
) {
  const filteredList: binary[][] = [];
  for (const binaryNumber of binaryList) {
    let numOf0 = 0;
    for (const binaryDigit of binaryNumber) {
      if (binaryDigit === "0") numOf0++;
    }
    if (numOf0 === numberOf1) filteredList.push(binaryNumber);
  }
  return filteredList;
}
