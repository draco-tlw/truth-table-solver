import { binary } from "../types/binary";
import { Equation, EquationTerm } from "../types/equation";
import LogicalFunction from "../types/logical-function";
import { PIData } from "../types/PI-data";
import {
  QMCCell,
  QMCColumn,
  QMCGroupCell,
  QMCTable,
} from "../types/quine-mc-cluskey-table";
import checkBitDifferent from "./check-bit-different";
import checkSetsEquality from "./check-sets-equality";
import combineWithDash from "./combine-with-dash";
import filterBy1BitNumber from "./filter-by-1bit-number";
import includesElements from "./includesElements";
import numOfElement from "./num-of-element";
import PermuteArray from "./permute-array";
import toBinary from "./to-binary";
import toDecimal from "./toDecimal";

export default function QuineMcCluskey(
  logicalFunction: LogicalFunction,
  variables: string[]
) {
  const numberOfInputs = variables.length;
  const minTermsAndDoNotCares: binary[][] = [];
  for (const minTerms of logicalFunction.minTerms) {
    minTermsAndDoNotCares.push(toBinary(minTerms, numberOfInputs));
  }
  for (const doNotCares of logicalFunction.doNotCares) {
    minTermsAndDoNotCares.push(toBinary(doNotCares, numberOfInputs));
  }

  const firstColumn: QMCColumn = {
    numberOfDashes: 0,
    groupCells: [],
  };
  for (let index = 0; index <= numberOfInputs; index++) {
    const groupCells: QMCGroupCell = { numberOf1Bit: index, cells: [] };

    for (const binaryNumber of filterBy1BitNumber(
      minTermsAndDoNotCares,
      index
    )) {
      groupCells.cells.push({
        MTOrDCNumbers: [toDecimal(binaryNumber)],
        binaryNumber: binaryNumber,
        matched: false,
      });
    }
    firstColumn.groupCells.push(groupCells);
  }

  const table: QMCTable = [firstColumn];

  for (
    let index = 0;
    table[table.length - 1].numberOfDashes <= numberOfInputs;
    index++
  ) {
    const column = table[index];
    const newColumn: QMCColumn = { numberOfDashes: index + 1, groupCells: [] };
    for (
      let groupIndex = 0;
      groupIndex < column.groupCells.length - 1;
      groupIndex++
    ) {
      const group = column.groupCells[groupIndex];
      const newGroup: QMCGroupCell = {
        numberOf1Bit: group.numberOf1Bit + 1,
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
    table.push(newColumn);
  }

  const PIs: PIData[] = [];
  for (const column of table) {
    for (const group of column.groupCells) {
      for (const cell of group.cells) {
        if (!cell.matched) {
          const minTerms: number[] = [];
          for (const MTOrDC of cell.MTOrDCNumbers) {
            if (logicalFunction.minTerms.includes(MTOrDC))
              minTerms.push(MTOrDC);
          }
          if (minTerms.length > 0)
            PIs.push({ minTermsNumber: minTerms, binary: cell.binaryNumber });
        }
      }
    }
  }

  const EPIs: PIData[] = [];
  for (const PI of PIs) {
    for (const minTerm of PI.minTermsNumber.filter(
      (minTerm) => !EPIs.flatMap((EPI) => EPI.minTermsNumber).includes(minTerm)
    )) {
      if (
        numOfElement(
          minTerm,
          PIs.flatMap((PI) => PI.minTermsNumber)
        ) === 1
      ) {
        EPIs.push(PI);
        break;
      }
    }
  }

  const restPIs: PIData[] = PIs.filter((PI) => !EPIs.includes(PI));
  const permutedRestPIs = PermuteArray(restPIs);

  for (const PIsList of permutedRestPIs) {
    if (
      includesElements(
        [...EPIs, ...PIsList].flatMap((PI) => PI.minTermsNumber),
        ...logicalFunction.minTerms
      )
    ) {
      PIsList.forEach((PI) => EPIs.push(PI));
      break;
    }
  }

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

  const cleenTable = table.filter(column => column.groupCells.filter(group => group.cells.length > 0).length > 0);

  return {equation, table: cleenTable};
}
