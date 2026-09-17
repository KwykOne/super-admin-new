import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./features/todoSlice";

export const store = configureStore({
  reducer: {
    modal: dashboardReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;