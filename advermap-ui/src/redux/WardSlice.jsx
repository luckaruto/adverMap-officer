import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { WardService } from "services/ward/WardService"; // Adjust the import path based on your project structure

export const fetchWards = createAsyncThunk(
    "city/fetchWards",
    async ({  }, thunkApi) => {
        try {
            const wards = await WardService.getWards();
            return wards;
        } catch (error) {
            return thunkApi.rejectWithValue(error);
        }
    }
);

const initialState = {
    entities: [],
    loading: false,
    error: null,
};

const wardSlice = createSlice({
    name: "ward",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchWards.fulfilled, (state, action) => {
            return {
              entities: action.payload,
              loading: false,
              error: null,
            };
          });
          builder.addCase(fetchWards.pending, (state, action) => {
            return {
              entities: [],
              loading: true,
              error: null,
            };
          });
          builder.addCase(fetchWards.rejected, (state, action) => {
            return {
              entities: [],
              loading: false,
              error: action.payload,
            };
          });
    },
});

export const {} = wardSlice.actions;
export default wardSlice.reducer;
