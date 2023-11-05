import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  value: [],
  loadingStatus: "idle",
};

export const fetchData = createAsyncThunk("info/fetchData", async () => {
  try {
    const response = await fetch("https://bgaa.by/test");
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data
  } catch (error) {
    
  }
});

export const tableSlice = createSlice({
  name: "info",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.value = action.payload;
        state.loadingStatus = "idle";
      })
      .addCase(fetchData.rejected, (state) => {
        state.loadingStatus = "error";
      });
  },
});

const { actions, reducer } = tableSlice;

export default reducer;
