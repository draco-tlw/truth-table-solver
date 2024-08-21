import {
  isRowData,
  isRowGroup,
  RowData,
  RowGroup,
  TableData,
} from "../types/table-data";
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
import { binary, binaryWithDoNotCare } from "../types/binary";
import toBinary from "../utils/to-binary";
import {
  addQMCTable,
  clearQMCTables,
} from "../redux/features/qmc-tables-slice";
import { useEffect, useState } from "react";
import { SolveMethod } from "../types/solve-method";
import combineWithDoNotCare from "../utils/combine-with-do-not-care";
import differentBitIndex from "../utils/different-bit-index";
import checkBitDifferent from "../utils/check-bit-different";
import includesElements from "../utils/includesElements";

export default function TruthTable() {
  const [solveMethod, setSolveMethod] = useState<SolveMethod>("min-term");
  const [combinedRows, setCombinedRows] = useState<number[][]>([]);

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

    if (!combinedRows.flat().includes(index))
      table.push({
        index,
        variables: toBinary(index, variables.length),
        logicalFunctions: outputRow,
      });
    else {
      const rowsList = combinedRows.find((arr) => arr.includes(index))!;
      if (rowsList[0] == index)
        table.push({
          indexList: rowsList,
          variablesList: rowsList.map((r) => toBinary(r, variables.length)),
          logicalFunctions: outputRow,
        });
    }
  }

  useEffect(() => {
    setCombinedRows((list) =>
      list
        .map((row) =>
          row.filter((index) => index < Math.pow(2, variables.length))
        )
        .filter((row) => row.length > 0)
    );
  }, [variables.length]);

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
              {table.map((element, rowIndex) => {
                if (isRowData(element))
                  return (
                    <tr key={rowIndex}>
                      <td>{element.index}</td>
                      {element.variables.map((variableValue, index) => (
                        <td
                          key={"input-" + index}
                          className={styles.inputBit}
                          onClick={() => handleCombinRowData(element, index)}
                        >
                          {variableValue}
                        </td>
                      ))}
                      {element.logicalFunctions.map(
                        (logicalFunctionValue, index) => (
                          <td
                            key={"output-" + index}
                            className={styles.outputBit}
                            onClick={() =>
                              handleRowToggleLogicalFunction(
                                element.index,
                                rowIndex,
                                index
                              )
                            }
                          >
                            {logicalFunctionValue}
                          </td>
                        )
                      )}
                    </tr>
                  );
                else if (isRowGroup(element)) {
                  return (
                    <tr key={rowIndex}>
                      <td>{element.indexList.join(", ")}</td>
                      {combineWithDoNotCare(...element.variablesList).map(
                        (variableValue, index) => (
                          <td
                            key={"input-" + index}
                            className={styles.inputBit}
                            onClick={() =>
                              variableValue != "x"
                                ? handleCombinRowGroup(element, index)
                                : handleDecombineGroupRow(element, index)
                            }
                          >
                            {variableValue}
                          </td>
                        )
                      )}
                      {element.logicalFunctions.map(
                        (logicalFunctionValue, index) => (
                          <td
                            key={"output-" + index}
                            className={styles.outputBit}
                            onClick={() =>
                              handleGroupToggleLogicalFunction(
                                element.indexList,
                                rowIndex,
                                index
                              )
                            }
                          >
                            {logicalFunctionValue}
                          </td>
                        )
                      )}
                    </tr>
                  );
                }
              })}
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

  function handleRowToggleLogicalFunction(
    index: number,
    row: number,
    col: number
  ) {
    switch (table[row].logicalFunctions[col]) {
      case "0":
        dispatch(
          addMinTerm({ logicalFuncion: logicalFunctions[col], minTerm: index })
        );
        break;
      case "1":
        dispatch(
          removeMinTerm({
            logicalFuncion: logicalFunctions[col],
            minTerm: index,
          })
        );
        dispatch(
          addDoNotCare({
            logicalFuncion: logicalFunctions[col],
            doNotCare: index,
          })
        );
        break;
      case "x":
        dispatch(
          removeDoNotCare({
            logicalFuncion: logicalFunctions[col],
            doNotCare: index,
          })
        );
        break;
    }
    dispatch(clearEquations());
    dispatch(clearQMCTables());
  }

  function handleGroupToggleLogicalFunction(
    indexList: number[],
    row: number,
    col: number
  ) {
    switch (table[row].logicalFunctions[col]) {
      case "0":
        indexList.forEach((index) =>
          dispatch(
            addMinTerm({
              logicalFuncion: logicalFunctions[col],
              minTerm: index,
            })
          )
        );
        break;
      case "1":
        indexList.forEach((index) => {
          dispatch(
            removeMinTerm({
              logicalFuncion: logicalFunctions[col],
              minTerm: index,
            })
          );
          dispatch(
            addDoNotCare({
              logicalFuncion: logicalFunctions[col],
              doNotCare: index,
            })
          );
        });

        break;
      case "x":
        indexList.forEach((index) =>
          dispatch(
            removeDoNotCare({
              logicalFuncion: logicalFunctions[col],
              doNotCare: index,
            })
          )
        );
        break;
    }
    dispatch(clearEquations());
    dispatch(clearQMCTables());
  }

  function handleCombinRowData(element: RowData, bitIndex: number) {
    const combineableRow = table.find((row) => {
      if (isRowData(row))
        return (
          checkBitDifferent(row.variables, element.variables) == 1 &&
          differentBitIndex(row.variables, element.variables) == bitIndex
        );
      else
        return (
          checkBitDifferent(
            combineWithDoNotCare(...row.variablesList),
            element.variables
          ) == 1 &&
          differentBitIndex(
            combineWithDoNotCare(...row.variablesList),
            element.variables
          ) == bitIndex
        );
    });
    if (isRowData(combineableRow)) {
      setCombinedRows((list) => [
        ...list,
        [element.index, combineableRow.index],
      ]);
      syncMinTermsAndDoNotCares(
        element.logicalFunctions,
        combineableRow?.index
      );
    } else {
      let combinedRowsCopy = [...combinedRows];
      const i = combinedRows.findIndex(
        (row) =>
          JSON.stringify(row) == JSON.stringify(combineableRow?.indexList)
      );
      combinedRowsCopy[i] = findAllCombineableRows(
        element.variables,
        ...(combineableRow?.variablesList ?? [])
      );
      combinedRowsCopy = combinedRowsCopy.filter(
        (row, index) =>
          index == i || !includesElements(combinedRowsCopy[i], ...row)
      );
      setCombinedRows(combinedRowsCopy);
      syncMinTermsAndDoNotCares(
        element.logicalFunctions,
        ...combinedRowsCopy[i]
      );
    }
  }

  function handleCombinRowGroup(element: RowGroup, bitIndex: number) {
    const combineableRow = table.find((row) => {
      if (isRowData(row))
        return (
          checkBitDifferent(
            row.variables,
            combineWithDoNotCare(...element.variablesList)
          ) == 1 &&
          differentBitIndex(
            row.variables,
            combineWithDoNotCare(...element.variablesList)
          ) == bitIndex
        );
      else
        return (
          checkBitDifferent(
            combineWithDoNotCare(...row.variablesList),
            combineWithDoNotCare(...element.variablesList)
          ) == 1 &&
          differentBitIndex(
            combineWithDoNotCare(...row.variablesList),
            combineWithDoNotCare(...element.variablesList)
          ) == bitIndex
        );
    });

    let combinedRowsCopy = [...combinedRows];
    const i = combinedRows.findIndex(
      (row) => JSON.stringify(row) === JSON.stringify(element.indexList)
    );
    if (isRowData(combineableRow)) {
      combinedRowsCopy[i] = findAllCombineableRows(
        ...element.variablesList,
        combineableRow.variables
      );
      combinedRowsCopy = combinedRowsCopy.filter(
        (row, index) =>
          index == i || !includesElements(combinedRowsCopy[i], ...row)
      );
      setCombinedRows(combinedRowsCopy);
      syncMinTermsAndDoNotCares(
        element.logicalFunctions,
        ...combinedRowsCopy[i]
      );
    } else {
      combinedRowsCopy[i] = findAllCombineableRows(
        ...element.variablesList,
        ...(combineableRow?.variablesList ?? [])
      );
      combinedRowsCopy = combinedRowsCopy.filter(
        (row, index) =>
          index == i || !includesElements(combinedRowsCopy[i], ...row)
      );
      setCombinedRows(combinedRowsCopy);
      syncMinTermsAndDoNotCares(
        element.logicalFunctions,
        ...(combineableRow?.indexList ?? [])
      );
    }
  }

  function findAllCombineableRows(...combineableRowsVariables: binary[][]) {
    let combineableRows: number[] = [];
    table.forEach((row) => {
      if (isRowData(row)) {
        if (
          checkBitDifferent(
            combineWithDoNotCare(...combineableRowsVariables),
            row.variables
          ) == 0
        )
          combineableRows.push(row.index);
      } else {
        if (
          checkBitDifferent(
            combineWithDoNotCare(...combineableRowsVariables),
            combineWithDoNotCare(...row.variablesList)
          ) == 0
        )
          combineableRows = [...combineableRows, ...row.indexList];
      }
    });
    return combineableRows;
  }

  function syncMinTermsAndDoNotCares(
    logicalFunctionsValues: binaryWithDoNotCare[],
    ...rowIndexes: number[]
  ) {
    logicalFunctionsValues.forEach((logicalFunctionValue, index) => {
      rowIndexes.forEach((rowIndex) => {
        switch (logicalFunctionValue) {
          case "1":
            if (logicalFunctions[index].doNotCares.includes(rowIndex))
              dispatch(
                removeDoNotCare({
                  logicalFuncion: logicalFunctions[index],
                  doNotCare: rowIndex,
                })
              );
            if (!logicalFunctions[index].minTerms.includes(rowIndex))
              dispatch(
                addMinTerm({
                  logicalFuncion: logicalFunctions[index],
                  minTerm: rowIndex,
                })
              );
            break;
          case "x":
            if (logicalFunctions[index].minTerms.includes(rowIndex))
              dispatch(
                removeMinTerm({
                  logicalFuncion: logicalFunctions[index],
                  minTerm: rowIndex,
                })
              );
            if (!logicalFunctions[index].doNotCares.includes(rowIndex))
              dispatch(
                addDoNotCare({
                  logicalFuncion: logicalFunctions[index],
                  doNotCare: rowIndex,
                })
              );
            break;
          case "0":
            if (logicalFunctions[index].minTerms.includes(rowIndex))
              dispatch(
                removeMinTerm({
                  logicalFuncion: logicalFunctions[index],
                  minTerm: rowIndex,
                })
              );
            if (logicalFunctions[index].doNotCares.includes(rowIndex))
              dispatch(
                removeDoNotCare({
                  logicalFuncion: logicalFunctions[index],
                  doNotCare: rowIndex,
                })
              );
            break;
        }
      });
    });
  }

  function handleDecombineGroupRow(element: RowGroup, bitIndex: number) {
    const halfA: number[] = [],
      halfB: number[] = [];
    element.variablesList.forEach((variable, index) => {
      if (variable[bitIndex] == "0") halfA.push(element.indexList[index]);
      else halfB.push(element.indexList[index]);
    });

    setCombinedRows((list) => [
      ...list.filter(
        (row) => JSON.stringify(row) !== JSON.stringify(element.indexList)
      ),
      halfA,
      halfB,
    ]);
  }
}
