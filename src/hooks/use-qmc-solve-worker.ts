import { useCallback, useEffect, useRef, useState } from "react";
import { QMCSolveResult } from "../types/qmc-solve-result";
import { QMCSolveWorker } from "../services/qmc-solve-worker";

export default function useQMCSolveWorker(
  onFinish?: (result: QMCSolveResult[]) => void
) {
  const [result, setResult] = useState<QMCSolveResult[]>([]);
  const [status, setStatus] = useState<
    "idle" | "computing" | "finished" | "crashed"
  >("idle");
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../services/qmc-solve-worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      setResult(event.data);
      setStatus("finished");
    };

    workerRef.current.onerror = () => {
      setStatus("crashed");
    };

    return () => {
      workerRef.current!.terminate();
    };
  }, []);

  useEffect(() => {
    if (status === "finished") onFinish?.(result);
  }, [onFinish, result, status]);

  const message = useCallback((args: QMCSolveWorker[]) => {
    setStatus("computing");
    workerRef.current?.postMessage(args);
  }, []);

  return {
    result,
    isComputing: status === "computing",
    isFinished: status === "finished",
    isCrashed: status === "crashed",
    solve: message,
  };
}
