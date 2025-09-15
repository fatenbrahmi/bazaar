import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories as fetchCategoriesAPI } from "../../api/fetchCategories"; // Chemin de ton API

// Thunk async
export const fetchCategories = createAsyncThunk(
  "categorySlice/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const data = await fetchCategoriesAPI();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Erreur de chargement des catégories");
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categorySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
