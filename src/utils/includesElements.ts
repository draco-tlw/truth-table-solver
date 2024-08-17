export default function includesElements<T>(Array: T[], ...elements: T[]) {
  for (const element of elements) {
    if (!Array.includes(element)) return false;
  }
  return true;
}
