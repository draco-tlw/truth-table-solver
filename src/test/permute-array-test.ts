import permuteArray from "../utils/permute-array";

export function permuteArrayTest() {
  const arr = [1, 2, 3];

  const permutedArray = permuteArray(arr);
  for (const element of permutedArray) {
    console.log(element);
  }
}
