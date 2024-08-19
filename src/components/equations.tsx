import { Fragment, useLayoutEffect, useRef, useState } from "react";
import {
  Equation,
  EquationTerm,
  EquationVariable,
  isEquationTerm,
  isEquationVariable,
} from "../types/equation";
import styles from "./equations.module.scss";
import { useAppSelector } from "../redux/hooks";
import { selectEquations } from "../redux/features/equations-slice";

export default function Equations() {
  const equations = useAppSelector(selectEquations);
  const [expandBoxHeight, setExpandBoxHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setExpandBoxHeight(divRef.current?.scrollHeight ?? 0);
  }, [equations.length]);

  const variableToSpan = (variable: EquationVariable) => {
    return (
      <span className={variable.supplement ? styles.supplement : ""}>
        {variable.name}
      </span>
    );
  };

  const termToSpan = (term: EquationTerm) => {
    return (
      <span
        className={
          term.supplement
            ? `${styles.equationTerm} ${styles.supplement}`
            : styles.equationTerm
        }
      >
        {term.variables.map((variable, i) => (
          <Fragment key={i}>
            {i == 0 && term.operator == "OR" ? "(" : ""}
            {isEquationVariable(variable)
              ? variableToSpan(variable)
              : isEquationTerm(variable)
              ? termToSpan(variable)
              : variable}
            {i !== term.variables.length - 1 ? (
              <span key={i}>
                {term.operator === "AND" && isEquationVariable(variable)
                  ? "."
                  : term.operator === "AND" && isEquationTerm(variable)
                  ? " . "
                  : term.operator === "OR" && isEquationVariable(variable)
                  ? " + "
                  : term.operator === "OR" && isEquationTerm(variable)
                  ? " XOR "
                  : ""}
              </span>
            ) : (
              ""
            )}
            {i == term.variables.length - 1 && term.operator === "OR"
              ? ")"
              : ""}
          </Fragment>
        ))}
      </span>
    );
  };

  const equationToDiv = (equation: Equation) => {
    return (
      <div className={styles.equation}>
        {equation.functionName + " = "}
        {equation.terms.map((term, i) => (
          <Fragment key={i}>
            {termToSpan(term)}
            {i !== equation.terms.length - 1 ? (
              <span key={i}>
                {equation.operator === "OR"
                  ? " + "
                  : equation.operator === "AND"
                  ? " . "
                  : "XOR"}
              </span>
            ) : (
              ""
            )}
          </Fragment>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={divRef}
      className={styles.collapseBox}
      style={{
        height: equations.length > 0 ? expandBoxHeight + "px" : 0,
      }}
    >
      <div className={styles.equations}>
        <h3>Equations: </h3>
        <div>
          {equations.map((e, i) => (
            <div key={i} className={styles.equation}>
              {equationToDiv(e)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
