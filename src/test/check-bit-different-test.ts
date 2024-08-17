import checkBitDifferent from "../utils/check-bit-different";

export function checkBitDifferentTest() {
  console.log("testing check-bit-different function");
  console.log("0001 and 0010");
  console.log(checkBitDifferent(["0", "0", "0", "1"], ["0", "0", "1", "0"]));
  console.log("0000 and 0010");
  console.log(checkBitDifferent(["0", "0", "0", "0"], ["0", "0", "1", "0"]));
  console.log("1100 and 0010");
  console.log(checkBitDifferent(["1", "1", "0", "0"], ["0", "0", "1", "0"]));
  console.log("1101 and 0010");
  console.log(checkBitDifferent(["1", "1", "0", "1"], ["0", "0", "1", "0"]));
  //checking the error
  //   console.log("0000 and 00000");
  //   console.log(
  //     checkBitDifferent(["0", "0", "0", "0"], ["0", "0", "0", "0", "0"])
  //   );
}
