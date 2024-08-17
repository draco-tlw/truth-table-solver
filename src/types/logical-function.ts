export default interface LogicalFunction {
  name: string;
  minTerms: number[];
  doNotCares: number[];
}
