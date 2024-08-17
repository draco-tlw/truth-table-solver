import CombineWithDash from "../utils/combine-with-dash";

export default function CombineWithDashTest() {
  console.log("testing combine-with-dash function");

  console.log(CombineWithDash(["0", "0", "0", "0"], ["1", "0", "0", "0"]));
  console.log(CombineWithDash(["0", "1", "1", "0"], ["0", "1", "1", "1"]));
}
