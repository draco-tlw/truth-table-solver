import { configureStore } from "@reduxjs/toolkit";
import { variablesReducer } from "./features/variables-slice";
import { logicalFunctionsReducer } from "./features/logical-functions-slice";
import { equationsReducer } from "./features/equations-slice";
import { qmcTablesReducer } from "./features/qmc-tables-slice";

export const store = configureStore({
  reducer: {
    variables: variablesReducer,
    logicalFunctions: logicalFunctionsReducer,
    equations: equationsReducer,
    qmcTables: qmcTablesReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
