export default function numOfElement<T>(element: T, Array: T[]) {
  let num = 0;
  for (const e of Array) {
    if (e === element) {
      num++;
    }
  }
  return num;
}
