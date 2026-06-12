import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const addWord = createAsyncThunk(
  'library/addWord',
  async ({ word, devMode }, { rejectWithValue }) => {
    try {
      await api.addWord(word, devMode);
      return word;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const librarySlice = createSlice({
  name: 'library',
  initialState: {
    reloadKey: 0,
    adding: false,
  },
  reducers: {
    bumpLibraryReload(state) {
      state.reloadKey += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addWord.pending, (state) => {
        state.adding = true;
      })
      .addCase(addWord.fulfilled, (state) => {
        state.adding = false;
        state.reloadKey += 1;
      })
      .addCase(addWord.rejected, (state) => {
        state.adding = false;
      });
  },
});

export const { bumpLibraryReload } = librarySlice.actions;
export default librarySlice.reducer;
