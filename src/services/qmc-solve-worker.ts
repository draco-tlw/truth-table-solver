import LogicalFunction from "../types/logical-function";
import { SolveMethod } from "../types/solve-method";
import QuineMcCluskey from "../utils/quine-mc-cluskey";

export type QMCSolveWorker = {
  logicalFunction: LogicalFunction;
  variables: string[];
  solveMethod: SolveMethod;
};
self.onmessage = (event: MessageEvent<QMCSolveWorker[]>) => {
  const res = event.data.map((e) =>
    QuineMcCluskey(e.logicalFunction, e.variables, e.solveMethod)
  );
  postMessage(res);
};
