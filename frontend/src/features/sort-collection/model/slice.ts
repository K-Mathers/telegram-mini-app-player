import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ISortState {
    sortBy: string;
}

const initialState: ISortState = {
    sortBy: "",
};

const sortSlice = createSlice({
    name: "sort",
    initialState,
    reducers: {
        setSortBy(state, action: PayloadAction<string>) {
            state.sortBy = action.payload
        }
    },
});

export const { setSortBy } = sortSlice.actions
export const sortReducer = sortSlice.reducer