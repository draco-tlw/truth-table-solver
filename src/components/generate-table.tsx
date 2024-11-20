import { useState } from "react";
import styles from "./generate-table.module.scss";
import LogicalFunction from "../types/logical-function";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addVariable,
  removeVariable,
  selectVariables,
} from "../redux/features/variables-slice";
import {
  addLogicalFunction,
  removeLogicalFunction,
  selectLogicalFunctions,
  updateLogicalFunctions,
} from "../redux/features/logical-functions-slice";
import { clearEquations } from "../redux/features/equations-slice";
import { clearQMCTables } from "../redux/features/qmc-tables-slice";
import { clearPIsAndEPIs } from "../redux/features/pis-and-epis-slice";

export default function GenerateTable() {
  const variables = useAppSelector(selectVariables);
  const logicalFunctions = useAppSelector(selectLogicalFunctions);
  const dispatch = useAppDispatch();

  const [variableTextInput, setVariableTextInput] = useState("");
  const [functionTextInput, setFunctionTextInput] = useState("");

  const nameValidationRegex = /^(([a-z]|[A-Z])+[0-9]*)+$/;

  const inputIsValid =
    nameValidationRegex.test(variableTextInput) &&
    !variables.includes(variableTextInput) &&
    logicalFunctions.find((o) => o.name === variableTextInput) == undefined;
  const outputIsValid =
    nameValidationRegex.test(functionTextInput) &&
    !variables.includes(functionTextInput) &&
    logicalFunctions.find((o) => o.name === functionTextInput) == undefined;

  return (
    <div className={styles.generateTable}>
      <h3>Generate Table: </h3>
      <div className={styles.inputOutputBox}>
        <div className={styles.inputBox}>
          <h4 className={styles.inputBoxTitle}>Variables: </h4>
          <div className={styles.inputField}>
            <input
              type="text"
              placeholder={"Variable Name..."}
              value={variableTextInput}
              onChange={(e) => setVariableTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddVariable()}
            />
            <button
              type={"button"}
              onClick={handleAddVariable}
              disabled={!inputIsValid}
            >
              add variable
            </button>
          </div>
          {variables.length > 0 ? (
            <table>
              <tbody>
                {variables.map((variable, index) => (
                  <tr key={index}>
                    <td>
                      <span className={styles.number}>{index + 1}</span>
                      <button
                        type="button"
                        className={styles.xButton}
                        onClick={() => handleRemoveVariable(variable)}
                      >
                        x
                      </button>
                    </td>
                    <td>{variable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.tablePlaceholder}>
              there isn't any variable to display
            </div>
          )}
        </div>
        <div className={styles.outputBox}>
          <h4 className={styles.outputBoxTitle}>Functions: </h4>
          <div className={styles.outputField}>
            <input
              type="text"
              placeholder={"Function Name..."}
              value={functionTextInput}
              onChange={(e) => setFunctionTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLogicalFunction()}
            />
            <button
              type={"button"}
              disabled={!outputIsValid}
              onClick={handleAddLogicalFunction}
            >
              add function
            </button>
          </div>
          {logicalFunctions.length > 0 ? (
            <table>
              <tbody>
                {logicalFunctions.map((logicalFunction, index) => (
                  <tr key={index}>
                    <td>
                      <span className={styles.number}>{index + 1}</span>
                      <button
                        type="button"
                        className={styles.xButton}
                        onClick={() =>
                          handleRemoveLogicalFunction(logicalFunction)
                        }
                      >
                        x
                      </button>
                    </td>
                    <td>{logicalFunction.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.tablePlaceholder}>
              there isn't any function to display
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function handleAddVariable() {
    if (inputIsValid) {
      dispatch(addVariable(variableTextInput));
      setVariableTextInput("");
      dispatch(clearEquations());
      dispatch(clearQMCTables());
      dispatch(clearPIsAndEPIs());
    }
  }
  function handleAddLogicalFunction() {
    if (outputIsValid) {
      dispatch(
        addLogicalFunction({
          name: functionTextInput,
          minTerms: [],
          doNotCares: [],
        })
      );
      setFunctionTextInput("");
      dispatch(clearEquations());
      dispatch(clearQMCTables());
      dispatch(clearPIsAndEPIs());
    }
  }

  function handleRemoveVariable(variable: string) {
    const inputsLen = variables.length - 1; // length after remove
    dispatch(removeVariable(variable));
    dispatch(updateLogicalFunctions(inputsLen));
    dispatch(clearEquations());
    dispatch(clearQMCTables());
    dispatch(clearPIsAndEPIs());
  }
  function handleRemoveLogicalFunction(logicalFunction: LogicalFunction) {
    dispatch(removeLogicalFunction(logicalFunction));
    dispatch(clearEquations());
    dispatch(clearQMCTables());
    dispatch(clearPIsAndEPIs());
  }
}
