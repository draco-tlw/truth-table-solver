import { binary } from "../types/binary";

export default function toBinary(decimal: number, bits: number): binary[] {
  let binaryList = [...decimal.toString(2)] as binary[];
  while (binaryList.length < bits) {
    binaryList = ["0", ...binaryList];
  }

  return binaryList;
}
