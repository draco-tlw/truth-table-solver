export type EquationOperator = "OR" | "AND" | "XOR";

export type EquationValue = "0" | "1";

export interface EquationVariable {
  name: string;
  supplement: boolean;
}

export interface EquationTerm {
  variables: (EquationVariable | EquationTerm | EquationValue)[];
  supplement: boolean;
  operator: EquationOperator;
}

export interface Equation {
  functionName: string;
  terms: EquationTerm[];
  operator: EquationOperator;
}

export function isEquationVariable(obj: unknown): obj is EquationVariable {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "supplement" in obj &&
    !("variables" in obj)
  );
}

export function isEquationTerm(obj: unknown): obj is EquationTerm {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "supplement" in obj &&
    !("variables" in obj)
  );
}

export function isEquationValue(value: unknown): value is EquationValue {
  return value === "0" || value === "1";
}
