export default function createArray<T>(length: number, initialValue: T): T[] {
  const arr: T[] = [];
  for (let index = 0; index < length; index++) {
    arr.push(initialValue);
  }
  return arr;
}
