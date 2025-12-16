import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import appointmentReducer from './appointmentSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    appointments: appointmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
