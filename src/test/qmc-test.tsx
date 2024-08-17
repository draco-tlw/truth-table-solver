import { QMCTable } from "../types/quine-mc-cluskey-table";

export default function QMCTest({ table }: { table: QMCTable }) {
  return (
    <div>
      <h1>Quine McCluskey Test</h1>
      {table.map((column, index) => (
        <table
          key={index}
          style={{ border: "4px solid red", width: "100%", margin: "1rem" }}
        >
          <tbody>
            {column.groupCells.map((group, index) => (
              <>
                <tr key={index}>
                  <td
                    colSpan={3}
                    style={{ backgroundColor: "gray", textAlign: "center" }}
                  >
                    {group.numberOf1Bit}
                  </td>
                </tr>
                {group.cells.map((cell, index) => (
                  <tr key={index}>
                    <td>{cell.MTOrDCNumbers.join(",")}</td>
                    <td>{cell.binaryNumber.join("")}</td>
                    <td>{cell.matched ? "matched" : "unmatchable"}</td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
