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
        addLogicalFunction: (state, action: PayloadAction<LogicalFunction> ) => {
            state.logicalFunctions.push(action.payload);
        },
        removeLogicalFunction: (state, action: PayloadAction<LogicalFunction>) => {
            state.logicalFunctions = state.logicalFunctions.filter(f => f.name !== action.payload.name);
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
        addMinTerm: (state, action: PayloadAction<{logicalFuncion: LogicalFunction, minTerm: number}>) => {
            const logicalFuntion = state.logicalFunctions.find(f => f.name == action.payload.logicalFuncion.name);
            if (logicalFuntion) {
                logicalFuntion.minTerms.push(action.payload.minTerm);
            }
        },
        removeMinTerm: (state, action: PayloadAction<{logicalFuncion: LogicalFunction, minTerm: number}>) => {
            const logicalFuntion = state.logicalFunctions.find(f => f.name == action.payload.logicalFuncion.name);
            if (logicalFuntion) {
                logicalFuntion.minTerms = logicalFuntion.minTerms.filter(m => m !== action.payload.minTerm);
            }
        },
        addDoNotCare: (state, action: PayloadAction<{logicalFuncion: LogicalFunction, doNotCare: number}>) => {
            const logicalFuntion = state.logicalFunctions.find(f => f.name == action.payload.logicalFuncion.name);
            if (logicalFuntion) {
                logicalFuntion.doNotCares.push(action.payload.doNotCare);
            }
        },
        removeDoNotCare: (state, action: PayloadAction<{logicalFuncion: LogicalFunction, doNotCare: number}>) => {
            const logicalFuntion = state.logicalFunctions.find(f => f.name == action.payload.logicalFuncion.name);
            if (logicalFuntion) {
                logicalFuntion.doNotCares = logicalFuntion.doNotCares.filter(d => d !== action.payload.doNotCare);
            }
        },
    }

});

export const logicalFunctionsReducer = LogicalFunctionsSlice.reducer;
export const {addLogicalFunction, removeLogicalFunction, updateLogicalFunctions,addMinTerm,removeMinTerm,addDoNotCare,removeDoNotCare} = LogicalFunctionsSlice.actions;
export const selectLogicalFunctins = (state: RootState) => state.logicalFunctions.logicalFunctions;