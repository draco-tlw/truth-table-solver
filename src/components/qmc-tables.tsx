import { selectLogicalFunctions } from "../redux/features/logical-functions-slice";
import { selectPIsAndEPIs } from "../redux/features/pis-and-epis-slice";
import { selectQMCTables } from "../redux/features/qmc-tables-slice";
import { useAppSelector } from "../redux/hooks";
import { PIData } from "../types/PI-data";
import styles from "./qmc-tables.module.scss";

import { Fragment } from "react/jsx-runtime";

export default function QMCTables() {
  const logicalFunctions = useAppSelector(selectLogicalFunctions);
  const qmcTables = useAppSelector(selectQMCTables);
  const PIsAndEPIs = useAppSelector(selectPIsAndEPIs);

  return (
    <div
      className={styles.qmcTables}
      hidden={
        qmcTables.length == 0 ||
        qmcTables.filter((t) => t.columns.length > 0).length == 0
      }
    >
      <h3 className={styles.title}>Quine McCluskey Tables</h3>
      <div className={styles.qmcTableContainer}>
        {qmcTables.map((table, i) => (
          <div
            className={styles.qmcTable}
            key={i}
            hidden={table.columns.length == 0}
          >
            <div className={styles.tableHeader}>{logicalFunctions[i].name}</div>
            <div>
              {table.columns.map((column, i) => (
                <div key={i}>
                  <div className={styles.columnHeader}>Column {i + 1}</div>
                  <div className={styles.columnBody}>
                    <table>
                      <thead>
                        <tr>
                          <td>Group</td>
                          <td>
                            {table.solveMethod == "min-term"
                              ? "Min-Terms"
                              : "Max-Terms"}
                          </td>
                          <td>Binary</td>
                          <td>Matched</td>
                        </tr>
                      </thead>
                      <tbody>
                        {column.groupCells.map((group, i) => (
                          <Fragment key={i}>
                            {group.cells.map((cell, i) => (
                              <tr key={i}>
                                {i == 0 && (
                                  <td rowSpan={group.cells.length}>
                                    {group.numberOfTargetBit}x
                                    {table.solveMethod == "min-term"
                                      ? "1"
                                      : "0"}
                                  </td>
                                )}
                                <td>{cell.MTOrDCNumbers.join(", ")}</td>
                                <td>{cell.binaryNumber.join("")}</td>
                                <td>{cell.matched ? "yes" : "no"}</td>
                              </tr>
                            ))}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.PIsAndEPIsTableContainer}>
              <div className={styles.title}>EPIs</div>
              {PIsAndEPIsTable(PIsAndEPIs[i].PIs, PIsAndEPIs[i].EPIs)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function PIsAndEPIsTable(PIs: PIData[], EPIs: PIData[]) {
    const MTs = [...new Set(PIs.map((pi) => pi.MTNumber).flat())];

    return (
      <table>
        <thead>
          <tr>
            <td></td>
            {MTs.map((MT) => (
              <th>m{MT}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PIs.map((PI) => (
            <tr
              className={
                EPIs.findIndex(
                  (EPI) => JSON.stringify(EPI) === JSON.stringify(PI)
                ) !== -1
                  ? styles.EPI
                  : styles.PI
              }
            >
              <th>{PI.binary}</th>
              {MTs.map((MT) => (
                <td>
                  {PI.MTNumber.findIndex((e) => e === MT) !== -1 ? "x" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
