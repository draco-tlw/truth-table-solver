import { TableData } from "../types/table-data";
import TruthTableSkeleton from "./truth-table-skeleton";
import styles from "./truth-table.module.scss";
import QuineMcCluskey from "../utils/quine-mc-cluskey";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectVariables } from "../redux/features/variables-slice";
import {
  addDoNotCare,
  addMinTerm,
  removeDoNotCare,
  removeMinTerm,
  selectLogicalFunctins,
} from "../redux/features/logical-functions-slice";
import { addEquation, clearEquations } from "../redux/features/equations-slice";
import { binaryWithDoNotCare } from "../types/binary";
import toBinary from "../utils/to-binary";
import {
  addQMCTable,
  clearQMCTables,
} from "../redux/features/qmc-tables-slice";
import { useState } from "react";
import { SolveMethod } from "../types/solve-method";

export default function TruthTable() {
  const [solveMethod, setSolveMethod] = useState<SolveMethod>("min-term");

  const variables = useAppSelector(selectVariables);
  const logicalFunctions = useAppSelector(selectLogicalFunctins);
  const dispatch = useAppDispatch();

  const table: TableData = [];
  for (let index = 0; index < Math.pow(2, variables.length); index++) {
    const outputRow: binaryWithDoNotCare[] = [];
    for (const logicalFunction of logicalFunctions) {
      if (logicalFunction.minTerms.includes(index)) {
        outputRow.push("1");
      } else if (logicalFunction.doNotCares.includes(index)) {
        outputRow.push("x");
      } else {
        outputRow.push("0");
      }
    }

    table.push({
      index,
      variables: toBinary(index, variables.length),
      logicalFunctions: outputRow,
    });
  }

  if (variables.length > 0 && logicalFunctions.length > 0)
    return (
      <div className={styles.truthTable}>
        <h3>Truth Table</h3>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <td>#</td>
                {variables.map((variable, index) => (
                  <td key={"inputs-" + index}>{variable}</td>
                ))}
                {logicalFunctions.map((logicalFunction, index) => (
                  <td key={"outputs-" + index}>{logicalFunction.name}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((element, rowIndex) => (
                <tr key={element.index}>
                  <td>{element.index}</td>
                  {element.variables.map((variableValue, index) => (
                    <td key={"input-" + index}>{variableValue}</td>
                  ))}
                  {element.logicalFunctions.map(
                    (logicalFunctionValue, index) => (
                      <td
                        key={"output-" + index}
                        className={styles.outputBit}
                        onClick={() =>
                          handleToggleLogicalFunction(rowIndex, index)
                        }
                      >
                        {logicalFunctionValue}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.solveButtonContainer}>
          <select
            name="solveMethod"
            onChange={(e) => {
              if (
                e.target.value == "min-term" ||
                e.target.value == "max-term"
              ) {
                setSolveMethod(e.target.value);
                dispatch(clearEquations());
                dispatch(clearQMCTables());
              }
            }}
            value={solveMethod}
          >
            <option value={"min-term"}>min-term</option>
            <option value={"max-term"}>max-term</option>
          </select>
          <button type={"button"} onClick={handleSolve}>
            solve
          </button>
        </div>
      </div>
    );
  else if (variables.length > 0) {
    return <TruthTableSkeleton message="Please enter at least one function" />;
  } else if (logicalFunctions.length > 0) {
    return <TruthTableSkeleton message="Please enter at least one variable" />;
  } else {
    return <TruthTableSkeleton message="No data to display" />;
  }

  function handleSolve() {
    dispatch(clearEquations());
    dispatch(clearQMCTables());
    logicalFunctions.forEach((logicalFunction) => {
      const { equation, table } = QuineMcCluskey(
        logicalFunction,
        variables,
        solveMethod
      );
      dispatch(addEquation(equation));
      dispatch(addQMCTable(table));
    });
  }

  function handleToggleLogicalFunction(row: number, col: number) {
    switch (table[row].logicalFunctions[col]) {
      case "0":
        dispatch(
          addMinTerm({ logicalFuncion: logicalFunctions[col], minTerm: row })
        );
        break;
      case "1":
        dispatch(
          removeMinTerm({ logicalFuncion: logicalFunctions[col], minTerm: row })
        );
        dispatch(
          addDoNotCare({
            logicalFuncion: logicalFunctions[col],
            doNotCare: row,
          })
        );
        break;
      case "x":
        dispatch(
          removeDoNotCare({
            logicalFuncion: logicalFunctions[col],
            doNotCare: row,
          })
        );
        break;
    }
    dispatch(clearEquations());
    dispatch(clearQMCTables());
  }
}
