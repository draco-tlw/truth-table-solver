import { binary } from "../types/binary";
import { Equation, EquationTerm } from "../types/equation";
import LogicalFunction from "../types/logical-function";
import { PIData } from "../types/PI-data";
import { QMCSolveResult } from "../types/qmc-solve-result";
import {
  QMCCell,
  QMCColumn,
  QMCGroupCell,
  QMCTable,
} from "../types/quine-mc-cluskey-table";
import { SolveMethod } from "../types/solve-method";
import checkBitDifferent from "./check-bit-different";
import checkSetsEquality from "./check-sets-equality";
import combineWithDash from "./combine-with-dash";
import filterBy0BitNumber from "./filter-by-0bit-number";
import filterBy1BitNumber from "./filter-by-1bit-number";
import includesElements from "./includesElements";
import numOfElement from "./num-of-element";
import PermuteArray from "./permute-array";
import toBinary from "./to-binary";
import toDecimal from "./toDecimal";

export default function QuineMcCluskey(
  logicalFunction: LogicalFunction,
  variables: string[],
  solveMethod: SolveMethod
): QMCSolveResult {
  const numberOfVariables = variables.length;
  const { minTerms, maxTerms, doNotCares } =
    extractMinTermsAndMaxTermsAndDoNotCares(logicalFunction, numberOfVariables);

  if ([...minTerms, ...doNotCares].length == Math.pow(2, numberOfVariables))
    return {
      equation: {
        functionName: logicalFunction.name,
        terms: [
          {
            variables: ["1"],
            supplement: false,
            operator: solveMethod == "min-term" ? "AND" : "OR",
          },
        ],
        operator: solveMethod == "min-term" ? "OR" : "AND",
      },
      table: {
        columns: [],
        solveMethod: solveMethod,
      },
    };
  else if (minTerms.length == 0) {
    return {
      equation: {
        functionName: logicalFunction.name,
        terms: [
          {
            variables: ["0"],
            supplement: false,
            operator: solveMethod == "min-term" ? "AND" : "OR",
          },
        ],
        operator: solveMethod == "min-term" ? "OR" : "AND",
      },
      table: {
        columns: [],
        solveMethod: solveMethod,
      },
    };
  }

  let MTsAndDNCsBinaries: binary[][],
    firstColumn: QMCColumn,
    table: QMCTable,
    PIs: PIData[],
    EPIs: PIData[],
    equation: Equation;

  if (solveMethod == "min-term") {
    MTsAndDNCsBinaries = generateMTsAndDNCsBinaries(
      minTerms,
      doNotCares,
      numberOfVariables
    );

    firstColumn = generateFirstColumnForMinTerms(
      MTsAndDNCsBinaries,
      numberOfVariables
    );

    table = generateTable(firstColumn, numberOfVariables, solveMethod);

    PIs = extractPIsForMinTerms(table, minTerms);

    EPIs = extractEPIsForMinTerms(PIs, minTerms);

    equation = generateEquationForMinTerms(EPIs, logicalFunction, variables);
  } else {
    MTsAndDNCsBinaries = generateMTsAndDNCsBinaries(
      maxTerms,
      doNotCares,
      numberOfVariables
    );

    firstColumn = generateFirstColumnForMaxTerms(
      MTsAndDNCsBinaries,
      numberOfVariables
    );

    table = generateTable(firstColumn, numberOfVariables, solveMethod);

    PIs = extractPIsForMaxTerms(table, maxTerms);

    EPIs = extractEPIsForMaxTerms(PIs, maxTerms);

    equation = generateEquationForMaxTerms(EPIs, logicalFunction, variables);
  }

  const cleenTable: QMCTable = {
    columns: table.columns.filter(
      (column) =>
        column.groupCells.filter((group) => group.cells.length > 0).length > 0
    ),
    solveMethod: table.solveMethod,
  };

  return { equation, table: cleenTable };
}

function extractMinTermsAndMaxTermsAndDoNotCares(
  logicalFunction: LogicalFunction,
  numberOfVariables: number
) {
  const minTerms: number[] = [];
  const maxTerms: number[] = [];
  const doNotCares: number[] = [];

  for (let term = 0; term < Math.pow(2, numberOfVariables); term++) {
    if (logicalFunction.minTerms.includes(term)) minTerms.push(term);
    else if (logicalFunction.doNotCares.includes(term)) doNotCares.push(term);
    else maxTerms.push(term);
  }

  return { minTerms, maxTerms, doNotCares };
}
function generateMTsAndDNCsBinaries(
  MTs: number[],
  doNotCares: number[],
  numberOfVariables: number
): binary[][] {
  return [
    ...MTs.map((term) => toBinary(term, numberOfVariables)),
    ...doNotCares.map((doNotCare) => toBinary(doNotCare, numberOfVariables)),
  ];
}
function generateFirstColumnForMinTerms(
  MTsAndDNCsBinaries: binary[][],
  numberOfVariables: number
) {
  const firstColumn: QMCColumn = {
    numberOfDashes: 0,
    groupCells: [],
  };
  for (let index = 0; index <= numberOfVariables; index++) {
    const groupCells: QMCGroupCell = {
      numberOfTargetBit: index,
      cells: [],
    };

    for (const binaryNumber of filterBy1BitNumber(MTsAndDNCsBinaries, index)) {
      groupCells.cells.push({
        MTOrDCNumbers: [toDecimal(binaryNumber)],
        binaryNumber: binaryNumber,
        matched: false,
      });
    }
    firstColumn.groupCells.push(groupCells);
  }
  return firstColumn;
}
function generateFirstColumnForMaxTerms(
  MTsAndDNCsBinaries: binary[][],
  numberOfVariables: number
) {
  const firstColumn: QMCColumn = {
    numberOfDashes: 0,
    groupCells: [],
  };
  for (let index = 0; index <= numberOfVariables; index++) {
    const groupCells: QMCGroupCell = {
      numberOfTargetBit: index,
      cells: [],
    };

    for (const binaryNumber of filterBy0BitNumber(MTsAndDNCsBinaries, index)) {
      groupCells.cells.push({
        MTOrDCNumbers: [toDecimal(binaryNumber)],
        binaryNumber: binaryNumber,
        matched: false,
      });
    }
    firstColumn.groupCells.push(groupCells);
  }
  return firstColumn;
}
function generateTable(
  firstColumn: QMCColumn,
  numberOfVariables: number,
  solveMethod: SolveMethod
) {
  const table: QMCTable = { columns: [firstColumn], solveMethod };

  for (
    let index = 0;
    table.columns[table.columns.length - 1].numberOfDashes <= numberOfVariables;
    index++
  ) {
    const column = table.columns[index];
    const newColumn: QMCColumn = { numberOfDashes: index + 1, groupCells: [] };
    for (
      let groupIndex = 0;
      groupIndex < column.groupCells.length - 1;
      groupIndex++
    ) {
      const group = column.groupCells[groupIndex];
      const newGroup: QMCGroupCell = {
        numberOfTargetBit: group.numberOfTargetBit + 1,
        cells: [],
      };

      for (const cell of group.cells) {
        for (const siblingGroupCell of column.groupCells[groupIndex + 1]
          .cells) {
          if (
            checkBitDifferent(
              cell.binaryNumber,
              siblingGroupCell.binaryNumber
            ) === 1
          ) {
            if (
              newGroup.cells.find((c) =>
                checkSetsEquality(c.MTOrDCNumbers, [
                  ...cell.MTOrDCNumbers,
                  ...siblingGroupCell.MTOrDCNumbers,
                ])
              ) == undefined
            ) {
              const newCell: QMCCell = {
                MTOrDCNumbers: [
                  ...cell.MTOrDCNumbers,
                  ...siblingGroupCell.MTOrDCNumbers,
                ],
                binaryNumber: combineWithDash(
                  cell.binaryNumber,
                  siblingGroupCell.binaryNumber
                ),
                matched: false,
              };
              cell.matched = true;
              siblingGroupCell.matched = true;
              newGroup.cells.push(newCell);
            } else {
              cell.matched = true;
              siblingGroupCell.matched = true;
            }
          }
        }
      }

      newColumn.groupCells.push(newGroup);
    }
    table.columns.push(newColumn);
  }
  return table;
}
function extractPIsForMinTerms(table: QMCTable, minTerms: number[]) {
  const PIs: PIData[] = [];
  for (const column of table.columns) {
    for (const group of column.groupCells) {
      for (const cell of group.cells) {
        if (!cell.matched) {
          const terms: number[] = [];
          for (const MTOrDC of cell.MTOrDCNumbers) {
            if (minTerms.includes(MTOrDC)) terms.push(MTOrDC);
          }
          if (terms.length > 0)
            PIs.push({ MTNumber: terms, binary: cell.binaryNumber });
        }
      }
    }
  }
  return PIs;
}
function extractPIsForMaxTerms(table: QMCTable, maxTerms: number[]) {
  const PIs: PIData[] = [];
  for (const column of table.columns) {
    for (const group of column.groupCells) {
      for (const cell of group.cells) {
        if (!cell.matched) {
          const terms: number[] = [];
          for (const MTOrDC of cell.MTOrDCNumbers) {
            if (maxTerms.includes(MTOrDC)) terms.push(MTOrDC);
          }
          if (terms.length > 0)
            PIs.push({ MTNumber: terms, binary: cell.binaryNumber });
        }
      }
    }
  }
  return PIs;
}
function extractPrimaryEPIs(PIs: PIData[]) {
  const EPIs: PIData[] = [];
  for (const PI of PIs) {
    for (const term of PI.MTNumber.filter(
      (term) => !EPIs.flatMap((EPI) => EPI.MTNumber).includes(term)
    )) {
      if (
        numOfElement(
          term,
          PIs.flatMap((PI) => PI.MTNumber)
        ) === 1
      ) {
        EPIs.push(PI);
        break;
      }
    }
  }
  return EPIs;
}
function extractEPIsForMinTerms(PIs: PIData[], minTerms: number[]) {
  const EPIs = extractPrimaryEPIs(PIs);

  const restPIs: PIData[] = PIs.filter((PI) => !EPIs.includes(PI));
  const permutedRestPIs = PermuteArray(restPIs);

  for (const PIsList of permutedRestPIs) {
    if (
      includesElements(
        [...EPIs, ...PIsList].flatMap((PI) => PI.MTNumber),
        ...minTerms
      )
    ) {
      PIsList.forEach((PI) => EPIs.push(PI));
      break;
    }
  }

  return EPIs;
}
function extractEPIsForMaxTerms(PIs: PIData[], maxTerms: number[]) {
  const EPIs = extractPrimaryEPIs(PIs);

  const restPIs: PIData[] = PIs.filter((PI) => !EPIs.includes(PI));
  const permutedRestPIs = PermuteArray(restPIs);

  for (const PIsList of permutedRestPIs) {
    if (
      includesElements(
        [...EPIs, ...PIsList].flatMap((PI) => PI.MTNumber),
        ...maxTerms
      )
    ) {
      PIsList.forEach((PI) => EPIs.push(PI));
      break;
    }
  }

  return EPIs;
}
function generateEquationForMinTerms(
  EPIs: PIData[],
  logicalFunction: LogicalFunction,
  variables: string[]
) {
  const equation: Equation = {
    functionName: logicalFunction.name,
    terms: [],
    operator: "OR",
  };

  for (let EPIIndex = 0; EPIIndex < EPIs.length; EPIIndex++) {
    const term: EquationTerm = {
      variables: [],
      supplement: false,
      operator: "AND",
    };
    for (
      let bitIndex = 0;
      bitIndex < EPIs[EPIIndex].binary.length;
      bitIndex++
    ) {
      switch (EPIs[EPIIndex].binary[bitIndex]) {
        case "1":
          term.variables.push({
            name: variables[bitIndex],
            supplement: false,
          });
          break;
        case "0":
          term.variables.push({
            name: variables[bitIndex],
            supplement: true,
          });
          break;
      }
    }
    equation.terms.push(term);
  }
  return equation;
}
function generateEquationForMaxTerms(
  EPIs: PIData[],
  logicalFunction: LogicalFunction,
  variables: string[]
) {
  const equation: Equation = {
    functionName: logicalFunction.name,
    terms: [],
    operator: "AND",
  };

  for (let EPIIndex = 0; EPIIndex < EPIs.length; EPIIndex++) {
    const term: EquationTerm = {
      variables: [],
      supplement: false,
      operator: "OR",
    };
    for (
      let bitIndex = 0;
      bitIndex < EPIs[EPIIndex].binary.length;
      bitIndex++
    ) {
      switch (EPIs[EPIIndex].binary[bitIndex]) {
        case "1":
          term.variables.push({
            name: variables[bitIndex],
            supplement: true,
          });
          break;
        case "0":
          term.variables.push({
            name: variables[bitIndex],
            supplement: false,
          });
          break;
      }
    }
    equation.terms.push(term);
  }
  return equation;
}
