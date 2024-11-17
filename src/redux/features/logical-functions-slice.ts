import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LogicalFunction from "../../types/logical-function";
import { RootState } from "../store";

export interface LogicalFunctionsState {
  logicalFunctions: LogicalFunction[];
}
const initialState: LogicalFunctionsState = {
  logicalFunctions: [],
};

const LogicalFunctionsSlice = createSlice({
  name: "logical-functions",
  initialState,
  reducers: {
    addLogicalFunction: (state, action: PayloadAction<LogicalFunction>) => {
      state.logicalFunctions.push(action.payload);
    },
    removeLogicalFunction: (state, action: PayloadAction<LogicalFunction>) => {
      state.logicalFunctions = state.logicalFunctions.filter(
        (f) => f.name !== action.payload.name
      );
    },
    updateLogicalFunctions: (state, action: PayloadAction<number>) => {
      for (const logicalFunction of state.logicalFunctions) {
        logicalFunction.minTerms = logicalFunction.minTerms.filter(
          (minTerm) => minTerm < Math.pow(2, action.payload)
        );
        logicalFunction.doNotCares = logicalFunction.doNotCares.filter(
          (doNotCare) => doNotCare < Math.pow(2, action.payload)
        );
      }
    },
    addMinTerm: (
      state,
      action: PayloadAction<{
        logicalFunction: LogicalFunction;
        minTerm: number;
      }>
    ) => {
      const logicalFunction = state.logicalFunctions.find(
        (f) => f.name == action.payload.logicalFunction.name
      );
      if (logicalFunction) {
        logicalFunction.minTerms.push(action.payload.minTerm);
      }
    },
    removeMinTerm: (
      state,
      action: PayloadAction<{
        logicalFunction: LogicalFunction;
        minTerm: number;
      }>
    ) => {
      const logicalFunction = state.logicalFunctions.find(
        (f) => f.name == action.payload.logicalFunction.name
      );
      if (logicalFunction) {
        logicalFunction.minTerms = logicalFunction.minTerms.filter(
          (m) => m !== action.payload.minTerm
        );
      }
    },
    addDoNotCare: (
      state,
      action: PayloadAction<{
        logicalFunction: LogicalFunction;
        doNotCare: number;
      }>
    ) => {
      const logicalFunction = state.logicalFunctions.find(
        (f) => f.name == action.payload.logicalFunction.name
      );
      if (logicalFunction) {
        logicalFunction.doNotCares.push(action.payload.doNotCare);
      }
    },
    removeDoNotCare: (
      state,
      action: PayloadAction<{
        logicalFunction: LogicalFunction;
        doNotCare: number;
      }>
    ) => {
      const logicalFunction = state.logicalFunctions.find(
        (f) => f.name == action.payload.logicalFunction.name
      );
      if (logicalFunction) {
        logicalFunction.doNotCares = logicalFunction.doNotCares.filter(
          (d) => d !== action.payload.doNotCare
        );
      }
    },
  },
});

export const logicalFunctionsReducer = LogicalFunctionsSlice.reducer;
export const {
  addLogicalFunction,
  removeLogicalFunction,
  updateLogicalFunctions,
  addMinTerm,
  removeMinTerm,
  addDoNotCare,
  removeDoNotCare,
} = LogicalFunctionsSlice.actions;
export const selectLogicalFunctions = (state: RootState) =>
  state.logicalFunctions.logicalFunctions;
