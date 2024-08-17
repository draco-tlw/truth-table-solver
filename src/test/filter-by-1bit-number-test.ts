import { binary } from "../types/binary";
import filterBy1BitNumber from "../utils/filter-by-1bit-number";

export function filterBy1BitNumberTest() {
  const binaryList = [
    "0000".split("") as binary[],
    "0001".split("") as binary[],
    "0010".split("") as binary[],
    "0011".split("") as binary[],
    "0100".split("") as binary[],
    "0101".split("") as binary[],
    "0110".split("") as binary[],
    "0111".split("") as binary[],
    "1000".split("") as binary[],
    "1001".split("") as binary[],
    "1010".split("") as binary[],
    "1011".split("") as binary[],
    "1100".split("") as binary[],
    "1101".split("") as binary[],
    "1110".split("") as binary[],
    "1111".split("") as binary[],
  ];

  const filterBy0 = filterBy1BitNumber(binaryList, 0);
  const filterBy1 = filterBy1BitNumber(binaryList, 1);
  const filterBy2 = filterBy1BitNumber(binaryList, 2);
  const filterBy3 = filterBy1BitNumber(binaryList, 3);
  const filterBy4 = filterBy1BitNumber(binaryList, 4);

  console.log("filter by 0 1bit");
  filterBy0.forEach((binaryNumber) => {
    console.log(binaryNumber);
  });

  console.log("filter by 1 1bit");
  filterBy1.forEach((binaryNumber) => {
    console.log(binaryNumber);
  });

  console.log("filter by 2 1bit");
  filterBy2.forEach((binaryNumber) => {
    console.log(binaryNumber);
  });

  console.log("filter by 3 1bit");
  filterBy3.forEach((binaryNumber) => {
    console.log(binaryNumber);
  });

  console.log("filter by 4 1bit");
  filterBy4.forEach((binaryNumber) => {
    console.log(binaryNumber);
  });
}
