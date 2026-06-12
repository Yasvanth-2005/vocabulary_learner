import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    tab: 'library',
    toast: { message: '', type: 'success' },
  },
  reducers: {
    setTab(state, action) {
      state.tab = action.payload;
    },
    showToast(state, action) {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type ?? 'success',
      };
    },
    dismissToast(state) {
      state.toast = { message: '', type: 'success' };
    },
  },
});

export const { setTab, showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
