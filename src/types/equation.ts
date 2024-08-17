export type EquationOperator = "OR" | "AND" | "XOR";

export interface EquationVariable {
  name: string;
  supplement: boolean;
}

export interface EquationTerm {
  variables: (EquationVariable | EquationTerm)[];
  supplement: boolean;
  operator: EquationOperator;
}

export interface Equation {
  functionName: string;
  terms: EquationTerm[];
  operator: EquationOperator;
}

export function isEquationVariable(
  obj: EquationVariable | EquationTerm
): obj is EquationVariable {
  return "name" in obj && "supplement" in obj && !("variables" in obj);
}

export function isEquationTerm(
  obj: EquationVariable | EquationTerm
): obj is EquationTerm {
  return "variables" in obj && "operator" in obj && "supplement" in obj;
}
