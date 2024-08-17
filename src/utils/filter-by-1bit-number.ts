import { binary } from "../types/binary";

export default function filterBy1BitNumber(
  binaryList: binary[][],
  numberOf1: number
) {
  const filteredList: binary[][] = [];
  for (const binaryNumber of binaryList) {
    let numOf1 = 0;
    for (const binaryDigit of binaryNumber) {
      if (binaryDigit === "1") numOf1++;
    }
    if (numOf1 === numberOf1) filteredList.push(binaryNumber);
  }
  return filteredList;
}
