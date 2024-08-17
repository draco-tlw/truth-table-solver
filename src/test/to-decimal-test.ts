import toDecimal from "../utils/toDecimal";

export function toDecimalTest() {
  console.log(toDecimal(["0", "0", "0", "0"]));
  console.log(toDecimal(["0", "0", "0", "1"]));
  console.log(toDecimal(["1", "0", "1", "0"]));
  console.log(toDecimal(["0", "0", "1", "0"]));
  console.log(toDecimal(["0", "1", "1", "0"]));
  console.log(toDecimal(["1", "1", "1", "1"]));
  console.log(toDecimal(["1", "1", "1", "1", "1", "1"]));
  console.log(toDecimal(["1", "0", "0", "0", "0", "0"]));
}
