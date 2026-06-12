import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';

export const fetchDueQueue = createAsyncThunk(
  'review/fetchDueQueue',
  async (devMode, { rejectWithValue }) => {
    try {
      const [countData, dueData] = await Promise.all([
        api.getDueCount(devMode),
        api.getDueWords(devMode),
      ]);
      return { count: countData.count, words: dueData };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    condition: (_, { getState }) => !getState().review.isFetchingDue,
  }
);

export const submitReview = createAsyncThunk(
  'review/submitReview',
  async ({ id, outcome, devMode }, { rejectWithValue }) => {
    try {
      await api.submitReview(id, outcome, devMode);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    dueWords: [],
    dueCount: 0,
    loadingDue: true,
    isFetchingDue: false,
    submitting: false,
  },
  reducers: {
    removeDueWord(state, action) {
      const id = action.payload;
      state.dueWords = state.dueWords.filter((w) => w._id !== id);
      state.dueCount = Math.max(0, state.dueCount - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDueQueue.pending, (state) => {
        state.loadingDue = true;
        state.isFetchingDue = true;
      })
      .addCase(fetchDueQueue.fulfilled, (state, action) => {
        state.loadingDue = false;
        state.isFetchingDue = false;
        state.dueCount = action.payload.count;
        state.dueWords = action.payload.words;
      })
      .addCase(fetchDueQueue.rejected, (state) => {
        state.loadingDue = false;
        state.isFetchingDue = false;
      })
      .addCase(submitReview.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitting = false;
        const id = action.payload;
        state.dueWords = state.dueWords.filter((w) => w._id !== id);
        state.dueCount = Math.max(0, state.dueCount - 1);
      })
      .addCase(submitReview.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const { removeDueWord } = reviewSlice.actions;
export default reviewSlice.reducer;
