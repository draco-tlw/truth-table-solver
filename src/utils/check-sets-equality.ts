export default function checkSetsEquality<T>(setA: T[], setB: T[]) {
  return JSON.stringify([...setA].sort()) === JSON.stringify([...setB].sort());
}
