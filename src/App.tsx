import styles from "./App.module.scss";
import Navbar from "./components/navbar.tsx";
import Footer from "./components/footer.tsx";
import GenerateTable from "./components/generate-table.tsx";
import TruthTable from "./components/truth-table.tsx";
import Test from "./test/test.ts";
import Equations from "./components/equations.tsx";
import QMCTables from "./components/qmc-tables.tsx";

function App() {
  Test();

  return (
    <>
      <Navbar />
      <div className={styles.main}>
        <GenerateTable />
        <TruthTable />
        <Equations />
        <QMCTables />
      </div>
      <Footer />
    </>
  );
}

export default App;
