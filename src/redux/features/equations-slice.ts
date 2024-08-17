import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Equation } from "../../types/equation";
import { RootState } from "../store";

export interface EquationsState {
  equations: Equation[];
}
const initialState: EquationsState = {
  equations: [],
};

const equationsSlice = createSlice({
  name: "equations",
  initialState,
  reducers: {
    addEquation: (state, action: PayloadAction<Equation>) => {
      state.equations.push(action.payload);
    },
    clearEquations: (state) => {
      state.equations = [];
    },
  },
});

export const equationsReducer = equationsSlice.reducer;
export const { addEquation, clearEquations } = equationsSlice.actions;
export const selectEquations = (state: RootState) => state.equations.equations;
