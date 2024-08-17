import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";


export interface VariablesState {
    variables: string[]
} 

const initialState: VariablesState = {
    variables: []
};

const variablesSlice = createSlice({
    name: "variables",
    initialState,
    reducers: {
        addVariable: (state, action: PayloadAction<string>) => {
            state.variables.push(action.payload);
        },
        removeVariable: (state, action: PayloadAction<string>) => {
            state.variables = state.variables.filter(v => v != action.payload);
        }
    }
});


export const variablesReducer = variablesSlice.reducer;
export const {addVariable, removeVariable} = variablesSlice.actions;
export const selectVariables = (state: RootState) => state.variables.variables;