import { configureStore } from "@reduxjs/toolkit";
import { variablesReducer } from "./features/variables-slice";
import { logicalFunctionsReducer } from "./features/logical-functions-slice";
import { equationsReducer } from "./features/equations-slice";
import { qmcTablesReducer } from "./features/qmc-tables-slice";
import { PIsAndEPIsReducer } from "./features/pis-and-epis-slice";

export const store = configureStore({
  reducer: {
    variables: variablesReducer,
    logicalFunctions: logicalFunctionsReducer,
    equations: equationsReducer,
    qmcTables: qmcTablesReducer,
    PIsAndEPIs: PIsAndEPIsReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
