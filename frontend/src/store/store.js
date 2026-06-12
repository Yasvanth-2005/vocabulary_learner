import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import reviewReducer from './slices/reviewSlice';
import libraryReducer from './slices/librarySlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    review: reviewReducer,
    library: libraryReducer,
  },
});
