import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QMCTable } from "../../types/quine-mc-cluskey-table";
import { RootState } from "../store";

export interface QMCTablesState {
  qmcTables: QMCTable[];
}

const initialState: QMCTablesState = {
  qmcTables: [],
};

const qmcTablesSlice = createSlice({
  name: "qmc-tables",
  initialState,
  reducers: {
    addQMCTable: (state, action: PayloadAction<QMCTable>) => {
      state.qmcTables.push(action.payload);
    },
    clearQMCTables: (state) => {
      state.qmcTables = [];
    },
  },
});

export const qmcTablesReducer = qmcTablesSlice.reducer;
export const { addQMCTable, clearQMCTables } = qmcTablesSlice.actions;
export const selectQMCTables = (state: RootState) => state.qmcTables.qmcTables;
