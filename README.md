# Truth Table Solver

Truth Table Solver is a web application built with Vite, React, and TypeScript. It helps users generate and solve truth tables for logical expressions, simplifying equations and showing the solving process using the Quine-McCluskey method.

## Features

- **Dynamic Truth Table Generation**:

  - Accepts variable names and function expressions.
  - Dynamically generates the truth table based on the input.

- **Interactive Table Editing**:

  - Toggle values (0, 1, X) in function columns.
  - Combine rows in variable columns by bit difference using "X" for unselected states.

- **Solve Methods**:

  - Min-term and max-term methods to simplify logical expressions.

- **Results Display**:
  - Simplified equations for each function.
  - Quine-McCluskey tables to show the solving process.

## Live Demo

Try the application live: [Truth Table Solver](https://mr-alimuhammadi.github.io/truth-table-solver/)

## Installation

1. Clone the repository:
   ```bash
   https://github.com/mr-alimuhammadi/truth-table-solver.git
   ```
2. Navigate to the project directory:
   ```bash
   cd truth-table-solver
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Input the variable and function names.
2. Generate the truth table.
3. Edit table cells as needed:
   - Click on function cells to toggle values.
   - Click on variable cells to combine rows based on bit differences.
4. Select a solve method (min-term or max-term).
5. Click the "Solve" button to calculate:
   - Simplified equations.
   - Quine-McCluskey tables.

## Technologies Used

- **Vite**: Fast development build tool.
- **React**: Frontend library for building user interfaces.
- **TypeScript**: Strongly typed JavaScript.
- **SASS**: For styling the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributions

Contributions are welcome! Feel free to fork the project, submit issues, or open pull requests.

## Contact

For any inquiries or suggestions, please reach out to [mr.alimuhammdi@gmail.com].

---
