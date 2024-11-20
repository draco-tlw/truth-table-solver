import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { PIData } from "../../types/PI-data";

export interface PIsAndEPIsState {
  PIsAndEPIs: {
    PIs: PIData[];
    EPIs: PIData[];
  }[];
}
const initialState: PIsAndEPIsState = {
  PIsAndEPIs: [],
};

const PIsAndEPIsSlice = createSlice({
  name: "PIs",
  initialState,
  reducers: {
    addPIsAndEPIs: (
      state,
      action: PayloadAction<{ PIs: PIData[]; EPIs: PIData[] }>
    ) => {
      state.PIsAndEPIs.push({
        PIs: action.payload.PIs,
        EPIs: action.payload.EPIs,
      });
    },
    clearPIsAndEPIs: (state) => {
      state.PIsAndEPIs = [];
    },
  },
});

export const PIsAndEPIsReducer = PIsAndEPIsSlice.reducer;
export const { addPIsAndEPIs, clearPIsAndEPIs } = PIsAndEPIsSlice.actions;
export const selectPIsAndEPIs = (state: RootState) =>
  state.PIsAndEPIs.PIsAndEPIs;
